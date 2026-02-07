import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogs } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles about mushroom wellness, health tips, and more.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const blogs = await getBlogs(10);

  const allArticles = blogs.flatMap((blog) => blog.articles);

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Blog</h1>
        <p className="mt-2 text-gray-600">
          Insights, tips, and stories about mushroom wellness.
        </p>
      </div>

      {allArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No blog posts yet.</p>
          <p className="mt-2 text-gray-400">Check back soon for new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allArticles.map((article) => (
            <article key={article.id} className="group">
              <Link href={`/blog/${article.blog.handle}/${article.handle}`}>
                {article.image ? (
                  <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <Image
                      src={article.image.url}
                      alt={article.image.altText || article.title}
                      width={600}
                      height={338}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 mb-4" />
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{article.blog.title}</span>
                  <span>&middot;</span>
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <p className="mt-3 text-sm font-medium text-primary-600">
                  Read more <span aria-hidden="true">&rarr;</span>
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
