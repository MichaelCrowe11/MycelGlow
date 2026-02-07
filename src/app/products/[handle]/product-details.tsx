'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/lib/shopify/types';
import { ProductGallery } from '@/components/product/product-gallery';
import { VariantSelector } from '@/components/product/variant-selector';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { formatPrice } from '@/lib/utils';

export function ProductDetails({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Image Gallery */}
      <ProductGallery images={product.images} />

      {/* Product Info */}
      <div className="flex flex-col">
        {product.vendor && (
          <p className="text-sm text-primary-600 font-medium">{product.vendor}</p>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          {product.title}
        </h1>

        {/* Price */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(selectedVariant.price)}
          </span>
          {selectedVariant.compareAtPrice &&
            parseFloat(selectedVariant.compareAtPrice.amount) >
              parseFloat(selectedVariant.price.amount) && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(selectedVariant.compareAtPrice)}
              </span>
            )}
          {selectedVariant.compareAtPrice &&
            parseFloat(selectedVariant.compareAtPrice.amount) >
              parseFloat(selectedVariant.price.amount) && (
              <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Sale
              </span>
            )}
        </div>

        {/* Short Description */}
        {product.description && (
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            {product.description.length > 300
              ? product.description.slice(0, 300) + '...'
              : product.description}
          </p>
        )}

        {/* Variant Selector */}
        <div className="mt-8">
          <VariantSelector
            options={product.options}
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
          />
        </div>

        {/* Add to Cart */}
        <div className="mt-8">
          <AddToCartButton
            variantId={selectedVariant.id}
            availableForSale={selectedVariant.availableForSale}
          />
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
