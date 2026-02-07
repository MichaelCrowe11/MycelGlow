import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArticle } from '@/lib/shopify';

type Props = {
  params: Promise<{ blogHandle: string; articleHandle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.seo.title || article.title,
    description: article.seo.description || article.excerpt || '',
  };
}

export const revalidate = 60;

export default async function ArticlePage({ params }: Props) {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);

  if (!article) {
    notFound();
  }

  return (
    <article className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <span>By {article.author.name}</span>
            <span>&middot;</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Featured Image */}
        {article.image && (
          <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 mb-10">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              width={900}
              height={506}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Back link */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <span aria-hidden="true">&larr;</span> Back to Blog
          </Link>
        </div>
      </div>
    </article>
  );
}
