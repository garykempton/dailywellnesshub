import * as fs from "fs";

const raw = fs.readFileSync("C:/Users/user/Desktop/wellness-answers/audit-output-post-fix.txt", "utf8");

const pathsLine = raw.split("\n").find((l) => l.startsWith("PATHS:"));
const bodyLinksLine = raw.split("\n").find((l) => l.startsWith("BODY_LINKS:"));

const articlePaths: string[] = JSON.parse(pathsLine!.replace("PATHS:", ""));
const bodyLinks: { from: string; href: string }[] = JSON.parse(bodyLinksLine!.replace("BODY_LINKS:", ""));

const articlePathSet = new Set(articlePaths);
const toolLinkPattern = /^\/tools\//;
const categoryPattern = /^\/[a-z-]+$/;
const staticPages = new Set(["/", "/about", "/contact", "/newsletter", "/tools", "/disclaimer", "/privacy-policy", "/terms-of-service", "/cookie-policy"]);

const brokenBodyLinks: { from: string; href: string }[] = [];
for (const link of bodyLinks) {
  const href = link.href;
  if (toolLinkPattern.test(href)) continue;
  if (staticPages.has(href)) continue;
  if (categoryPattern.test(href)) continue;
  if (!articlePathSet.has(href)) {
    brokenBodyLinks.push(link);
  }
}

console.log("=== POST-FIX AUDIT ===");
console.log("Total articles:", articlePaths.length);
console.log("Total body links:", bodyLinks.length);
console.log("Broken body links:", brokenBodyLinks.length);

if (brokenBodyLinks.length > 0) {
  console.log("\nRemaining broken links:");
  for (const bl of brokenBodyLinks) {
    console.log(`  FROM: ${bl.from} → ${bl.href}`);
  }
}

// Orphan analysis
const incomingLinks = new Map<string, number>();
for (const p of articlePaths) incomingLinks.set(p, 0);
for (const link of bodyLinks) {
  if (articlePathSet.has(link.href)) {
    incomingLinks.set(link.href, (incomingLinks.get(link.href) || 0) + 1);
  }
}
const orphans = articlePaths.filter((p) => (incomingLinks.get(p) || 0) === 0);
console.log("\nOrphan articles (0 incoming links):", orphans.length, "of", articlePaths.length);

// Link counts
const linkCounts = new Map<string, number>();
for (const link of bodyLinks) {
  linkCounts.set(link.from, (linkCounts.get(link.from) || 0) + 1);
}
const fewLinks = articlePaths.filter((p) => (linkCounts.get(p) || 0) < 2);
console.log("Articles with <2 outgoing body links:", fewLinks.length, "of", articlePaths.length);
