import type { MetadataRoute } from "next";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${SITE_URL}/newsletter`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, categorySlug: true, updatedAt: true },
    });
    articlePages = articles.map((a) => ({
      url: `${SITE_URL}/${a.categorySlug}/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not connected
  }

  return [...staticPages, ...categoryPages, ...articlePages];
}
