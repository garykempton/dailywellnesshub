import { HEALTH_SENSITIVE_CATEGORIES } from "../constants";
import type { GeneratedArticle } from "./validation";
import { generateSlug } from "./internal-links";

// ─── Metadata generation & enrichment ───────────────────────────────

export interface ArticleMetadata {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  summary: string | null;
  body: string;
  categorySlug: string;
  keywords: string[];
  tags: string[];
  faqSection: string; // JSON string
  sourceNotes: string | null;
  internalLinks: string; // JSON string
  relatedTools: string[];
  relatedArticles: string[];
  wordCount: number;
  readTime: number;
  healthSensitive: boolean;
  aiGenerated: true;
  aiModel: string;
  aiPrompt: string;
  status: "DRAFT";
}

/**
 * Transform a validated GeneratedArticle into the metadata shape
 * expected by the Prisma Article model.
 */
export function buildArticleMetadata(
  article: GeneratedArticle,
  categorySlug: string,
  aiModel: string,
  aiPrompt: string,
): ArticleMetadata {
  const plainText = article.body.replace(/<[^>]+>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 250));
  const isHealthSensitive = (HEALTH_SENSITIVE_CATEGORIES as readonly string[]).includes(categorySlug);

  return {
    slug: generateSlug(article.title),
    title: article.title,
    metaTitle: truncate(article.metaTitle, 60),
    metaDesc: truncate(article.metaDesc, 160),
    excerpt: truncate(article.excerpt, 200),
    summary: article.summary || null,
    body: article.body,
    categorySlug,
    keywords: article.keywords,
    tags: article.tags,
    faqSection: JSON.stringify(article.faqSection),
    sourceNotes: article.sourceNotes || null,
    internalLinks: JSON.stringify(article.internalLinks),
    relatedTools: article.relatedTools,
    relatedArticles: article.relatedArticles,
    wordCount,
    readTime,
    healthSensitive: isHealthSensitive,
    aiGenerated: true,
    aiModel,
    aiPrompt,
    status: "DRAFT",
  };
}

/**
 * Generate enhanced FAQ schema data from the article FAQ section.
 * Returns the structured data ready for JSON-LD embedding.
 */
export function buildFaqSchema(
  faqSection: { question: string; answer: string }[],
) {
  if (!faqSection || faqSection.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSection.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Estimate content quality score (0-100).
 * Used for prioritising review queue.
 */
export function estimateQualityScore(
  article: GeneratedArticle,
  categorySlug: string,
): number {
  let score = 50; // Base score

  const plainText = article.body.replace(/<[^>]+>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const h2Count = (article.body.match(/<h2[^>]*>/gi) || []).length;

  // Word count scoring
  if (wordCount >= 1200 && wordCount <= 2200) score += 15;
  else if (wordCount >= 800) score += 5;

  // Structure scoring
  if (h2Count >= 4 && h2Count <= 8) score += 10;
  if (/key takeaway/i.test(article.body)) score += 5;
  if (/<ul>|<ol>/i.test(article.body)) score += 5;
  if (/<blockquote>/i.test(article.body)) score += 3;

  // SEO scoring
  if (article.metaTitle.length >= 45 && article.metaTitle.length <= 60) score += 5;
  if (article.metaDesc.length >= 130 && article.metaDesc.length <= 160) score += 5;
  if (article.keywords.length >= 3) score += 3;

  // FAQ scoring
  if (article.faqSection.length >= 3) score += 5;

  // Internal links
  if (article.internalLinks.length >= 2) score += 4;

  return Math.min(100, score);
}

function truncate(str: string, maxLen: number): string {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}
