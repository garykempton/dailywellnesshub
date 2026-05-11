import { getTemplate } from "./templates";

// ─── Types ──────────────────────────────────────────────────────────

export interface GeneratedArticle {
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  summary: string;
  body: string;
  tags: string[];
  keywords: string[];
  faqSection: { question: string; answer: string }[];
  sourceNotes: string;
  internalLinks: { slug: string; anchorText: string }[];
  relatedTools: string[];
  relatedArticles: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    wordCount: number;
    readTime: number;
    h2Count: number;
    faqCount: number;
    internalLinkCount: number;
    hasDisclaimer: boolean;
    hasTakeaways: boolean;
  };
}

// ─── Banned phrases ─────────────────────────────────────────────────

const BANNED_PHRASES = [
  "guaranteed to",
  "proven to cure",
  "will cure",
  "eliminates disease",
  "miracle",
  "you will lose weight",
  "this will cure",
  "100% effective",
  "instant results",
  "clinically proven to",
  "doctor recommended",
  "scientifically proven",
];

/** Phrases that flag content as AI-generated. Detected as warnings. */
const AI_TELL_PHRASES = [
  "the good news is",
  "here's the good news",
  "it's worth noting",
  "it is worth noting",
  "it bears mentioning",
  "in today's world",
  "in today's fast-paced",
  "in this day and age",
  "let's explore",
  "let's dive in",
  "let's take a look",
  "comprehensive guide",
  "comprehensive overview",
  "in conclusion",
  "in summary",
  "to sum up",
  "game-changer",
  "game changer",
  "plays a crucial role",
  "plays a vital role",
  "plays an important role",
  "one size fits all",
  "not a one-size-fits-all",
  "it's not just about",
  "tapestry",
  "myriad",
  "realm",
];

const REQUIRED_HEDGING_PATTERNS = [
  /may help/i,
  /research suggests/i,
  /is associated with/i,
  /some studies/i,
  /many people find/i,
  /could support/i,
  /is often recommended/i,
  /speak to.*(professional|doctor|provider|GP|healthcare)/i,
];

// ─── Main validation ────────────────────────────────────────────────

export function validateArticle(
  article: GeneratedArticle,
  categorySlug: string,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const template = getTemplate(categorySlug);

  // Strip HTML for text analysis
  const plainText = article.body.replace(/<[^>]+>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 250));

  // Count structural elements
  const h2Matches = article.body.match(/<h2[^>]*>/gi) || [];
  const h2Count = h2Matches.length;
  const faqCount = article.faqSection?.length || 0;
  const internalLinkCount = article.internalLinks?.length || 0;

  // Check disclaimer (accept various common phrasings)
  const hasDisclaimer =
    /not (a )?substitute for (professional )?medical advice/i.test(plainText) ||
    /informational purposes only/i.test(plainText) ||
    /not medical advice/i.test(plainText) ||
    /does not constitute (medical|professional|health) advice/i.test(plainText) ||
    /not intended (as|to replace|to be) (a )?(substitute|replacement) for.*(medical|professional)/i.test(plainText) ||
    /consult.*(doctor|physician|healthcare|health care|medical professional|GP|qualified professional)/i.test(plainText) ||
    /speak (to|with).*(doctor|physician|healthcare|health care|medical professional|GP|qualified professional)/i.test(plainText) ||
    /seek (professional|medical) advice/i.test(plainText);

  // Check key takeaways
  const hasTakeaways = /key takeaway/i.test(article.body);

  const stats = {
    wordCount,
    readTime,
    h2Count,
    faqCount,
    internalLinkCount,
    hasDisclaimer,
    hasTakeaways,
  };

  // ── Required fields ─────────────────────────────────────────────
  if (!article.title || article.title.length < 20) {
    errors.push("Title is missing or too short (min 20 chars).");
  }
  if (article.title && article.title.length > 80) {
    warnings.push(`Title is long (${article.title.length} chars, target 50-65).`);
  }
  if (!article.metaTitle || article.metaTitle.length < 30) {
    errors.push("Meta title is missing or too short (min 30 chars).");
  }
  if (article.metaTitle && article.metaTitle.length > 65) {
    warnings.push(
      `Meta title may truncate in SERPs (${article.metaTitle.length} chars, target 50-60).`,
    );
  }
  if (!article.metaDesc || article.metaDesc.length < 80) {
    errors.push("Meta description is missing or too short (min 80 chars).");
  }
  if (article.metaDesc && article.metaDesc.length > 170) {
    warnings.push(
      `Meta description may truncate (${article.metaDesc.length} chars, target 140-160).`,
    );
  }
  if (!article.excerpt || article.excerpt.length < 20) {
    errors.push("Excerpt is missing or too short.");
  }
  if (!article.body || article.body.length < 200) {
    errors.push("Article body is missing or too short.");
  }

  // ── Word count ──────────────────────────────────────────────────
  if (wordCount < template.minWords * 0.8) {
    errors.push(
      `Word count too low: ${wordCount} (minimum ${template.minWords}).`,
    );
  } else if (wordCount < template.minWords) {
    warnings.push(
      `Word count slightly below target: ${wordCount} (target ${template.minWords}-${template.maxWords}).`,
    );
  }
  if (wordCount > template.maxWords * 1.3) {
    warnings.push(
      `Word count well above target: ${wordCount} (target ${template.minWords}-${template.maxWords}).`,
    );
  }

  // ── Structure checks ───────────────────────────────────────────
  if (h2Count < 3) {
    errors.push(`Too few H2 headings: ${h2Count} (minimum 3).`);
  }
  if (h2Count > 10) {
    warnings.push(`Many H2 headings: ${h2Count} (consider consolidating).`);
  }

  // Check for H1 tags (should not exist in body)
  if (/<h1[^>]*>/i.test(article.body)) {
    errors.push("Body contains <h1> tags — only <h2> and below are allowed.");
  }

  // Check required sections
  for (const section of template.requiredSections) {
    const pattern = new RegExp(section, "i");
    if (!pattern.test(article.body)) {
      errors.push(`Missing required section: "${section}".`);
    }
  }

  if (!hasTakeaways) {
    warnings.push('Article is missing a "Key Takeaways" section.');
  }

  // ── FAQ validation ─────────────────────────────────────────────
  if (faqCount < 3) {
    errors.push(`Too few FAQ items: ${faqCount} (minimum 3).`);
  }
  if (article.faqSection) {
    for (const faq of article.faqSection) {
      if (!faq.question || !faq.answer) {
        errors.push("FAQ item missing question or answer.");
      }
      if (faq.answer && faq.answer.length > 500) {
        warnings.push(
          `FAQ answer too long (${faq.answer.length} chars): "${faq.question?.slice(0, 40)}..."`,
        );
      }
    }
  }

  // ── SEO checks ─────────────────────────────────────────────────
  if (!article.keywords || article.keywords.length < 2) {
    warnings.push("Fewer than 2 keywords specified.");
  }
  if (!article.tags || article.tags.length < 2) {
    warnings.push("Fewer than 2 tags specified.");
  }

  // ── Safety checks ──────────────────────────────────────────────
  const lowerBody = plainText.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lowerBody.includes(phrase.toLowerCase())) {
      errors.push(`Banned phrase detected: "${phrase}".`);
    }
  }

  if (!hasDisclaimer) {
    errors.push("Missing medical disclaimer in article body.");
  }

  // ── AI-tell detection ───────────────────────────────────────────
  const aiTellsFound: string[] = [];
  for (const phrase of AI_TELL_PHRASES) {
    if (lowerBody.includes(phrase.toLowerCase())) {
      aiTellsFound.push(phrase);
    }
  }
  if (aiTellsFound.length > 0) {
    warnings.push(`AI-tell phrases detected (${aiTellsFound.length}): ${aiTellsFound.slice(0, 3).join(", ")}`);
  }

  // Check for at least some hedging language
  const hedgingFound = REQUIRED_HEDGING_PATTERNS.filter((p) =>
    p.test(plainText),
  );
  if (hedgingFound.length < 2) {
    warnings.push(
      `Low hedging language count (${hedgingFound.length}/8 patterns). Article may sound too authoritative.`,
    );
  }

  // ── Internal links ─────────────────────────────────────────────
  if (internalLinkCount === 0) {
    warnings.push("No internal links suggested.");
  }

  // ── HTML quality ───────────────────────────────────────────────
  if (/style\s*=/i.test(article.body)) {
    warnings.push("Inline styles detected in body HTML.");
  }
  if (/class\s*=/i.test(article.body)) {
    warnings.push("Class attributes detected in body HTML (not expected).");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}

// ─── Parse AI response into GeneratedArticle ────────────────────────

export function parseAiResponse(rawText: string): GeneratedArticle {
  // Strip markdown code fences if present
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not extract JSON from AI response.");
  }

  let jsonStr = jsonMatch[0];

  // Try parsing directly first
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    // Attempt to fix common JSON issues from AI responses:
    // 1. Fix unescaped newlines inside string values
    jsonStr = jsonStr.replace(/(?<=:\s*"[^"]*)\n/g, "\\n");
    // 2. Fix unescaped control characters
    jsonStr = jsonStr.replace(/[\x00-\x1f]/g, (ch) => {
      if (ch === "\n" || ch === "\r" || ch === "\t") return ch;
      return `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`;
    });

    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // Last resort: try to extract field by field using regex
      const bodyMatch = jsonStr.match(/"body"\s*:\s*"([\s\S]*?)"\s*,\s*"tags"/);
      if (bodyMatch) {
        // Escape problematic characters in body
        const safeBody = bodyMatch[1]
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t");
        jsonStr = jsonStr.replace(
          bodyMatch[0],
          `"body": "${safeBody}", "tags"`,
        );
      }
      parsed = JSON.parse(jsonStr);
    }
  }

  return {
    title: parsed.title || "",
    metaTitle: parsed.metaTitle || "",
    metaDesc: parsed.metaDesc || "",
    excerpt: parsed.excerpt || "",
    summary: parsed.summary || "",
    body: parsed.body || "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    faqSection: Array.isArray(parsed.faqSection) ? parsed.faqSection : [],
    sourceNotes: parsed.sourceNotes || "",
    internalLinks: Array.isArray(parsed.internalLinks)
      ? parsed.internalLinks
      : [],
    relatedTools: Array.isArray(parsed.relatedTools)
      ? parsed.relatedTools
      : [],
    relatedArticles: Array.isArray(parsed.relatedArticles)
      ? parsed.relatedArticles
      : [],
  };
}
