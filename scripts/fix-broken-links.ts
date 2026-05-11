import "dotenv/config";
import { prisma } from "../src/lib/db";

/**
 * Fix broken internal links in article bodies.
 *
 * Problem: Content pipeline used wrong category prefixes in href attributes.
 * Solution: Build a slug→path map from all published articles, then rewrite
 * any body href whose slug exists but has wrong category prefix.
 */

async function main() {
  const dryRun = !process.argv.includes("--commit");
  if (dryRun) console.log("DRY RUN — pass --commit to apply changes\n");

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, categorySlug: true, body: true },
  });

  // Build slug → correct path map
  const slugToPath = new Map<string, string>();
  for (const a of articles) {
    slugToPath.set(a.slug, `/${a.categorySlug}/${a.slug}`);
  }

  // Also build full path set for quick lookups
  const validPaths = new Set<string>();
  for (const a of articles) {
    validPaths.add(`/${a.categorySlug}/${a.slug}`);
  }

  const linkPattern = /href="(\/([a-z-]+)\/([a-z0-9-]+))"/g;
  let totalFixed = 0;
  let articlesUpdated = 0;

  for (const article of articles) {
    if (!article.body) continue;

    let newBody = article.body;
    let fixCount = 0;

    newBody = newBody.replace(linkPattern, (match, fullPath, category, slug) => {
      // If the path is already valid, leave it
      if (validPaths.has(fullPath)) return match;

      // If we know the correct path for this slug, fix it
      const correctPath = slugToPath.get(slug);
      if (correctPath && correctPath !== fullPath) {
        fixCount++;
        return `href="${correctPath}"`;
      }

      // Unknown slug — leave it (will show in report)
      return match;
    });

    if (fixCount > 0) {
      totalFixed += fixCount;
      articlesUpdated++;
      console.log(`${article.categorySlug}/${article.slug}: fixed ${fixCount} links`);

      if (!dryRun) {
        await prisma.article.update({
          where: { id: article.id },
          data: { body: newBody },
        });
      }
    }
  }

  console.log(`\nTotal links fixed: ${totalFixed}`);
  console.log(`Articles updated: ${articlesUpdated}`);
  if (dryRun) console.log("\nRe-run with --commit to apply.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
