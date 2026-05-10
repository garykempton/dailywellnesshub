import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { readFileSync } from "fs";
import { join } from "path";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const HEALTH_SENSITIVE = [
  "weight-loss",
  "nutrition",
  "menopause",
  "healthy-ageing",
  "family-wellness",
  "mental-wellness",
];

const PLACEHOLDER_BODY =
  '<p><em>This article is currently a topic placeholder. Full content will be generated soon.</em></p>';

interface Topic {
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

async function main() {
  const files = ["topics-1.json", "topics-2.json", "topics-3.json", "topics-4.json", "topics-5.json"];
  const topics: Topic[] = [];

  for (const f of files) {
    const raw = readFileSync(join(__dirname, f), "utf-8");
    topics.push(...JSON.parse(raw));
  }

  console.log(`Loaded ${topics.length} topics from ${files.length} files`);

  let created = 0;
  let skipped = 0;

  for (const t of topics) {
    // Skip if slug already exists
    const existing = await prisma.article.findFirst({ where: { slug: t.slug } });
    if (existing) {
      console.log(`  SKIP (exists): ${t.slug}`);
      skipped++;
      continue;
    }

    await prisma.article.create({
      data: {
        slug: t.slug,
        title: t.title,
        metaTitle: t.metaTitle,
        metaDesc: t.metaDesc,
        excerpt: t.excerpt,
        summary: t.summary,
        body: PLACEHOLDER_BODY,
        categorySlug: t.categorySlug,
        keywords: t.keywords,
        faqSection: JSON.stringify(t.faq),
        relatedTools: t.relatedTools,
        relatedArticles: t.relatedArticles,
        wordCount: 0,
        readTime: 0,
        healthSensitive: HEALTH_SENSITIVE.includes(t.categorySlug),
        status: "DRAFT",
        aiGenerated: false,
      },
    });

    console.log(`  OK: ${t.slug} [${t.categorySlug}]`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}, Total: ${topics.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
