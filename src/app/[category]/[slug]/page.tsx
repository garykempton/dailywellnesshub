import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleDisclaimer, AffiliateDisclosure } from "@/components/Disclaimer";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterForm } from "@/components/NewsletterForm";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

async function getArticle(categorySlug: string, slug: string) {
  try {
    return await prisma.article.findFirst({
      where: { slug, categorySlug, status: "PUBLISHED" },
      include: { tags: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);
  if (!article) return {};

  return {
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.excerpt || undefined,
    alternates: { canonical: `${SITE_URL}/${category}/${slug}` },
    openGraph: {
      type: "article",
      title: article.metaTitle || article.title,
      description: article.metaDesc || article.excerpt || undefined,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      ...(article.coverImage && { images: [article.coverImage] }),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;

  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const article = await getArticle(category, slug);
  if (!article) notFound();

  const sources: string[] = article.sources
    ? JSON.parse(article.sources)
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: article.title,
              description: article.metaDesc || article.excerpt || "",
              slug: `${category}/${slug}`,
              publishedAt: article.publishedAt?.toISOString() || "",
              updatedAt: article.updatedAt.toISOString(),
              author: article.author,
              coverImage: article.coverImage || undefined,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE_URL },
              { name: cat.name, url: `${SITE_URL}/${cat.slug}` },
              {
                name: article.title,
                url: `${SITE_URL}/${category}/${slug}`,
              },
            ]),
          ),
        }}
      />

      <article className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: cat.name, href: `/${cat.slug}` },
            { label: article.title },
          ]}
        />

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg text-muted">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-4 text-sm text-muted">
            <span className="font-medium text-foreground">
              {article.author}
            </span>
            <span>&middot;</span>
            <span>{article.readTime} min read</span>
            {article.publishedAt && (
              <>
                <span>&middot;</span>
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </>
            )}
          </div>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs bg-stone-100 text-muted px-2 py-1 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover image */}
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.coverAlt || article.title}
            className="w-full rounded-xl mb-8"
            loading="eager"
          />
        )}

        <AdSlot slot="article-top" format="horizontal" />

        {/* Body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        <AdSlot slot="article-bottom" format="rectangle" />

        {/* Sources */}
        {sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h2 className="font-semibold mb-2">Sources</h2>
            <ul className="text-sm text-muted space-y-1">
              {sources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="hover:text-primary underline break-all"
                  >
                    {src}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Affiliate disclosure */}
        {article.affiliateNote && <AffiliateDisclosure />}

        {/* Disclaimer */}
        <ArticleDisclaimer />

        {/* Newsletter CTA */}
        <div className="mt-8">
          <NewsletterForm variant="full" />
        </div>
      </article>
    </>
  );
}
