import { Metadata } from 'next';
import Link from 'next/link';
import { getShopPolicies } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Read our store policies including privacy, shipping, and refunds.',
};

export const revalidate = 3600;

export default async function PoliciesPage() {
  const policies = await getShopPolicies();

  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Policies
        </h1>

        {policies.length === 0 ? (
          <p className="text-gray-500">No policies available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {policies.map((policy) => (
              <li key={policy.id} className="py-4">
                <Link
                  href={`/policies/${policy.handle}`}
                  className="text-lg font-medium text-primary-600 hover:text-primary-700"
                >
                  {policy.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
