/**
 * Humanise Articles — Remove AI-tell patterns from all published articles
 *
 * Performs find-and-replace operations on article body text to remove or
 * replace phrases and patterns commonly flagged by AI detection tools.
 *
 * Usage: npx tsx scripts/humanise-articles.ts
 *        npx tsx scripts/humanise-articles.ts --dry-run
 */

import "dotenv/config";
import { prisma } from "../src/lib/db";

// ═══════════════════════════════════════════════════════════════════════
// REPLACEMENT RULES
// ═══════════════════════════════════════════════════════════════════════

interface Replacement {
  /** Pattern to match (case-insensitive) */
  find: RegExp;
  /** Replacement string or function */
  replace: string | ((match: string, ...args: string[]) => string);
  /** Description for logging */
  label: string;
}

const REPLACEMENTS: Replacement[] = [
  // ─── Remove "the good news" filler ──────────────────────────────
  {
    find: /The good news is(,?\s*that\s*)?/gi,
    replace: "",
    label: "the good news is",
  },
  {
    find: /Here['']s the good news:?\s*/gi,
    replace: "",
    label: "here's the good news",
  },

  // ─── Remove "it's worth noting" filler ─────────────────────────
  {
    find: /It['']?s (also )?(worth noting|important to note|worth mentioning|worth remembering)( that)?[,:]?\s*/gi,
    replace: "",
    label: "it's worth noting/mentioning",
  },
  {
    find: /It bears mentioning( that)?[,:]?\s*/gi,
    replace: "",
    label: "it bears mentioning",
  },

  // ─── Overused transition words at sentence start ────────────────
  {
    find: /(?<=<p>|<li>|\.\s+)Additionally,\s*/g,
    replace: (match) => "",
    label: "Additionally,",
  },
  {
    find: /(?<=<p>|<li>|\.\s+)Furthermore,\s*/g,
    replace: "",
    label: "Furthermore,",
  },
  {
    find: /(?<=<p>|<li>|\.\s+)Moreover,\s*/g,
    replace: "",
    label: "Moreover,",
  },
  {
    find: /(?<=<p>|<li>|\.\s+)Ultimately,\s*/g,
    replace: "",
    label: "Ultimately,",
  },

  // ─── "Let's explore/dive in" openers ───────────────────────────
  {
    find: /Let['']s (explore|dive in(to)?|take a (closer )?look( at)?|break (this|it) down)[.\s]*/gi,
    replace: "",
    label: "Let's explore/dive in",
  },

  // ─── "In conclusion / In summary" closers ──────────────────────
  {
    find: /In (conclusion|summary),?\s*/gi,
    replace: "",
    label: "In conclusion/summary",
  },
  {
    find: /To sum (it )?up,?\s*/gi,
    replace: "",
    label: "To sum up",
  },

  // ─── AI vocabulary replacements ─────────────────────────────────
  {
    find: /\brobust\b/gi,
    replace: "strong",
    label: "robust → strong",
  },
  {
    find: /\bcrucial\b/gi,
    replace: "important",
    label: "crucial → important",
  },
  {
    find: /\bdelve(s)?\b/gi,
    replace: "look$1",
    label: "delve → look",
  },
  {
    find: /\bdelving\b/gi,
    replace: "looking",
    label: "delving → looking",
  },
  {
    find: /\bjourney\b(?!\s+(to|from|between))/gi,
    replace: "process",
    label: "journey → process (metaphorical only)",
  },
  {
    find: /\bnavigate\b(?!\s+(to|from|between|the (road|path|route|street|highway|river)))/gi,
    replace: "manage",
    label: "navigate → manage (metaphorical)",
  },
  {
    find: /\bnavigating\b(?!\s+(to|from|between|the (road|path|route|street|highway|river)))/gi,
    replace: "managing",
    label: "navigating → managing (metaphorical)",
  },
  {
    find: /\bgame[- ]changer\b/gi,
    replace: "significant improvement",
    label: "game-changer → significant improvement",
  },
  {
    find: /\bunlock(ing)?\s+(your|the|its|their)\b/gi,
    replace: "improve$1 $2",
    label: "unlock your → improve your",
  },
  {
    find: /\bempower(ing|ed|s)?\b/gi,
    replace: (match) => {
      if (/ing$/i.test(match)) return "helping";
      if (/ed$/i.test(match)) return "helped";
      if (/s$/i.test(match)) return "helps";
      return "help";
    },
    label: "empower → help",
  },
  {
    find: /\bharness(ing|ed)?\b/gi,
    replace: (match) => {
      if (/ing$/i.test(match)) return "using";
      if (/ed$/i.test(match)) return "used";
      return "use";
    },
    label: "harness → use",
  },

  // ─── "When it comes to X" filler ───────────────────────────────
  {
    find: /[Ww]hen it comes to /g,
    replace: "For ",
    label: "when it comes to → For",
  },

  // ─── "plays a crucial/vital/important role" ─────────────────────
  {
    find: /plays a (crucial|vital|important|key|significant) role (in|for|when)/gi,
    replace: "matters for",
    label: "plays a crucial role → matters for",
  },

  // ─── "Whether you're a X or a Y" ───────────────────────────────
  {
    find: /Whether you['']re an?\s+.{10,60}\s+or an?\s+.{10,60},\s*/gi,
    replace: "",
    label: "Whether you're a X or a Y",
  },

  // ─── "comprehensive guide/overview" ─────────────────────────────
  {
    find: /\bcomprehensive (guide|overview|look|breakdown)\b/gi,
    replace: "practical $1",
    label: "comprehensive guide → practical guide",
  },

  // ─── "not a one-size-fits-all" ──────────────────────────────────
  {
    find: /not a one[- ]size[- ]fits[- ]all/gi,
    replace: "different for everyone",
    label: "not a one-size-fits-all → different for everyone",
  },

  // ─── "In today's" filler ────────────────────────────────────────
  {
    find: /In today['']s (world|fast-paced|busy|modern|society|day and age)[,.]?\s*/gi,
    replace: "",
    label: "In today's world",
  },

  // ─── "It's not just about" ─────────────────────────────────────
  {
    find: /It['']s not just about /gi,
    replace: "It goes beyond ",
    label: "It's not just about",
  },

  // ─── Fix double spaces left by removals ─────────────────────────
  {
    find: /  +/g,
    replace: " ",
    label: "double spaces",
  },

  // ─── Fix empty paragraphs left by removals ─────────────────────
  {
    find: /<p>\s*<\/p>/g,
    replace: "",
    label: "empty paragraphs",
  },

  // ─── Fix sentences starting with lowercase after removal ────────
  {
    find: /<p>\s*([a-z])/g,
    replace: (_match, letter) => `<p>${letter.toUpperCase()}`,
    label: "capitalise sentence starts",
  },
  {
    find: /\.\s+([a-z])/g,
    replace: (_match, letter) => `. ${letter.toUpperCase()}`,
    label: "capitalise after periods",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// EXECUTION
// ═══════════════════════════════════════════════════════════════════════

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
  };
}

function applyReplacements(body: string): { result: string; changes: string[] } {
  let result = body;
  const changes: string[] = [];

  for (const rule of REPLACEMENTS) {
    const before = result;
    if (typeof rule.replace === "string") {
      result = result.replace(rule.find, rule.replace);
    } else {
      result = result.replace(rule.find, rule.replace as (...args: string[]) => string);
    }
    if (result !== before) {
      const count = (before.match(rule.find) || []).length;
      changes.push(`${rule.label} (${count}x)`);
    }
  }

  return { result, changes };
}

async function main() {
  const { dryRun } = parseArgs();

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  HUMANISE ARTICLES — Remove AI-Tell Patterns");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Dry run: ${dryRun}\n`);

  const articles = await prisma.article.findMany({
    where: { aiGenerated: true },
    select: { id: true, slug: true, body: true },
  });

  console.log(`Found ${articles.length} AI-generated articles.\n`);

  let totalChanged = 0;
  let totalReplacements = 0;
  const changeSummary: Record<string, number> = {};

  for (const article of articles) {
    const { result, changes } = applyReplacements(article.body);

    if (changes.length > 0) {
      totalChanged++;
      totalReplacements += changes.length;

      for (const change of changes) {
        const label = change.replace(/ \(\d+x\)$/, "");
        changeSummary[label] = (changeSummary[label] || 0) + 1;
      }

      if (changes.length >= 3) {
        console.log(`  ${article.slug}: ${changes.length} fixes`);
      }

      if (!dryRun) {
        await prisma.article.update({
          where: { id: article.id },
          data: { body: result, updatedAt: new Date() },
        });
      }
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  RESULTS: ${totalChanged} articles modified | ${totalReplacements} total replacements`);
  console.log("═══════════════════════════════════════════════════════════");

  if (Object.keys(changeSummary).length > 0) {
    console.log("\nChanges by type:");
    const sorted = Object.entries(changeSummary).sort((a, b) => b[1] - a[1]);
    for (const [label, count] of sorted) {
      console.log(`  ${label}: ${count} articles`);
    }
  }

  if (dryRun) {
    console.log("\n(Dry run — no changes saved. Remove --dry-run to apply.)");
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
