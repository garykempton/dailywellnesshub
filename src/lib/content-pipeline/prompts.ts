import { getTemplate, getCategoryMeta } from "./templates";
import { SITE_NAME } from "../constants";

// ─── System prompt (shared across all generations) ──────────────────

export function buildSystemPrompt(categorySlug: string): string {
  const template = getTemplate(categorySlug);
  const cat = getCategoryMeta(categorySlug);
  const categoryLabel = cat ? cat.name : categorySlug;

  return `You are a factual wellness content writer for ${SITE_NAME}. You write educational, helpful articles about wellness, lifestyle, and self-improvement. Your tone is factual, warm, and approachable — like a knowledgeable friend, not a doctor.

CATEGORY: ${categoryLabel}

STRICT LANGUAGE RULES:
- NEVER make medical claims, diagnose conditions, or prescribe treatments.
- NEVER use miracle-cure language ("guaranteed", "cures", "eliminates disease", "proven to fix").
- NEVER promise specific outcomes ("you will lose weight", "this will cure your insomnia").
- ALWAYS use cautious hedging language:
  * "may help", "is associated with", "research suggests", "some studies indicate"
  * "many people find", "could support", "is often recommended by professionals"
- ALWAYS end the article body with this EXACT disclaimer paragraph:
  <p><em>This article is for informational purposes only and is not a substitute for professional medical advice. Always consult a qualified healthcare provider before making changes to your health routine.</em></p>
- For sensitive topics (menopause, weight loss, mental wellness), be especially careful with claims.
- Be honest about what is and isn't well-established in research. When evidence is limited, say so plainly.

${template.structureGuide}

WORD COUNT: Aim for ${template.minWords}-${template.maxWords} words.

FAQ SECTION: Generate exactly ${template.faqCount} FAQ items. Each FAQ answer should be 1-3 sentences, factual, and concise.

OUTPUT FORMAT: Return ONLY valid JSON. No markdown code fences, no explanation outside the JSON object.`;
}

// ─── User prompt (per-article) ──────────────────────────────────────

export interface ArticlePromptInput {
  topic: string;
  category: string;
  keywords: string[];
  relatedTools: string[];
  relatedArticles: string[];
  existingSlugs: string[];
}

export function buildUserPrompt(input: ArticlePromptInput): string {
  const {
    topic,
    category,
    keywords,
    relatedTools,
    relatedArticles,
    existingSlugs,
  } = input;

  const internalLinkContext =
    existingSlugs.length > 0
      ? `\nEXISTING ARTICLES ON THE SITE (use these slugs for internal link suggestions):\n${existingSlugs.slice(0, 60).join(", ")}`
      : "";

  const relatedToolsContext =
    relatedTools.length > 0
      ? `\nRELATED TOOLS ON THE SITE: ${relatedTools.join(", ")}`
      : "";

  const relatedArticlesContext =
    relatedArticles.length > 0
      ? `\nSUGGESTED RELATED ARTICLES: ${relatedArticles.join(", ")}`
      : "";

  return `Write an article about: "${topic}"
Category: ${category}
Target keywords: ${keywords.join(", ") || "none specified"}
${relatedToolsContext}
${relatedArticlesContext}
${internalLinkContext}

Return a single JSON object with these fields:

{
  "title": "SEO-friendly article title (50-65 characters)",
  "metaTitle": "SEO meta title with primary keyword near the start (50-60 characters)",
  "metaDesc": "Compelling meta description with primary keyword (140-160 characters)",
  "excerpt": "Short excerpt for cards and previews (1-2 sentences, under 200 characters)",
  "summary": "Editorial summary for internal use (2-4 sentences)",
  "body": "Full article HTML following the structure guide exactly",
  "tags": ["3-5 relevant tag names"],
  "keywords": ["3-7 target SEO keywords including the primary keyword"],
  "faqSection": [
    { "question": "Natural question a reader would ask", "answer": "Concise, factual answer (1-3 sentences)" }
  ],
  "sourceNotes": "Brief editorial note about the research basis for this article",
  "internalLinks": [
    { "slug": "existing-article-slug", "anchorText": "natural anchor text for the link" }
  ],
  "relatedTools": ["tool-slug-if-relevant"],
  "relatedArticles": ["slug-1", "slug-2", "slug-3"]
}

IMPORTANT:
- The "body" field must be valid HTML using only allowed tags.
- The "internalLinks" field should reference real slugs from the existing articles list above. Include 2-4 internal links naturally within the body text AND list them in the internalLinks array.
- In the body HTML, format internal links as: <a href="/CATEGORY/SLUG">anchor text</a>
- Do NOT invent slugs that aren't in the existing articles list.
- Return ONLY the JSON object. No other text.`;
}
