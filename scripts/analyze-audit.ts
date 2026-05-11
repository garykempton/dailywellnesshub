import * as fs from "fs";

const raw = fs.readFileSync("C:/Users/user/Desktop/wellness-answers/audit-output.txt", "utf8");

// Parse sections
const pathsLine = raw.split("\n").find((l) => l.startsWith("PATHS:"));
const bodyLinksLine = raw.split("\n").find((l) => l.startsWith("BODY_LINKS:"));
const metaLine = raw.split("\n").find((l) => l.startsWith("META:"));

const articlePaths: string[] = JSON.parse(pathsLine!.replace("PATHS:", ""));
const bodyLinks: { from: string; href: string }[] = JSON.parse(bodyLinksLine!.replace("BODY_LINKS:", ""));
const meta: { path: string; relatedTools: string[]; relatedArticles: string[]; internalLinks: unknown[] }[] = JSON.parse(metaLine!.replace("META:", ""));

const articlePathSet = new Set(articlePaths);

console.log("=== ARTICLE BODY LINK ANALYSIS ===");
console.log("Total body links:", bodyLinks.length);
console.log("Unique hrefs:", new Set(bodyLinks.map((l) => l.href)).size);

// Check for broken body links (links to articles that don't exist)
const brokenBodyLinks: { from: string; href: string }[] = [];
const toolLinkPattern = /^\/tools\//;
const categoryPattern = /^\/[a-z-]+$/;

for (const link of bodyLinks) {
  const href = link.href;
  // Skip tool links, category links, external anchors, static pages
  if (toolLinkPattern.test(href)) continue;
  if (href === "/" || href === "/about" || href === "/contact" || href === "/newsletter" || href === "/tools" || href === "/disclaimer" || href === "/privacy-policy" || href === "/terms-of-service" || href === "/cookie-policy") continue;
  if (categoryPattern.test(href)) continue;
  // This should be an article link: /category/slug
  if (!articlePathSet.has(href)) {
    brokenBodyLinks.push(link);
  }
}
console.log("\nBroken article body links:", brokenBodyLinks.length);
for (const bl of brokenBodyLinks) {
  console.log(`  FROM: ${bl.from}`);
  console.log(`    TO: ${bl.href} [BROKEN]`);
}

// Orphan analysis: articles with zero incoming internal links
console.log("\n=== ORPHAN PAGE ANALYSIS ===");
const incomingLinks = new Map<string, number>();
for (const p of articlePaths) incomingLinks.set(p, 0);
for (const link of bodyLinks) {
  if (articlePathSet.has(link.href)) {
    incomingLinks.set(link.href, (incomingLinks.get(link.href) || 0) + 1);
  }
}
const orphans = articlePaths.filter((p) => (incomingLinks.get(p) || 0) === 0);
console.log("Articles with zero incoming body links:", orphans.length, "of", articlePaths.length);

// Articles missing related tools
console.log("\n=== ARTICLES MISSING RELATED TOOLS ===");
const noTools = meta.filter((m) => !m.relatedTools || m.relatedTools.length === 0);
console.log("Articles with no relatedTools:", noTools.length);
for (const m of noTools.slice(0, 20)) {
  console.log("  ", m.path);
}
if (noTools.length > 20) console.log("  ... and", noTools.length - 20, "more");

// Articles missing internal links in body
console.log("\n=== ARTICLES WITH FEW BODY LINKS ===");
const linkCounts = new Map<string, number>();
for (const link of bodyLinks) {
  linkCounts.set(link.from, (linkCounts.get(link.from) || 0) + 1);
}
const fewLinks = articlePaths.filter((p) => (linkCounts.get(p) || 0) < 2);
console.log("Articles with fewer than 2 body links:", fewLinks.length, "of", articlePaths.length);

// All unique body link targets
console.log("\n=== ALL UNIQUE BODY LINK TARGETS ===");
const uniqueTargets = [...new Set(bodyLinks.map((l) => l.href))].sort();
for (const t of uniqueTargets) {
  console.log("  ", t, articlePathSet.has(t) ? "[OK]" : toolLinkPattern.test(t) ? "[TOOL]" : categoryPattern.test(t) ? "[CAT]" : "[CHECK]");
}
