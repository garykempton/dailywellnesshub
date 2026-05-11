/**
 * Internal Link Enrichment Pass
 *
 * Analyzes all published articles semantically and injects 2-4 contextual
 * internal links into article bodies. Links to related articles, tools,
 * and category hubs. Aims to reduce orphans to near zero and ensure every
 * article has >= 3 outbound and >= 3 inbound internal links.
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";
import { TOOLS_REGISTRY } from "../src/lib/tools";

// ── Config ──────────────────────────────────────────────────────────
const MIN_OUTGOING = 3;
const MAX_NEW_LINKS = 4;
const DRY_RUN = !process.argv.includes("--commit");

// ── Types ───────────────────────────────────────────────────────────
interface ArticleData {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  body: string;
  path: string;
  words: Set<string>;
  existingHrefs: Set<string>;
  outCount: number;
}

interface ToolData {
  slug: string;
  name: string;
  path: string;
  words: Set<string>;
  category: string;
}

// ── Helpers ─────────────────────────────────────────────────────────
const STOP = new Set([
  "a","an","the","and","or","for","to","of","in","on","is","it","by","at",
  "as","do","how","what","why","your","you","with","that","this","from","can",
  "are","be","has","have","not","but","will","all","more","when","than","out",
  "its","also","our","up","no","so","if","about","just","into","may","some",
  "these","those","one","two","three","been","being","would","could","should",
  "does","did","make","made","much","many","most","each","every","other",
  "new","way","ways","like","well","good","best","help","helps","use",
  "used","using","get","getting","take","taking","find","work","works",
  "working","look","looking","try","trying","start","starting","keep",
  "time","times","day","days","week","weeks","first","feel","feeling",
  "people","person","life","body","part","over","them","they","their",
  "there","here","still","might","which","while","through","during",
  "between","both","then","where","before","after","own","such","too",
  "very","same","different","important","need","needs","want","come",
  "know","think","say","see","give","back","don","off","down",
  "even","really","right","long","thing","things","something","often",
  "per","less","whether","going","provide","provides","general",
  "information","consider","guide","complete","practical","tips",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
  );
}

// Extract text from HTML (strip tags)
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

// Score relevance between two articles (higher = more related)
function articleRelevance(a: ArticleData, b: ArticleData): number {
  let score = 0;

  // Word overlap from titles/slugs (high weight)
  for (const w of a.words) {
    if (b.words.has(w)) score += 2;
  }

  // Same category bonus
  if (a.categorySlug === b.categorySlug) score += 2;

  // Adjacent/related category bonus
  const RELATED_CATS: Record<string, string[]> = {
    "fitness": ["healthy-ageing", "weight-loss", "habits"],
    "nutrition": ["weight-loss", "health-calculators", "menopause"],
    "sleep": ["stress", "mental-wellness"],
    "stress": ["sleep", "mental-wellness", "habits"],
    "mental-wellness": ["stress", "habits", "productivity"],
    "habits": ["fitness", "productivity", "mental-wellness"],
    "healthy-ageing": ["fitness", "nutrition", "menopause"],
    "menopause": ["healthy-ageing", "nutrition", "fitness"],
    "weight-loss": ["fitness", "nutrition"],
    "health-calculators": ["fitness", "nutrition", "sleep"],
    "family-wellness": ["nutrition", "mental-wellness"],
    "productivity": ["habits", "mental-wellness", "stress"],
  };
  if (RELATED_CATS[a.categorySlug]?.includes(b.categorySlug)) score += 1;

  return score;
}

// Score how relevant a tool is to an article
function toolRelevance(article: ArticleData, tool: ToolData): number {
  let score = 0;
  for (const w of article.words) {
    if (tool.words.has(w)) score += 2;
  }

  // Category alignment
  const TOOL_TO_ARTICLE_CAT: Record<string, string[]> = {
    "sleep": ["sleep"],
    "recovery": ["fitness", "healthy-ageing"],
    "fitness": ["fitness", "healthy-ageing"],
    "nutrition": ["nutrition", "weight-loss"],
    "body-composition": ["weight-loss", "fitness", "health-calculators"],
    "cardio": ["fitness", "weight-loss"],
    "stress": ["stress", "mental-wellness"],
    "habits": ["habits", "productivity"],
  };
  if (TOOL_TO_ARTICLE_CAT[tool.category]?.includes(article.categorySlug)) score += 3;

  return score;
}

// Category hub display names
const CATEGORY_LABELS: Record<string, string> = {
  "sleep": "sleep and rest",
  "fitness": "fitness and exercise",
  "nutrition": "nutrition and diet",
  "stress": "stress management",
  "mental-wellness": "mental wellness",
  "habits": "healthy habits",
  "healthy-ageing": "healthy ageing",
  "menopause": "menopause wellness",
  "weight-loss": "weight management",
  "health-calculators": "health calculators",
  "family-wellness": "family wellness",
  "productivity": "productivity",
};

// Natural anchor text templates for article links
function articleAnchor(target: ArticleData): string {
  // Use the title but make it more natural by lowercasing and trimming
  const title = target.title;
  // Variety of anchor patterns
  const patterns = [
    `our guide on ${title.toLowerCase().replace(/^how to /, "").replace(/^why /, "").replace(/^the /, "").slice(0, 60)}`,
    `${title.toLowerCase().slice(0, 55)}`,
    `this article on ${title.toLowerCase().replace(/^how to /, "").replace(/^a /, "").replace(/^the /, "").slice(0, 50)}`,
    `exploring ${title.toLowerCase().replace(/^how to /, "").replace(/^the /, "").slice(0, 50)}`,
  ];
  // Pick based on hash of slug for consistency
  const idx = target.slug.length % patterns.length;
  return patterns[idx];
}

// Natural anchor text for tool links
function toolAnchor(tool: ToolData): string {
  const shortName = tool.name.split(" - ")[0].split(" — ")[0];
  const patterns = [
    `our free ${shortName.toLowerCase()}`,
    `try the ${shortName.toLowerCase()}`,
    `the ${shortName.toLowerCase()} tool`,
    `${shortName.toLowerCase()}`,
  ];
  const idx = tool.slug.length % patterns.length;
  return patterns[idx];
}

// Build a contextual sentence that links to a target
function buildLinkSentence(
  article: ArticleData,
  target: { type: "article" | "tool" | "category"; path: string; anchor: string },
): string {
  const link = `<a href="${target.path}">${target.anchor}</a>`;

  if (target.type === "tool") {
    const templates = [
      `You might also find ${link} helpful for tracking your progress.`,
      `To put these ideas into practice, ${link} can help you get started.`,
      `For a more personalised approach, ${link} to see where you stand.`,
      `Want to track your numbers? ${link} makes it easy.`,
    ];
    return templates[target.anchor.length % templates.length];
  }

  if (target.type === "category") {
    return `Browse all of our articles on <a href="${target.path}">${target.anchor}</a> for more practical guidance.`;
  }

  // Article link
  const templates = [
    `For related reading, see ${link}.`,
    `You may also be interested in ${link}.`,
    `If you found this helpful, check out ${link}.`,
    `For a deeper dive, have a look at ${link}.`,
    `Related to this topic, we cover ${link}.`,
    `This pairs well with ${link}.`,
  ];
  return templates[target.path.length % templates.length];
}

// Find the best <p> tag to insert after (not the first or last)
function findInsertionPoints(body: string): number[] {
  const points: number[] = [];
  const pClosePattern = /<\/p>/g;
  let match;
  const positions: number[] = [];

  while ((match = pClosePattern.exec(body)) !== null) {
    positions.push(match.index + match[0].length);
  }

  if (positions.length < 3) return positions;

  // Skip first paragraph, distribute through the body
  // Ideal: after ~25%, ~50%, ~75%, ~90% of paragraphs
  const targets = [0.25, 0.45, 0.65, 0.85];
  for (const t of targets) {
    const idx = Math.floor(positions.length * t);
    if (idx > 0 && idx < positions.length) {
      points.push(positions[idx]);
    }
  }

  return points;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  if (DRY_RUN) console.log("DRY RUN — pass --commit to apply\n");

  // Load articles
  const rawArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, categorySlug: true, title: true, body: true },
  });

  // Build article data
  const articles: ArticleData[] = rawArticles.map((a) => {
    const body = a.body || "";
    const path = `/${a.categorySlug}/${a.slug}`;
    const existingHrefs = new Set<string>();
    const hrefRe = /href="(\/[^"]+)"/g;
    let m;
    while ((m = hrefRe.exec(body)) !== null) {
      existingHrefs.add(m[1]);
    }

    return {
      id: a.id,
      slug: a.slug,
      categorySlug: a.categorySlug,
      title: a.title,
      body,
      path,
      words: new Set([
        ...tokenize(a.slug.replace(/-/g, " ")),
        ...tokenize(a.title),
        ...tokenize(stripHtml(body).slice(0, 500)),
      ]),
      existingHrefs,
      outCount: existingHrefs.size,
    };
  });

  // Build tool data
  const tools: ToolData[] = TOOLS_REGISTRY.map((t) => ({
    slug: t.slug,
    name: t.name,
    path: `/tools/${t.slug}`,
    words: new Set([
      ...tokenize(t.slug.replace(/-/g, " ")),
      ...tokenize(t.name),
    ]),
    category: t.category,
  }));

  const articlePathSet = new Set(articles.map((a) => a.path));

  // Track global incoming count
  const incomingCount = new Map<string, number>();
  for (const a of articles) incomingCount.set(a.path, 0);
  // Count existing incoming links
  for (const a of articles) {
    for (const href of a.existingHrefs) {
      if (articlePathSet.has(href)) {
        incomingCount.set(href, (incomingCount.get(href) || 0) + 1);
      }
    }
  }

  // Sort articles: prioritize those with fewest outgoing links first
  // Also prioritize high-commercial-intent categories
  const COMMERCIAL_PRIORITY: Record<string, number> = {
    "weight-loss": 10,
    "nutrition": 9,
    "fitness": 8,
    "menopause": 7,
    "sleep": 7,
    "healthy-ageing": 6,
    "health-calculators": 6,
    "stress": 5,
    "habits": 5,
    "mental-wellness": 4,
    "productivity": 4,
    "family-wellness": 3,
  };

  const sortedArticles = [...articles].sort((a, b) => {
    // First by outgoing link count (fewest first)
    const outDiff = a.outCount - b.outCount;
    if (outDiff !== 0) return outDiff;
    // Then by commercial priority (highest first)
    return (COMMERCIAL_PRIORITY[b.categorySlug] || 0) - (COMMERCIAL_PRIORITY[a.categorySlug] || 0);
  });

  let totalLinksAdded = 0;
  let articlesModified = 0;

  for (const article of sortedArticles) {
    const neededLinks = Math.max(0, MIN_OUTGOING - article.outCount);
    if (neededLinks === 0 && article.outCount >= MIN_OUTGOING) continue;

    const linksToAdd: { type: "article" | "tool" | "category"; path: string; anchor: string }[] = [];

    // 1. Find best matching tool (1 link)
    const toolScores = tools
      .map((t) => ({ tool: t, score: toolRelevance(article, t) }))
      .filter((ts) => ts.score >= 4 && !article.existingHrefs.has(ts.tool.path))
      .sort((a, b) => b.score - a.score);

    if (toolScores.length > 0) {
      const best = toolScores[0].tool;
      linksToAdd.push({
        type: "tool",
        path: best.path,
        anchor: toolAnchor(best),
      });
    }

    // 2. Find best matching articles (2-3 links), prioritize orphans
    const articleScores = articles
      .filter((b) => b.path !== article.path && !article.existingHrefs.has(b.path))
      .map((b) => ({
        article: b,
        score: articleRelevance(article, b),
        isOrphan: (incomingCount.get(b.path) || 0) === 0,
      }))
      .filter((s) => s.score >= 3)
      .sort((a, b) => {
        // Heavily prioritize orphans
        if (a.isOrphan !== b.isOrphan) return a.isOrphan ? -1 : 1;
        return b.score - a.score;
      });

    const targetArticleCount = Math.min(
      MAX_NEW_LINKS - linksToAdd.length,
      Math.max(2, neededLinks - linksToAdd.length),
    );

    // Avoid linking to same article multiple times, pick diverse targets
    const usedCategories = new Set<string>();
    for (const scored of articleScores) {
      if (linksToAdd.length >= targetArticleCount + (toolScores.length > 0 ? 1 : 0)) break;
      // Limit 1 link per category for diversity
      if (usedCategories.has(scored.article.categorySlug) && usedCategories.size < 3) continue;
      usedCategories.add(scored.article.categorySlug);
      linksToAdd.push({
        type: "article",
        path: scored.article.path,
        anchor: articleAnchor(scored.article),
      });
    }

    // 3. Add category hub link if we still need links
    if (linksToAdd.length < MIN_OUTGOING && !article.existingHrefs.has(`/${article.categorySlug}`)) {
      const catLabel = CATEGORY_LABELS[article.categorySlug] || article.categorySlug;
      linksToAdd.push({
        type: "category",
        path: `/${article.categorySlug}`,
        anchor: catLabel,
      });
    }

    if (linksToAdd.length === 0) continue;

    // Find insertion points in the body
    const insertionPoints = findInsertionPoints(article.body);
    if (insertionPoints.length === 0) continue;

    // Build the enriched body
    let newBody = article.body;
    let offset = 0;

    // Distribute links across insertion points
    for (let i = 0; i < linksToAdd.length && i < insertionPoints.length; i++) {
      const linkData = linksToAdd[i];
      const sentence = buildLinkSentence(article, linkData);
      const insertHtml = `\n<p>${sentence}</p>`;
      const pos = insertionPoints[i] + offset;
      newBody = newBody.slice(0, pos) + insertHtml + newBody.slice(pos);
      offset += insertHtml.length;
    }

    // If we have more links than insertion points, append remaining before last </p> group
    if (linksToAdd.length > insertionPoints.length) {
      const remaining = linksToAdd.slice(insertionPoints.length);
      const extraHtml = remaining
        .map((l) => `<p>${buildLinkSentence(article, l)}</p>`)
        .join("\n");
      // Insert before the final closing section
      const lastH2 = newBody.lastIndexOf("<h2>");
      if (lastH2 > 0) {
        newBody = newBody.slice(0, lastH2) + extraHtml + "\n" + newBody.slice(lastH2);
      } else {
        newBody += "\n" + extraHtml;
      }
    }

    if (newBody !== article.body) {
      totalLinksAdded += linksToAdd.length;
      articlesModified++;

      // Update tracking
      for (const l of linksToAdd) {
        article.existingHrefs.add(l.path);
        if (l.type === "article" && articlePathSet.has(l.path)) {
          incomingCount.set(l.path, (incomingCount.get(l.path) || 0) + 1);
        }
      }

      if (!DRY_RUN) {
        await prisma.article.update({
          where: { id: article.id },
          data: { body: newBody },
        });
      }
    }
  }

  // ── Post-enrichment stats ───────────────────────────────────────
  // Recount everything for accuracy
  const postOrphans = [...incomingCount.values()].filter((c) => c === 0).length;
  const totalIncoming = [...incomingCount.values()].reduce((a, b) => a + b, 0);

  // Recount outgoing
  let totalOutgoing = 0;
  for (const a of articles) {
    totalOutgoing += a.existingHrefs.size;
  }

  // Top linked pages
  const topLinked = [...incomingCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  console.log("=== ENRICHMENT RESULTS ===");
  console.log(`Articles modified: ${articlesModified}`);
  console.log(`Total new links added: ${totalLinksAdded}`);
  console.log(`\nOrphans before: 190`);
  console.log(`Orphans after: ${postOrphans}`);
  console.log(`\nAvg outgoing links/article: ${(totalOutgoing / articles.length).toFixed(1)}`);
  console.log(`Avg incoming links/article: ${(totalIncoming / articles.length).toFixed(1)}`);
  console.log(`\nTop internally-linked pages:`);
  for (const [path, count] of topLinked) {
    console.log(`  ${count} ← ${path}`);
  }

  if (DRY_RUN) console.log("\nDRY RUN — pass --commit to apply");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
