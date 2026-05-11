import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import {
  buildMetadata,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot, InArticleAd } from "@/components/AdSlot";
import { NewsletterForm } from "@/components/NewsletterForm";
import { NewsletterInlineBlock } from "@/components/NewsletterInlineBlock";

interface Props {
  params: Promise<{ category: string }>;
}

function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) return {};

  return buildMetadata({
    title: `${cat.name} — Tips, Guides & Research`,
    description: cat.description,
    path: `/${cat.slug}`,
  });
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = findCategory(category);
  if (!cat) notFound();

  let articles: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    coverAlt: string | null;
    author: string;
    readTime: number;
    publishedAt: Date | null;
    categorySlug: string;
  }[] = [];

  try {
    articles = await prisma.article.findMany({
      where: { categorySlug: category, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        coverAlt: true,
        author: true,
        readTime: true,
        publishedAt: true,
        categorySlug: true,
      },
    });
  } catch {
    // DB not connected yet — show empty state
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: cat.name, url: `${SITE_URL}/${cat.slug}` },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: cat.name,
          description: cat.description,
          slug: cat.slug,
          articles: articles.map((a) => ({
            title: a.title,
            url: `${SITE_URL}/${cat.slug}/${a.slug}`,
          })),
        })}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumbs items={[{ label: cat.name }]} />

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{cat.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{cat.name}</h1>
          </div>
          <p className="text-muted max-w-2xl leading-relaxed">{cat.description}</p>
        </div>

        <AdSlot slot={`cat-${cat.slug}-top`} format="horizontal" />

        {articles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {articles.map((article, i) => (
                <>{/* In-feed ad after every 6th card */}
                  <ArticleCard key={article.slug} {...article} />
                  {i === 5 && articles.length > 6 && (
                    <div key="in-feed-ad" className="md:col-span-2 lg:col-span-3">
                      <InArticleAd slot={`cat-${cat.slug}-infeed`} />
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Newsletter block after articles */}
            <NewsletterInlineBlock
              heading={`Want more ${cat.name.toLowerCase()} tips?`}
              body={`Subscribe for weekly ${cat.name.toLowerCase()} guides and practical advice.`}
              className="mt-8"
            />
          </>
        ) : (
          <div className="text-center py-16 text-muted">
            <p className="text-lg mb-2">Articles coming soon!</p>
            <p className="text-sm">
              Subscribe to get notified when new {cat.name.toLowerCase()}{" "}
              content is published.
            </p>
            <div className="max-w-sm mx-auto mt-4">
              <NewsletterForm variant="inline" />
            </div>
          </div>
        )}

        <AdSlot slot={`cat-${cat.slug}-bottom`} format="horizontal" className="mt-8" />
      </div>
    </>
  );
}
