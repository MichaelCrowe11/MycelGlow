import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product/product-card';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of mushroom wellness products.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts({ first: 50 });

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Products</h1>
        <p className="mt-2 text-gray-600">
          Browse our complete collection of mushroom-based wellness products.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products available at this time.</p>
          <p className="mt-2 text-gray-400">Check back soon for new arrivals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
