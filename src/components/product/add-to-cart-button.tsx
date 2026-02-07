'use client';

import { useCart } from '@/context/cart-context';

type AddToCartButtonProps = {
  variantId: string;
  availableForSale: boolean;
  quantity?: number;
};

export function AddToCartButton({ variantId, availableForSale, quantity = 1 }: AddToCartButtonProps) {
  const { addItem, isLoading } = useCart();

  if (!availableForSale) {
    return (
      <button
        disabled
        className="w-full rounded-md bg-gray-300 px-6 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={() => addItem(variantId, quantity)}
      disabled={isLoading}
      className="w-full rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
