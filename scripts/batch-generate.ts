/**
 * Batch Article Generation Script
 *
 * Reads topics from the JSON topic files and generates articles
 * via the /api/admin/generate endpoint in controlled batches.
 *
 * Usage:
 *   npx tsx scripts/batch-generate.ts [options]
 *
 * Options:
 *   --category=sleep        Generate only for a specific category
 *   --limit=10              Max number of articles to generate (default: 10)
 *   --delay=8000            Delay between requests in ms (default: 8000)
 *   --dry-run               Show what would be generated without calling API
 *   --skip-existing         Skip topics that already have a non-placeholder article
 *   --offset=0              Skip the first N topics (for resuming)
 *
 * Examples:
 *   npx tsx scripts/batch-generate.ts --category=sleep --limit=5
 *   npx tsx scripts/batch-generate.ts --limit=20 --dry-run
 *   npx tsx scripts/batch-generate.ts --skip-existing --limit=50 --delay=10000
 */

import * as fs from "fs";
import * as path from "path";

// ─── Configuration ──────────────────────────────────────────────────

const API_URL =
  process.env.GENERATE_API_URL ||
  "http://localhost:3000/api/admin/generate";
const API_KEY = process.env.ADMIN_API_KEY || "";

interface TopicEntry {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  summary: string;
  categorySlug: string;
  keywords: string[];
  relatedTools: string[];
  relatedArticles: string[];
  faq: { question: string; answer: string }[];
}

interface GenerateResult {
  slug: string;
  topic: string;
  category: string;
  status: "success" | "failed" | "skipped";
  message: string;
  qualityScore?: number;
  warnings?: string[];
}

// ─── Argument parsing ───────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: Record<string, string> = {};

  for (const arg of args) {
    if (arg.startsWith("--")) {
      const [key, val] = arg.slice(2).split("=");
      opts[key] = val ?? "true";
    }
  }

  return {
    category: opts["category"] || null,
    limit: parseInt(opts["limit"] || "10", 10),
    delay: parseInt(opts["delay"] || "8000", 10),
    dryRun: opts["dry-run"] === "true",
    skipExisting: opts["skip-existing"] === "true",
    offset: parseInt(opts["offset"] || "0", 10),
  };
}

// ─── Load topics from JSON files ────────────────────────────────────

function loadTopics(): TopicEntry[] {
  const scriptsDir = path.resolve(__dirname);
  const allTopics: TopicEntry[] = [];

  // Load all topics-*.json files
  const files = fs
    .readdirSync(scriptsDir)
    .filter((f) => f.match(/^topics-\d+\.json$/))
    .sort();

  for (const file of files) {
    const filePath = path.join(scriptsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    allTopics.push(...data);
  }

  return allTopics;
}

// ─── Check if article already exists (non-placeholder) ──────────────

async function getExistingSlugs(): Promise<Set<string>> {
  try {
    const res = await fetch(
      `${API_URL.replace("/generate", "/articles")}?limit=1000`,
      {
        headers: { "x-api-key": API_KEY },
      },
    );
    if (!res.ok) return new Set();
    const data = await res.json();
    const articles = data.articles || [];
    // Only consider articles with actual content (not placeholders)
    return new Set(
      articles
        .filter(
          (a: { body: string; wordCount: number }) =>
            a.wordCount > 100 && !a.body.includes("topic placeholder"),
        )
        .map((a: { slug: string }) => a.slug),
    );
  } catch {
    console.warn("Could not fetch existing articles. Proceeding without skip check.");
    return new Set();
  }
}

// ─── Generate a single article ──────────────────────────────────────

async function generateArticle(topic: TopicEntry): Promise<GenerateResult> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        topic: topic.title,
        category: topic.categorySlug,
        keywords: topic.keywords,
        relatedTools: topic.relatedTools,
        relatedArticles: topic.relatedArticles,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return {
        slug: data.slug,
        topic: topic.title,
        category: topic.categorySlug,
        status: "success",
        message: `Created: ${data.title}`,
        qualityScore: data.qualityScore,
        warnings: data.validation?.warnings,
      };
    }

    return {
      slug: topic.slug,
      topic: topic.title,
      category: topic.categorySlug,
      status: "failed",
      message: data.error || JSON.stringify(data.validationErrors || data),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      slug: topic.slug,
      topic: topic.title,
      category: topic.categorySlug,
      status: "failed",
      message: msg,
    };
  }
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  if (!API_KEY && !opts.dryRun) {
    console.error("ERROR: ADMIN_API_KEY environment variable is required.");
    console.error("Set it in .env or pass via: ADMIN_API_KEY=xxx npx tsx scripts/batch-generate.ts");
    process.exit(1);
  }

  console.log("=== Batch Article Generation ===");
  console.log(`API: ${API_URL}`);
  console.log(`Category: ${opts.category || "all"}`);
  console.log(`Limit: ${opts.limit}`);
  console.log(`Delay: ${opts.delay}ms`);
  console.log(`Dry run: ${opts.dryRun}`);
  console.log(`Skip existing: ${opts.skipExisting}`);
  console.log(`Offset: ${opts.offset}`);
  console.log("");

  // Load topics
  let topics = loadTopics();
  console.log(`Loaded ${topics.length} topics from JSON files.`);

  // Filter by category
  if (opts.category) {
    topics = topics.filter((t) => t.categorySlug === opts.category);
    console.log(`Filtered to ${topics.length} topics in category "${opts.category}".`);
  }

  // Skip existing
  let existingSlugs = new Set<string>();
  if (opts.skipExisting && !opts.dryRun) {
    existingSlugs = await getExistingSlugs();
    const before = topics.length;
    topics = topics.filter((t) => !existingSlugs.has(t.slug));
    console.log(`Skipped ${before - topics.length} existing articles.`);
  }

  // Apply offset and limit
  topics = topics.slice(opts.offset, opts.offset + opts.limit);
  console.log(`Processing ${topics.length} topics.\n`);

  if (topics.length === 0) {
    console.log("No topics to process. Done.");
    return;
  }

  // Process
  const results: GenerateResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const label = `[${i + 1}/${topics.length}] ${topic.categorySlug}/${topic.slug}`;

    if (opts.dryRun) {
      console.log(`DRY RUN ${label}`);
      console.log(`  Title: ${topic.title}`);
      console.log(`  Keywords: ${topic.keywords.join(", ")}`);
      console.log("");
      continue;
    }

    process.stdout.write(`${label} ... `);
    const result = await generateArticle(topic);
    results.push(result);

    if (result.status === "success") {
      successCount++;
      console.log(`OK (score: ${result.qualityScore || "?"})`);
      if (result.warnings && result.warnings.length > 0) {
        console.log(`  Warnings: ${result.warnings.join("; ")}`);
      }
    } else {
      failCount++;
      console.log(`FAIL: ${result.message}`);
    }

    // Delay between requests (skip after last)
    if (i < topics.length - 1) {
      await new Promise((r) => setTimeout(r, opts.delay));
    }
  }

  // Summary
  if (!opts.dryRun) {
    console.log("\n=== Summary ===");
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${results.length}`);

    if (failCount > 0) {
      console.log("\nFailed articles:");
      for (const r of results.filter((r) => r.status === "failed")) {
        console.log(`  - ${r.topic}: ${r.message}`);
      }
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
