import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse our curated collections of mushroom wellness products.',
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await getCollections(20);

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Collections</h1>
        <p className="mt-2 text-gray-600">
          Explore our curated collections of mushroom-based wellness products.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No collections available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]"
            >
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-700" />
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h2 className="text-2xl font-bold text-center">{collection.title}</h2>
                {collection.description && (
                  <p className="mt-2 text-sm text-center text-white/80 max-w-xs line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <span className="mt-4 text-sm font-medium border border-white/60 rounded-full px-4 py-1.5 group-hover:bg-white/20 transition-colors">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
