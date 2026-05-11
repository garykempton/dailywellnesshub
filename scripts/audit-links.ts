import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      categorySlug: true,
      title: true,
      body: true,
      relatedTools: true,
      relatedArticles: true,
      internalLinks: true,
    },
  });

  console.log("TOTAL_PUBLISHED:", articles.length);

  // All article paths
  const paths = articles.map((a) => `/${a.categorySlug}/${a.slug}`);
  console.log("PATHS:" + JSON.stringify(paths));

  // Extract href links from article bodies
  const linkPattern = /href="(\/[^"]+)"/g;
  const bodyLinks: { from: string; href: string }[] = [];
  for (const a of articles) {
    const body = a.body || "";
    let m;
    while ((m = linkPattern.exec(body)) !== null) {
      bodyLinks.push({ from: `/${a.categorySlug}/${a.slug}`, href: m[1] });
    }
  }
  console.log("BODY_LINKS:" + JSON.stringify(bodyLinks));

  // Article metadata (relatedTools, relatedArticles, internalLinks)
  const meta = articles.map((a) => ({
    path: `/${a.categorySlug}/${a.slug}`,
    relatedTools: a.relatedTools || [],
    relatedArticles: a.relatedArticles || [],
    internalLinks: a.internalLinks || [],
  }));
  console.log("META:" + JSON.stringify(meta));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
