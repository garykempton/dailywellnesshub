/**
 * Verify all relatedTools slugs and relatedArticles hrefs in TOOLS_REGISTRY.
 */
import { TOOLS_REGISTRY, getToolBySlug } from "../src/lib/tools";
import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, categorySlug: true },
  });
  const validPaths = new Set(articles.map(a => `/${a.categorySlug}/${a.slug}`));

  let brokenTools = 0;
  let brokenArticles = 0;

  for (const tool of TOOLS_REGISTRY) {
    // Check relatedTools
    for (const slug of tool.relatedTools) {
      if (!getToolBySlug(slug)) {
        console.log(`[BROKEN TOOL] ${tool.slug} → relatedTools: "${slug}" not found`);
        brokenTools++;
      }
    }
    // Check relatedArticles
    for (const ra of tool.relatedArticles) {
      if (!validPaths.has(ra.href)) {
        console.log(`[BROKEN ARTICLE] ${tool.slug} → relatedArticles: "${ra.href}" not found`);
        brokenArticles++;
      }
    }
  }

  console.log(`\n=== TOOLS REGISTRY VERIFICATION ===`);
  console.log(`Total tools: ${TOOLS_REGISTRY.length}`);
  console.log(`Broken relatedTools refs: ${brokenTools}`);
  console.log(`Broken relatedArticles hrefs: ${brokenArticles}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
