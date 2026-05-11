/**
 * Bulk-publish non-health-sensitive DRAFT articles to PUBLISHED status.
 * Health-sensitive categories (weight-loss, nutrition, menopause, healthy-ageing,
 * family-wellness, mental-wellness) are skipped and require manual review.
 *
 * Usage:
 *   npx tsx scripts/bulk-publish.ts              # dry run by default
 *   npx tsx scripts/bulk-publish.ts --commit     # actually update the DB
 */

import "dotenv/config";
import { prisma } from "../src/lib/db";

const HEALTH_SENSITIVE = [
  "weight-loss",
  "nutrition",
  "menopause",
  "healthy-ageing",
  "family-wellness",
  "mental-wellness",
];

const commit = process.argv.includes("--commit");

async function main() {
  const allDrafts = await prisma.article.findMany({
    where: { status: "DRAFT" },
    select: { id: true, slug: true, title: true, categorySlug: true, wordCount: true },
    orderBy: { createdAt: "desc" },
  });

  const safe = allDrafts.filter((a) => !HEALTH_SENSITIVE.includes(a.categorySlug));
  const sensitive = allDrafts.filter((a) => HEALTH_SENSITIVE.includes(a.categorySlug));

  console.log(`\nTotal DRAFT articles: ${allDrafts.length}`);
  console.log(`  Non-sensitive (will publish): ${safe.length}`);
  console.log(`  Health-sensitive (skipped):   ${sensitive.length}\n`);

  if (safe.length === 0) {
    console.log("No non-sensitive drafts to publish.");
    return;
  }

  console.log("Articles to publish:");
  for (const a of safe) {
    const words = a.wordCount ?? 0;
    const flag = words < 300 ? " [SHORT]" : "";
    console.log(`  [${a.categorySlug}] ${a.slug} (${words} words)${flag}`);
  }

  if (!commit) {
    console.log("\n--- DRY RUN --- Pass --commit to actually publish.\n");

    if (sensitive.length > 0) {
      console.log("Health-sensitive drafts (require manual review):");
      for (const a of sensitive) {
        console.log(`  [${a.categorySlug}] ${a.slug}`);
      }
    }
    return;
  }

  const now = new Date();
  const result = await prisma.article.updateMany({
    where: {
      status: "DRAFT",
      categorySlug: { notIn: HEALTH_SENSITIVE },
    },
    data: {
      status: "PUBLISHED",
      publishedAt: now,
    },
  });

  console.log(`\nPublished ${result.count} articles at ${now.toISOString()}`);

  if (sensitive.length > 0) {
    console.log(`\n${sensitive.length} health-sensitive drafts still need manual review:`);
    for (const a of sensitive) {
      console.log(`  [${a.categorySlug}] ${a.slug}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
