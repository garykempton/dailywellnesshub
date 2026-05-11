/**
 * Fix article body links that point to tools using wrong category prefix.
 * e.g. /fitness/heart-rate-calculator → /tools/heart-rate-calculator
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";

// Import tool slugs
import { TOOLS_REGISTRY } from "../src/lib/tools";

async function main() {
  const dryRun = !process.argv.includes("--commit");
  if (dryRun) console.log("DRY RUN — pass --commit to apply\n");

  const toolSlugs = new Set(TOOLS_REGISTRY.map(t => t.slug));

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, categorySlug: true, body: true },
  });

  const linkPattern = /href="(\/([a-z-]+)\/([a-z0-9-]+))"/g;
  let totalFixed = 0;

  for (const article of articles) {
    if (!article.body) continue;

    let newBody = article.body;
    let fixCount = 0;

    newBody = newBody.replace(linkPattern, (match, fullPath, category, slug) => {
      // If this slug is a tool but not linked via /tools/, fix it
      if (toolSlugs.has(slug) && category !== "tools") {
        fixCount++;
        return `href="/tools/${slug}"`;
      }
      return match;
    });

    if (fixCount > 0) {
      totalFixed += fixCount;
      console.log(`${article.categorySlug}/${article.slug}: fixed ${fixCount} tool links`);
      if (!dryRun) {
        await prisma.article.update({
          where: { id: article.id },
          data: { body: newBody },
        });
      }
    }
  }

  console.log(`\nTotal tool links fixed: ${totalFixed}`);
  if (dryRun) console.log("Re-run with --commit to apply.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
