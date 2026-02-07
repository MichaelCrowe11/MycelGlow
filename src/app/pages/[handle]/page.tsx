import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByHandle } from '@/lib/shopify';

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPageByHandle(handle);
  if (!page) return { title: 'Page Not Found' };

  return {
    title: page.seo.title || page.title,
    description: page.seo.description || page.bodySummary,
  };
}

export const revalidate = 60;

export default async function CmsPage({ params }: Props) {
  const { handle } = await params;
  const page = await getPageByHandle(handle);

  if (!page) {
    notFound();
  }

  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          {page.title}
        </h1>
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </div>
    </div>
  );
}
