import { Metadata } from 'next';
import { searchProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';
import { SearchBar } from '@/components/search/search-bar';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: 'Search our catalog of mushroom wellness products.',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const results = query ? await searchProducts(query, 20) : null;

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search</h1>
        <div className="mt-4 max-w-lg">
          <SearchBar />
        </div>
      </div>

      {query && results && (
        <>
          <p className="mb-6 text-sm text-gray-500">
            {results.products.length} result{results.products.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>

          {results.products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="mt-2 text-gray-400">
                Try adjusting your search or browse our collections.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Page Results */}
          {results.pages.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pages</h2>
              <ul className="space-y-3">
                {results.pages.map((page) => (
                  <li key={page.id}>
                    <a
                      href={`/pages/${page.handle}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {page.title}
                    </a>
                    {page.bodySummary && (
                      <p className="text-sm text-gray-500 mt-0.5">{page.bodySummary}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            Enter a search term to find products.
          </p>
        </div>
      )}
    </div>
  );
}
