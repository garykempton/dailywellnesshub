/**
 * Second pass: Boost inbound links for articles that have < 3 incoming links.
 *
 * Strategy: For each under-linked article, find the most relevant articles
 * that DON'T already link to it, and inject a contextual link.
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";

const DRY_RUN = !process.argv.includes("--commit");
const TARGET_INBOUND = 3;

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
    text.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/)
      .filter(w => w.length > 2 && !STOP.has(w))
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

interface Article {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  body: string;
  path: string;
  words: Set<string>;
  existingHrefs: Set<string>;
}

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

function relevance(source: Article, target: Article): number {
  let score = 0;
  for (const w of target.words) {
    if (source.words.has(w)) score += 2;
  }
  if (source.categorySlug === target.categorySlug) score += 3;
  if (RELATED_CATS[source.categorySlug]?.includes(target.categorySlug)) score += 1;
  return score;
}

// Contextual sentence templates — varied to avoid repetition
const TEMPLATES = [
  (anchor: string) => `For related reading, see ${anchor}.`,
  (anchor: string) => `You may also find ${anchor} useful.`,
  (anchor: string) => `This pairs well with ${anchor}.`,
  (anchor: string) => `For a deeper look, check out ${anchor}.`,
  (anchor: string) => `We also cover this in ${anchor}.`,
  (anchor: string) => `If this interests you, have a look at ${anchor}.`,
  (anchor: string) => `On a related note, see ${anchor}.`,
  (anchor: string) => `You might enjoy ${anchor} as a follow-up.`,
];

function makeAnchor(target: Article, variant: number): string {
  const title = target.title.toLowerCase();
  const patterns = [
    `our guide to ${title.replace(/^how to /, "").replace(/^the /, "").replace(/^a /, "").slice(0, 55)}`,
    title.slice(0, 60),
    `this piece on ${title.replace(/^how to /, "").replace(/^why /, "").replace(/^the /, "").slice(0, 50)}`,
    `our article about ${title.replace(/^how to /, "").replace(/^the /, "").slice(0, 45)}`,
  ];
  return patterns[variant % patterns.length];
}

function findInsertionPoint(body: string, usedPositions: Set<number>): number | null {
  const pClosePattern = /<\/p>/g;
  const positions: number[] = [];
  let m;
  while ((m = pClosePattern.exec(body)) !== null) {
    const pos = m.index + m[0].length;
    if (!usedPositions.has(pos)) positions.push(pos);
  }
  if (positions.length < 3) return positions[0] || null;
  // Pick a position in the middle third
  const start = Math.floor(positions.length * 0.3);
  const end = Math.floor(positions.length * 0.7);
  for (let i = start; i <= end; i++) {
    if (!usedPositions.has(positions[i])) return positions[i];
  }
  return positions[start] || null;
}

async function main() {
  if (DRY_RUN) console.log("DRY RUN — pass --commit to apply\n");

  const rawArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, categorySlug: true, title: true, body: true },
  });

  const articles: Article[] = rawArticles.map(a => {
    const body = a.body || "";
    const path = `/${a.categorySlug}/${a.slug}`;
    const existingHrefs = new Set<string>();
    const re = /href="(\/[^"]+)"/g;
    let m;
    while ((m = re.exec(body)) !== null) existingHrefs.add(m[1]);
    return {
      id: a.id, slug: a.slug, categorySlug: a.categorySlug,
      title: a.title, body, path,
      words: new Set([
        ...tokenize(a.slug.replace(/-/g, " ")),
        ...tokenize(a.title),
        ...tokenize(stripHtml(body).slice(0, 400)),
      ]),
      existingHrefs,
    };
  });

  const articleByPath = new Map(articles.map(a => [a.path, a]));
  const articlePathSet = new Set(articles.map(a => a.path));

  // Count current incoming
  const incoming = new Map<string, number>();
  for (const a of articles) incoming.set(a.path, 0);
  for (const a of articles) {
    for (const href of a.existingHrefs) {
      if (articlePathSet.has(href)) {
        incoming.set(href, (incoming.get(href) || 0) + 1);
      }
    }
  }

  // Find articles needing more inbound
  const needsInbound = articles
    .filter(a => (incoming.get(a.path) || 0) < TARGET_INBOUND)
    .sort((a, b) => (incoming.get(a.path) || 0) - (incoming.get(b.path) || 0));

  console.log(`Articles needing inbound boost: ${needsInbound.length}`);

  // Track which source articles we've modified (accumulate changes)
  const pendingUpdates = new Map<string, { article: Article; newBody: string; usedPositions: Set<number>; addedCount: number }>();

  let totalLinksAdded = 0;
  let templateCounter = 0;

  for (const target of needsInbound) {
    const currentInbound = incoming.get(target.path) || 0;
    const linksNeeded = TARGET_INBOUND - currentInbound;

    // Find best source articles to link FROM
    const candidates = articles
      .filter(src => {
        if (src.path === target.path) return false;
        // Check if source already links to target
        const pending = pendingUpdates.get(src.path);
        const srcHrefs = pending ? new Set([...src.existingHrefs, ...extractNewHrefs(pending.newBody, src.body)]) : src.existingHrefs;
        return !srcHrefs.has(target.path);
      })
      .map(src => ({ source: src, score: relevance(src, target) }))
      .filter(s => s.score >= 3)
      .sort((a, b) => b.score - a.score);

    let added = 0;
    for (const { source } of candidates) {
      if (added >= linksNeeded) break;

      // Get or create pending update for source
      let pending = pendingUpdates.get(source.path);
      if (!pending) {
        pending = { article: source, newBody: source.body, usedPositions: new Set(), addedCount: 0 };
        pendingUpdates.set(source.path, pending);
      }

      // Don't add too many links to one source article
      if (pending.addedCount >= 3) continue;

      const insertPos = findInsertionPoint(pending.newBody, pending.usedPositions);
      if (insertPos === null) continue;

      const anchor = makeAnchor(target, templateCounter);
      const sentence = TEMPLATES[templateCounter % TEMPLATES.length](`<a href="${target.path}">${anchor}</a>`);
      const insertHtml = `\n<p>${sentence}</p>`;

      pending.newBody = pending.newBody.slice(0, insertPos) + insertHtml + pending.newBody.slice(insertPos);
      pending.usedPositions.add(insertPos);
      pending.addedCount++;
      templateCounter++;
      added++;
      totalLinksAdded++;
      incoming.set(target.path, (incoming.get(target.path) || 0) + 1);
    }
  }

  // Apply all pending updates
  let articlesModified = 0;
  for (const [path, pending] of pendingUpdates) {
    if (pending.newBody !== pending.article.body) {
      articlesModified++;
      if (!DRY_RUN) {
        await prisma.article.update({
          where: { id: pending.article.id },
          data: { body: pending.newBody },
        });
      }
    }
  }

  // Final stats
  const postOrphans = [...incoming.values()].filter(c => c === 0).length;
  const below3 = [...incoming.values()].filter(c => c < 3).length;
  const totalIncoming = [...incoming.values()].reduce((a, b) => a + b, 0);

  console.log(`\n=== INBOUND BOOST RESULTS ===`);
  console.log(`Articles modified: ${articlesModified}`);
  console.log(`Total new links added: ${totalLinksAdded}`);
  console.log(`Orphans: ${postOrphans}`);
  console.log(`Articles with <3 inbound: ${below3}`);
  console.log(`Avg inbound/article: ${(totalIncoming / articles.length).toFixed(1)}`);

  if (DRY_RUN) console.log("\nDRY RUN — pass --commit to apply");
}

function extractNewHrefs(newBody: string, oldBody: string): string[] {
  const newHrefs: string[] = [];
  const re = /href="(\/[^"]+)"/g;
  let m;
  while ((m = re.exec(newBody)) !== null) newHrefs.push(m[1]);
  return newHrefs;
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
