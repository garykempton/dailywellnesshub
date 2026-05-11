import type { MetadataRoute } from "next";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { TOOLS_REGISTRY, TOOL_CATEGORIES } from "@/lib/tools";

// Next.js supports generateSitemaps() for index-based splitting.
// Each sitemap can hold up to 50,000 URLs. We split by:
//   sitemap 0: static + category pages
//   sitemap 1+: article pages in chunks of 5,000

const ARTICLES_PER_SITEMAP = 5000;

export async function generateSitemaps() {
  let articleCount = 0;
  try {
    articleCount = await prisma.article.count({
      where: { status: "PUBLISHED" },
    });
  } catch {
    // DB not connected
  }

  const articleSitemaps = Math.max(1, Math.ceil(articleCount / ARTICLES_PER_SITEMAP));

  // id 0 = static pages, id 1..N = article chunks
  return Array.from({ length: 1 + articleSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Sitemap 0: static + category pages
  if (id === 0) {
    const staticPages: MetadataRoute.Sitemap = [
      { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
      { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
      { url: `${SITE_URL}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
      { url: `${SITE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ];

    const toolPages: MetadataRoute.Sitemap = TOOLS_REGISTRY.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const toolCategoryPages: MetadataRoute.Sitemap = TOOL_CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/tools/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...toolPages, ...toolCategoryPages, ...categoryPages];
  }

  // Sitemap 1+: article pages in chunks
  const chunkIndex = id - 1;
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, categorySlug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
      skip: chunkIndex * ARTICLES_PER_SITEMAP,
      take: ARTICLES_PER_SITEMAP,
    });

    return articles.map((a) => ({
      url: `${SITE_URL}/${a.categorySlug}/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}
