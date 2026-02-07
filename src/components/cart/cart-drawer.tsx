'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { cart, isOpen, isLoading, closeCart, updateItem, removeItem } = useCart();

  if (!isOpen) return null;

  const lines = cart?.lines || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart {cart?.totalQuantity ? `(${cart.totalQuantity})` : ''}
          </h2>
          <button
            onClick={closeCart}
            className="rounded-md p-2 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close cart</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm">Add items to get started</p>
              <button
                onClick={closeCart}
                className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {lines.map((item) => {
                const image = item.merchandise.product.featuredImage;
                return (
                  <li key={item.id} className="flex py-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.altText || item.merchandise.product.title}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            <Link
                              href={`/products/${item.merchandise.product.handle}`}
                              onClick={closeCart}
                              className="hover:text-primary-600"
                            >
                              {item.merchandise.product.title}
                            </Link>
                          </h3>
                          {item.merchandise.title !== 'Default Title' && (
                            <p className="mt-1 text-xs text-gray-500">{item.merchandise.title}</p>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.cost.totalAmount)}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                removeItem(item.id);
                              } else {
                                updateItem(item.id, item.merchandise.id, item.quantity - 1);
                              }
                            }}
                            disabled={isLoading}
                            className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm text-gray-900 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItem(item.id, item.merchandise.id, item.quantity + 1)
                            }
                            disabled={isLoading}
                            className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && cart && (
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>{formatPrice(cart.cost.subtotalAmount)}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <a
              href={cart.checkoutUrl}
              className="block w-full rounded-md bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
            >
              Checkout
            </a>
            <button
              onClick={closeCart}
              className="mt-3 block w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
