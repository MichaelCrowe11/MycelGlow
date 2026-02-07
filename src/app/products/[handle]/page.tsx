import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByHandle, getProductRecommendations } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';
import { ProductDetails } from './product-details';

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const recommendations = await getProductRecommendations(product.id);

  return (
    <div className="container-page py-12">
      <ProductDetails product={product} />

      {/* Product Description */}
      {product.descriptionHtml && (
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
          <div
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
