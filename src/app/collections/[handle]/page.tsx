import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollectionByHandle } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return { title: 'Collection Not Found' };

  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description,
  };
}

export const revalidate = 60;

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle, { first: 50 });

  if (!collection) {
    notFound();
  }

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-2 text-gray-600">{collection.description}</p>
        )}
      </div>

      {collection.products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products in this collection yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collection.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
