/**
 * Remap all relatedArticles in tools.ts to point to actual published articles.
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";
import * as fs from "fs";

interface Article {
  slug: string;
  categorySlug: string;
  title: string;
  path: string;
  words: Set<string>;
}

const STOP = new Set(["a","an","the","and","or","for","to","of","in","on","is","it","by","at","as","do","how","what","why","your","you","with","that","this","from","can","are","be","has","have","not","but","will","all","more","when","than","out","its","also","our","up","no","so","if","about","just","into","guide","complete","practical"]);

function tokenize(text: string): Set<string> {
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP.has(w))
  );
}

function scoreMatch(toolWords: Set<string>, toolCat: string, article: Article): number {
  let score = 0;
  for (const w of toolWords) {
    if (article.words.has(w)) score += 1;
  }
  // Bonus for category alignment
  const artCat = guessArticleCategory(toolCat);
  if (article.categorySlug === artCat) score += 0.5;
  return score;
}

function guessArticleCategory(toolCatSlug: string): string {
  const map: Record<string, string> = {
    "fitness-calculators": "fitness",
    "nutrition-calculators": "nutrition",
    "wellness-tools": "mental-wellness",
    "sleep-tools": "sleep",
    "recovery-tools": "fitness",
    "body-composition": "weight-loss",
    "heart-health": "fitness",
    "hydration-tools": "nutrition",
  };
  return map[toolCatSlug] || toolCatSlug.replace("-calculators", "").replace("-tools", "");
}

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, categorySlug: true, title: true },
  });

  const articleData: Article[] = articles.map(a => ({
    slug: a.slug,
    categorySlug: a.categorySlug,
    title: a.title,
    path: `/${a.categorySlug}/${a.slug}`,
    words: new Set([...tokenize(a.slug.replace(/-/g, " ")), ...tokenize(a.title)]),
  }));

  const toolsPath = "C:/Users/user/Desktop/wellness-answers/src/lib/tools.ts";
  let toolsFile = fs.readFileSync(toolsPath, "utf8");

  // Match relatedArticles blocks - they span from "relatedArticles: [" to the closing "],"
  const raPattern = /relatedArticles:\s*\[[\s\S]*?\],/g;
  let replacements: { start: number; end: number; newText: string }[] = [];

  let raMatch;
  while ((raMatch = raPattern.exec(toolsFile)) !== null) {
    const blockStart = raMatch.index;
    const blockEnd = blockStart + raMatch[0].length;
    const block = raMatch[0];

    // Skip the type definition line
    if (block.includes("{ title: string")) continue;

    // Look backwards for tool context
    const preceding = toolsFile.slice(Math.max(0, blockStart - 3000), blockStart);
    const slugMatches = [...preceding.matchAll(/slug:\s*"([^"]+)"/g)];
    const nameMatches = [...preceding.matchAll(/name:\s*"([^"]+)"/g)];
    const catMatches = [...preceding.matchAll(/category:\s*"([^"]+)"/g)];

    if (slugMatches.length === 0) continue;

    const toolSlug = slugMatches[slugMatches.length - 1][1];
    const toolName = nameMatches.length > 0 ? nameMatches[nameMatches.length - 1][1] : toolSlug;
    const toolCat = catMatches.length > 0 ? catMatches[catMatches.length - 1][1] : "";

    const toolWords = new Set([
      ...tokenize(toolSlug.replace(/-/g, " ")),
      ...tokenize(toolName),
    ]);

    // Check if current hrefs are all valid
    const hrefMatches = [...block.matchAll(/href:\s*"([^"]+)"/g)];
    const validPaths = new Set(articleData.map(a => a.path));
    const allValid = hrefMatches.every(m => validPaths.has(m[1]));
    if (allValid && hrefMatches.length > 0) continue; // Already good

    // Score and pick best articles
    const scored = articleData
      .map(a => ({ article: a, score: scoreMatch(toolWords, toolCat, a) }))
      .filter(s => s.score >= 1.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (scored.length === 0) {
      const artCat = guessArticleCategory(toolCat);
      const sameCat = articleData.filter(a => a.categorySlug === artCat);
      if (sameCat.length > 0) {
        scored.push(...sameCat.slice(0, 2).map(a => ({ article: a, score: 0.5 })));
      }
    }

    if (scored.length === 0) continue;

    // Detect indentation from original block
    const newEntries = scored.map(s =>
      `      { title: "${s.article.title.replace(/"/g, '\\"')}", href: "${s.article.path}" }`
    ).join(",\n");

    const newBlock = `relatedArticles: [\n${newEntries},\n    ],`;

    replacements.push({ start: blockStart, end: blockEnd, newText: newBlock });
    console.log(`${toolSlug}: ${hrefMatches.length} broken → ${scored.length} matched`);
  }

  // Apply in reverse
  replacements.sort((a, b) => b.start - a.start);
  for (const r of replacements) {
    toolsFile = toolsFile.slice(0, r.start) + r.newText + toolsFile.slice(r.end);
  }

  fs.writeFileSync(toolsPath, toolsFile);
  console.log(`\nUpdated ${replacements.length} relatedArticles blocks`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
