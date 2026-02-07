import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getShopPolicies } from '@/lib/shopify';

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const policies = await getShopPolicies();
  const policy = policies.find((p) => p.handle === handle);
  if (!policy) return { title: 'Policy Not Found' };

  return { title: policy.title };
}

export const revalidate = 3600;

export default async function PolicyPage({ params }: Props) {
  const { handle } = await params;
  const policies = await getShopPolicies();
  const policy = policies.find((p) => p.handle === handle);

  if (!policy) {
    notFound();
  }

  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/policies" className="hover:text-primary-600">Policies</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{policy.title}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          {policy.title}
        </h1>
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />
      </div>
    </div>
  );
}
