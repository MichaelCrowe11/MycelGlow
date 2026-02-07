import Link from 'next/link';
import { getProducts, getCollections } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';
import Image from 'next/image';

export const revalidate = 60;

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts({ first: 8, sortKey: 'BEST_SELLING' }),
    getCollections(6),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white">
        <div className="container-page py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Unlock Nature&apos;s
              <span className="text-primary-300"> Glow</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-primary-100">
              Premium mushroom-based wellness products crafted to nourish your body and illuminate your natural radiance. Discover the power of mycelium.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/collections"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-900 shadow-sm hover:bg-primary-50 transition-colors"
              >
                Shop Collections
              </Link>
              <Link
                href="/products"
                className="text-sm font-semibold text-primary-200 hover:text-white transition-colors"
              >
                View All Products <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {collections.length > 0 && (
        <section className="container-page py-16 sm:py-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Shop by Collection
            </h2>
            <Link
              href="/collections"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-bold">{collection.title}</h3>
                  {collection.description && (
                    <p className="mt-2 text-sm text-center text-white/80 max-w-xs">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="container-page">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Best Sellers
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="container-page py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Premium Quality</h3>
            <p className="mt-2 text-sm text-gray-600">
              Sourced from the finest organic mushrooms and carefully processed to preserve their natural benefits.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Science-Backed</h3>
            <p className="mt-2 text-sm text-gray-600">
              Every product is developed with research-backed formulations for maximum efficacy.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 mb-4">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Sustainably Made</h3>
            <p className="mt-2 text-sm text-gray-600">
              Committed to sustainable practices from farm to bottle, respecting both people and planet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
