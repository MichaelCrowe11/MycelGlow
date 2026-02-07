import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const image = product.featuredImage;

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            width={500}
            height={500}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>
        {product.vendor && (
          <p className="mt-0.5 text-xs text-gray-500">{product.vendor}</p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(product.priceRange.minVariantPrice)}
          </span>
          {product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount && (
            <span className="text-xs text-gray-500">
              - {formatPrice(product.priceRange.maxVariantPrice)}
            </span>
          )}
        </div>
        {!product.availableForSale && (
          <p className="mt-1 text-xs font-medium text-red-500">Sold Out</p>
        )}
      </div>
    </Link>
  );
}
