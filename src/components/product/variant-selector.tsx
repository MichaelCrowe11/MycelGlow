'use client';

import { ProductVariant } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

type VariantSelectorProps = {
  options: { id: string; name: string; values: string[] }[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
};

export function VariantSelector({
  options,
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  if (options.length === 1 && options[0].values.length === 1) {
    return null;
  }

  const handleOptionChange = (optionName: string, value: string) => {
    const newSelectedOptions = selectedVariant.selectedOptions.map((opt) =>
      opt.name === optionName ? { ...opt, value } : opt
    );

    const matchingVariant = variants.find((variant) =>
      variant.selectedOptions.every((opt) =>
        newSelectedOptions.some(
          (selected) => selected.name === opt.name && selected.value === opt.value
        )
      )
    );

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const selectedValue = selectedVariant.selectedOptions.find(
          (opt) => opt.name === option.name
        )?.value;

        return (
          <div key={option.id}>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {option.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedValue === value;
                const optionVariant = variants.find((v) =>
                  v.selectedOptions.some(
                    (opt) => opt.name === option.name && opt.value === value
                  )
                );
                const isAvailable = optionVariant?.availableForSale ?? false;

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    disabled={!isAvailable}
                    className={cn(
                      'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : isAvailable
                          ? 'border-gray-300 bg-white text-gray-900 hover:border-primary-400'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
