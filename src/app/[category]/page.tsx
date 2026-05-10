import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterForm } from "@/components/NewsletterForm";

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

  return {
    title: `${cat.name} — Wellness Tips & Guides`,
    description: cat.description,
    alternates: { canonical: `${SITE_URL}/${cat.slug}` },
    openGraph: {
      title: `${cat.name} | ${SITE_NAME}`,
      description: cat.description,
    },
  };
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE_URL },
              { name: cat.name, url: `${SITE_URL}/${cat.slug}` },
            ]),
          ),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: cat.name }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="mr-2">{cat.icon}</span>
            {cat.name}
          </h1>
          <p className="text-muted max-w-2xl">{cat.description}</p>
        </div>

        <AdSlot slot={`cat-${cat.slug}-top`} format="horizontal" />

        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
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
