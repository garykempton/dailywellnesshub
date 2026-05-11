import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import {
  buildMetadata,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  extractFaqFromHtml,
  medicalDisclaimerJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  ArticleDisclaimer,
  AffiliateDisclosure,
} from "@/components/Disclaimer";
import { AdSlot, InArticleAd } from "@/components/AdSlot";
import { NewsletterForm } from "@/components/NewsletterForm";
import { NewsletterInlineBlock } from "@/components/NewsletterInlineBlock";
import { AffiliateProductBlock } from "@/components/AffiliateProductBlock";
import { PrintableDownloadCTA } from "@/components/PrintableDownloadCTA";
import { ArticleSidebar } from "@/components/ArticleSidebar";

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

async function getRelatedArticles(slugs: string[]) {
  if (!slugs.length) return [];
  try {
    return await prisma.article.findMany({
      where: { slug: { in: slugs }, status: "PUBLISHED" },
      select: { slug: true, categorySlug: true, title: true },
      take: 5,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);
  if (!article) return {};

  return buildMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.excerpt || "",
    path: `/${category}/${slug}`,
    ogType: "article",
    ogImage: article.coverImage || undefined,
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    authors: [article.author],
    tags: article.tags.map((t) => t.name),
  });
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

  const affiliateProducts: { url: string; label: string; vendor: string; description?: string; price?: string }[] =
    article.affiliateLinks ? JSON.parse(article.affiliateLinks) : [];

  const relatedArticles = await getRelatedArticles(article.relatedArticles || []);

  // Use stored FAQ if available, otherwise extract from headings
  const storedFaq = article.faqSection
    ? JSON.parse(article.faqSection)
    : null;
  const faqItems =
    storedFaq && storedFaq.length > 0
      ? storedFaq
      : extractFaqFromHtml(article.body);
  const faqData = faqJsonLd(faqItems);

  // Detect printable-style articles (slug contains "checklist", "template", "printable", "tracker", "planner")
  const isPrintable = /checklist|template|printable|tracker|planner/i.test(article.slug);

  return (
    <>
      {/* Article schema */}
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.metaDesc || article.excerpt || "",
          slug: `${category}/${slug}`,
          publishedAt: article.publishedAt?.toISOString() || "",
          updatedAt: article.updatedAt.toISOString(),
          author: article.author,
          coverImage: article.coverImage || undefined,
          wordCount: article.wordCount,
          tags: article.tags.map((t) => t.name),
          categoryName: cat.name,
        })}
      />

      {/* Breadcrumb schema */}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: cat.name, url: `${SITE_URL}/${cat.slug}` },
          {
            name: article.title,
            url: `${SITE_URL}/${category}/${slug}`,
          },
        ])}
      />

      {/* FAQ schema (auto-generated from H2 headings) */}
      <JsonLd data={faqData} />

      {/* Medical disclaimer schema */}
      <JsonLd data={medicalDisclaimerJsonLd()} />

      {/* Two-column layout: article + sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:flex lg:gap-10">
        <article className="flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
          <Breadcrumbs
            items={[
              { label: cat.name, href: `/${cat.slug}` },
              { label: article.title },
            ]}
          />

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-lg text-muted leading-relaxed">{article.excerpt}</p>
            )}
            <div className="flex items-center gap-2 mt-5 text-sm text-muted">
              <span className="font-semibold text-stone-700">
                {article.author}
              </span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span>{article.readTime} min read</span>
              {article.publishedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
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
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium"
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
              className="w-full rounded-2xl mb-10"
              loading="eager"
            />
          )}

          {/* Top ad */}
          <AdSlot slot={`${category}-article-top`} format="horizontal" />

          {/* Body */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* In-article ad (mid-content) */}
          <InArticleAd slot={`${category}-article-mid`} />

          {/* Inline newsletter block */}
          <NewsletterInlineBlock
            heading={`Want more ${cat.name.toLowerCase()} tips?`}
            body={`Get practical, evidence-based ${cat.name.toLowerCase()} advice delivered to your inbox.`}
            className="my-8"
          />

          {/* Printable download CTA for checklist/template articles */}
          {isPrintable && (
            <PrintableDownloadCTA
              title={article.title}
              description="Download this as a printable PDF to use offline."
              comingSoon
              className="my-8"
            />
          )}

          {/* Affiliate product block */}
          {affiliateProducts.length > 0 && (
            <AffiliateProductBlock
              products={affiliateProducts}
              className="my-8"
            />
          )}

          {/* Bottom ad */}
          <AdSlot slot={`${category}-article-bottom`} format="rectangle" />

          {/* Sources */}
          {sources.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border/60">
              <h2 className="font-bold text-lg mb-3">Sources</h2>
              <ul className="text-sm text-muted space-y-2">
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

          {/* Affiliate disclosure (if any affiliate content) */}
          {(article.affiliateNote || affiliateProducts.length > 0) && (
            <AffiliateDisclosure />
          )}

          {/* Disclaimer */}
          <ArticleDisclaimer />

          {/* Bottom newsletter CTA */}
          <div className="mt-8">
            <NewsletterForm variant="full" />
          </div>
        </article>

        {/* Desktop sidebar with ads, related articles, newsletter */}
        <ArticleSidebar
          categorySlug={category}
          relatedArticles={relatedArticles}
        />
      </div>
    </>
  );
}
