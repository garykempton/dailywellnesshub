/**
 * Direct batch generation for 10 Fitness articles.
 * Calls Claude API and saves to database directly via Prisma.
 *
 * Usage: npx tsx scripts/batch-fitness-10.ts
 */

import "dotenv/config";
import { prisma } from "../src/lib/db";
import {
  buildSystemPrompt,
  buildUserPrompt,
  parseAiResponse,
  validateArticle,
  buildArticleMetadata,
  injectInternalLinks,
  findRelatedArticles,
  estimateQualityScore,
} from "../src/lib/content-pipeline";
import type { ArticlePromptInput, ExistingArticle } from "../src/lib/content-pipeline";

const AI_MODEL = "claude-sonnet-4-6";
const DELAY_MS = 10000;

interface TopicInput {
  topic: string;
  category: string;
  keywords: string[];
  relatedTools: string[];
  relatedArticles: string[];
}

const TOPICS: TopicInput[] = [
  {
    topic: "Strength Training After 40: A Complete Guide to Building Muscle Safely",
    category: "fitness",
    keywords: ["strength training after 40", "building muscle over 40", "weight training middle age", "exercise after 40", "muscle loss ageing"],
    relatedTools: ["heart-rate-calculator", "calorie-calculator"],
    relatedArticles: ["balance-mobility-exercises-over-50", "how-to-start-walking-for-fitness-plan", "stretching-routines-improve-flexibility-mobility"],
  },
  {
    topic: "Beginner Calisthenics: A 12-Week Bodyweight Training Programme for Complete Beginners",
    category: "fitness",
    keywords: ["beginner calisthenics", "calisthenics programme", "bodyweight training beginners", "calisthenics workout plan", "no equipment workout"],
    relatedTools: ["calorie-calculator"],
    relatedArticles: ["bodyweight-workout-plan-4-weeks-printable", "strength-training-home-no-equipment-beginners", "10-minute-morning-stretch-routine-beginners"],
  },
  {
    topic: "Daily Mobility Routine: 15 Minutes to Better Movement and Less Stiffness",
    category: "fitness",
    keywords: ["daily mobility routine", "mobility exercises", "joint mobility", "reduce stiffness", "movement practice", "functional mobility"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["10-minute-morning-stretch-routine-beginners", "stretching-routines-improve-flexibility-mobility", "desk-exercises-office-workers-no-equipment"],
  },
  {
    topic: "Exercise Recovery: Science-Backed Strategies to Recover Faster Between Workouts",
    category: "fitness",
    keywords: ["exercise recovery", "workout recovery", "muscle recovery tips", "rest days", "recovery strategies", "active recovery"],
    relatedTools: ["sleep-calculator", "hydration-calculator"],
    relatedArticles: ["how-much-deep-sleep-do-you-need", "stretching-routines-improve-flexibility-mobility", "daily-water-intake-hydration-guide"],
  },
  {
    topic: "Japanese Jiu Jitsu for Beginners: What to Expect and How to Start Training",
    category: "fitness",
    keywords: ["Japanese jiu jitsu beginners", "jiu jitsu for beginners", "start martial arts", "JJJ training", "martial arts fitness", "jiu jitsu what to expect"],
    relatedTools: ["heart-rate-calculator", "calorie-calculator"],
    relatedArticles: ["how-to-start-walking-for-fitness-plan", "10-minute-morning-stretch-routine-beginners", "stretching-routines-improve-flexibility-mobility"],
  },
  {
    topic: "Flexibility Training: How to Improve Your Range of Motion at Any Age",
    category: "fitness",
    keywords: ["flexibility training", "improve flexibility", "stretching for flexibility", "range of motion", "flexibility exercises", "how to get flexible"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["stretching-routines-improve-flexibility-mobility", "10-minute-morning-stretch-routine-beginners", "yoga-for-beginners-first-10-poses", "balance-mobility-exercises-over-50"],
  },
  {
    topic: "Exercise for Healthy Ageing: How Staying Active May Support Longevity and Vitality",
    category: "fitness",
    keywords: ["exercise healthy ageing", "staying active older adults", "fitness over 60", "longevity exercise", "ageing and exercise", "active ageing"],
    relatedTools: ["heart-rate-calculator", "bmi-calculator"],
    relatedArticles: ["balance-mobility-exercises-over-50", "how-to-start-walking-for-fitness-plan", "how-many-steps-per-day-by-age"],
  },
  {
    topic: "Building Discipline and Consistency in Your Fitness Routine: A Practical Framework",
    category: "fitness",
    keywords: ["fitness discipline", "workout consistency", "exercise habit", "stick to workout routine", "fitness motivation", "training consistency"],
    relatedTools: ["calorie-calculator"],
    relatedArticles: ["habit-formation-science-how-long-build-habit", "morning-habits-better-day", "how-to-break-bad-habits-practical-strategies", "one-percent-better-daily-improvement-guide"],
  },
  {
    topic: "Progressive Overload Explained: The Key Principle for Continuous Fitness Gains",
    category: "fitness",
    keywords: ["progressive overload", "progressive overload explained", "how to progressive overload", "strength progression", "workout progression", "building strength"],
    relatedTools: ["calorie-calculator"],
    relatedArticles: ["bodyweight-workout-plan-4-weeks-printable", "strength-training-home-no-equipment-beginners", "how-to-start-running-beginners-guide"],
  },
  {
    topic: "Warm-Up and Cool-Down: Why They Matter and How to Do Them Properly",
    category: "fitness",
    keywords: ["warm up exercises", "cool down exercises", "warm up routine", "why warm up", "injury prevention", "pre-workout routine"],
    relatedTools: ["heart-rate-calculator"],
    relatedArticles: ["10-minute-morning-stretch-routine-beginners", "stretching-routines-improve-flexibility-mobility", "how-to-start-running-beginners-guide"],
  },
];

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getExistingArticles(): Promise<ExistingArticle[]> {
  const articles = await prisma.article.findMany({
    where: { status: { in: ["PUBLISHED", "DRAFT", "APPROVED"] } },
    select: { slug: true, categorySlug: true, title: true, keywords: true },
  });
  return articles.map((a) => ({
    slug: a.slug,
    categorySlug: a.categorySlug,
    title: a.title,
    keywords: a.keywords as string[],
  }));
}

async function generateOne(
  topic: TopicInput,
  existingArticles: ExistingArticle[],
  index: number,
): Promise<{ success: boolean; slug?: string; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const existingSlugs = existingArticles.map((a) => a.slug);

  // Build prompts
  const systemPrompt = buildSystemPrompt(topic.category);
  const promptInput: ArticlePromptInput = {
    topic: topic.topic,
    category: topic.category,
    keywords: topic.keywords,
    relatedTools: topic.relatedTools,
    relatedArticles: topic.relatedArticles,
    existingSlugs,
  };
  const userPrompt = buildUserPrompt(promptInput);

  // Call Claude API
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return { success: false, error: `API ${response.status}: ${errText.slice(0, 200)}` };
  }

  const aiResponse = await response.json();
  const textContent = aiResponse.content?.[0]?.text || "";

  // Parse
  let articleData;
  try {
    articleData = parseAiResponse(textContent);
  } catch (e) {
    return { success: false, error: `Parse error: ${e instanceof Error ? e.message : String(e)}` };
  }

  // Validate
  const validation = validateArticle(articleData, topic.category);
  if (!validation.valid) {
    return { success: false, error: `Validation: ${validation.errors.join("; ")}` };
  }

  // Inject internal links
  articleData.body = injectInternalLinks(
    articleData.body,
    articleData.internalLinks,
    existingArticles,
  );

  // Enrich related articles
  if (articleData.relatedArticles.length < 3) {
    const suggested = findRelatedArticles(articleData.keywords, topic.category, existingArticles, 5);
    const existing = new Set(articleData.relatedArticles);
    for (const slug of suggested) {
      if (!existing.has(slug)) {
        articleData.relatedArticles.push(slug);
        existing.add(slug);
      }
      if (articleData.relatedArticles.length >= 5) break;
    }
  }

  // Build metadata
  const metadata = buildArticleMetadata(articleData, topic.category, AI_MODEL, userPrompt);
  const qualityScore = estimateQualityScore(articleData, topic.category);

  // Upsert tags
  const tagRecords = [];
  for (const tagName of metadata.tags) {
    const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const tag = await prisma.tag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: { name: tagName, slug: tagSlug },
    });
    tagRecords.push(tag);
  }

  // Check for slug collision
  const existingSlug = await prisma.article.findFirst({ where: { slug: metadata.slug } });
  if (existingSlug) {
    metadata.slug = `${metadata.slug}-guide`;
  }

  // Create article
  const article = await prisma.article.create({
    data: {
      slug: metadata.slug,
      title: metadata.title,
      metaTitle: metadata.metaTitle,
      metaDesc: metadata.metaDesc,
      excerpt: metadata.excerpt,
      summary: metadata.summary,
      body: metadata.body,
      categorySlug: metadata.categorySlug,
      keywords: metadata.keywords,
      faqSection: metadata.faqSection,
      sourceNotes: metadata.sourceNotes,
      internalLinks: metadata.internalLinks,
      relatedTools: metadata.relatedTools,
      relatedArticles: metadata.relatedArticles,
      wordCount: metadata.wordCount,
      readTime: metadata.readTime,
      healthSensitive: metadata.healthSensitive,
      aiGenerated: metadata.aiGenerated,
      aiModel: metadata.aiModel,
      aiPrompt: metadata.aiPrompt,
      status: metadata.status,
      tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
    },
  });

  // Create content job record
  await prisma.contentJob.create({
    data: {
      topic: topic.topic,
      category: topic.category,
      keywords: topic.keywords,
      status: "COMPLETED",
      articleId: article.id,
      targetSlug: article.slug,
      completedAt: new Date(),
    },
  });

  console.log(`    Quality: ${qualityScore}/100 | Words: ${metadata.wordCount} | Read: ${metadata.readTime}min`);
  if (validation.warnings.length > 0) {
    console.log(`    Warnings: ${validation.warnings.slice(0, 3).join("; ")}`);
  }

  return { success: true, slug: article.slug };
}

async function main() {
  console.log("=== Fitness Batch Generation (10 Articles) ===\n");
  console.log(`Model: ${AI_MODEL}`);
  console.log(`Delay: ${DELAY_MS}ms between requests\n`);

  const existingArticles = await getExistingArticles();
  console.log(`Existing articles in DB: ${existingArticles.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    process.stdout.write(`[${i + 1}/${TOPICS.length}] ${topic.topic.slice(0, 60)}... `);

    try {
      const result = await generateOne(topic, existingArticles, i);
      if (result.success) {
        console.log(`OK -> /${topic.category}/${result.slug}`);
        successCount++;
        // Add to existing articles for next iteration's internal linking
        existingArticles.push({
          slug: result.slug!,
          categorySlug: topic.category,
          title: topic.topic,
          keywords: topic.keywords,
        });
      } else {
        console.log(`FAIL`);
        console.log(`    Error: ${result.error}`);
        failCount++;
      }
    } catch (err) {
      console.log(`FAIL`);
      console.log(`    Error: ${err instanceof Error ? err.message : String(err)}`);
      failCount++;
    }

    if (i < TOPICS.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n=== Done ===`);
  console.log(`Success: ${successCount} | Failed: ${failCount} | Total: ${TOPICS.length}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
