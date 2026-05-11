/**
 * Audit and fix relatedArticles hrefs in TOOLS_REGISTRY.
 *
 * Reads the registry, checks each relatedArticles href against published
 * article paths, and outputs corrections needed.
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";
import * as fs from "fs";

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, categorySlug: true, title: true },
  });

  const slugToPath = new Map<string, string>();
  const slugToTitle = new Map<string, string>();
  const validPaths = new Set<string>();
  for (const a of articles) {
    const path = `/${a.categorySlug}/${a.slug}`;
    slugToPath.set(a.slug, path);
    slugToTitle.set(a.slug, a.title);
    validPaths.add(path);
  }

  // Read tools.ts and find all relatedArticles entries
  const toolsFile = fs.readFileSync("C:/Users/user/Desktop/wellness-answers/src/lib/tools.ts", "utf8");

  // Find all href patterns in relatedArticles
  const hrefPattern = /href:\s*"(\/[^"]+)"/g;
  let match;
  const brokenHrefs: { href: string; slug: string }[] = [];
  const fixable: { old: string; new: string }[] = [];

  while ((match = hrefPattern.exec(toolsFile)) !== null) {
    const href = match[1];
    if (validPaths.has(href)) continue;

    // Extract slug from href
    const parts = href.split("/").filter(Boolean);
    const slug = parts[parts.length - 1];

    if (slugToPath.has(slug)) {
      const correctPath = slugToPath.get(slug)!;
      fixable.push({ old: href, new: correctPath });
      console.log(`FIX: ${href} → ${correctPath}`);
    } else {
      brokenHrefs.push({ href, slug });
      console.log(`BROKEN (no matching article): ${href}`);
    }
  }

  console.log(`\nFixable (wrong category): ${fixable.length}`);
  console.log(`Broken (no article exists): ${brokenHrefs.length}`);

  // Output the broken slugs so we can find closest matches
  if (brokenHrefs.length > 0) {
    console.log("\n--- Broken slugs (need manual mapping) ---");
    for (const b of brokenHrefs) {
      // Try partial slug matching
      const candidates = articles.filter(a => {
        const words = b.slug.split("-");
        return words.some(w => w.length > 3 && a.slug.includes(w));
      }).slice(0, 3);
      console.log(`  ${b.href}`);
      if (candidates.length > 0) {
        for (const c of candidates) {
          console.log(`    candidate: /${c.categorySlug}/${c.slug} — "${c.title}"`);
        }
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
