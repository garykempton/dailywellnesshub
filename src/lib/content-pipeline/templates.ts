import { CATEGORIES } from "../constants";

// ─── Article structure template ─────────────────────────────────────

export interface ArticleTemplate {
  /** HTML structure instructions for the AI */
  structureGuide: string;
  /** Minimum word count target */
  minWords: number;
  /** Maximum word count target */
  maxWords: number;
  /** Required HTML sections (validated post-generation) */
  requiredSections: string[];
  /** Whether to include a table of contents */
  includeToc: boolean;
  /** Number of FAQ items to generate */
  faqCount: number;
}

/**
 * Default article template — used when no category-specific override exists.
 */
const DEFAULT_TEMPLATE: ArticleTemplate = {
  structureGuide: `
ARTICLE STRUCTURE (follow this order exactly):
1. Opening paragraph — hook the reader with a relatable scenario or surprising fact. 2-3 sentences.
2. Quick summary box — a <blockquote> with 3-4 bullet points summarising key takeaways (this helps with featured snippets).
3. Main content — 4-6 H2 sections, each with 2-4 paragraphs. Use <h2> tags for headings.
   - Include <ul>/<ol> lists where appropriate for scannability.
   - Bold key terms with <strong> on first use.
   - Use transitional phrases between sections.
4. Practical tips section — an H2 titled "Practical Tips" or "How to Get Started" with actionable advice in a numbered list.
5. Key Takeaways — an H2 section with a <ul> of 3-5 concise bullet points summarising the article.
6. Medical disclaimer — the standard disclaimer paragraph at the end.

FORMATTING RULES:
- Use only <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote> tags.
- Never use <h1> (the page template adds the title).
- Keep paragraphs short (2-4 sentences).
- Do NOT include inline styles or class attributes.
`.trim(),
  minWords: 1200,
  maxWords: 2000,
  requiredSections: ["Key Takeaways"],
  includeToc: true,
  faqCount: 5,
};

/**
 * Category-specific template overrides. Merged with DEFAULT_TEMPLATE.
 */
const CATEGORY_OVERRIDES: Partial<Record<string, Partial<ArticleTemplate>>> = {
  "weight-loss": {
    structureGuide:
      DEFAULT_TEMPLATE.structureGuide +
      `\n\nCATEGORY-SPECIFIC RULES (Weight Loss):
- NEVER promise specific weight loss amounts or timelines.
- NEVER frame any food as "bad" or "forbidden".
- Emphasise sustainable habits over quick fixes.
- Include a reminder that individual results vary and to consult a healthcare provider.
- Reference evidence-based approaches (e.g., calorie awareness, portion control, movement).`,
    minWords: 1400,
    maxWords: 2200,
  },

  menopause: {
    structureGuide:
      DEFAULT_TEMPLATE.structureGuide +
      `\n\nCATEGORY-SPECIFIC RULES (Menopause):
- Acknowledge that experiences vary widely between individuals.
- Avoid dismissive language about symptoms.
- Reference both lifestyle approaches and when to seek medical help.
- Use inclusive language (not all who experience menopause identify as women).
- Include a reminder to speak with a GP or specialist for personalised advice.`,
    minWords: 1400,
    maxWords: 2200,
  },

  "mental-wellness": {
    structureGuide:
      DEFAULT_TEMPLATE.structureGuide +
      `\n\nCATEGORY-SPECIFIC RULES (Mental Wellness):
- NEVER minimise mental health conditions or suggest self-care replaces professional help.
- Include crisis resource references where appropriate (e.g., "If you are in crisis, contact a helpline").
- Distinguish between general well-being tips and clinical conditions.
- Use person-first language.
- Emphasise that seeking professional help is a strength.`,
    minWords: 1400,
    maxWords: 2200,
  },

  nutrition: {
    structureGuide:
      DEFAULT_TEMPLATE.structureGuide +
      `\n\nCATEGORY-SPECIFIC RULES (Nutrition):
- NEVER prescribe specific diets or meal plans as universal solutions.
- Acknowledge that nutritional needs are individual.
- Reference general guidelines (e.g., national dietary guidelines) rather than fad diets.
- Include a reminder to consult a registered dietitian for personalised advice.
- Avoid labelling foods as "good" or "bad".`,
  },

  "healthy-ageing": {
    structureGuide:
      DEFAULT_TEMPLATE.structureGuide +
      `\n\nCATEGORY-SPECIFIC RULES (Healthy Ageing):
- Use respectful, non-patronising language about ageing.
- Avoid ageist stereotypes or assumptions about capability.
- Reference that ageing is natural and focus on quality of life.
- Include practical modifications for varying ability levels.
- Remind readers to consult their GP before starting new exercise programmes.`,
  },

  "family-wellness": {
    structureGuide:
      DEFAULT_TEMPLATE.structureGuide +
      `\n\nCATEGORY-SPECIFIC RULES (Family Wellness):
- Acknowledge diverse family structures without assumption.
- Be sensitive to different parenting styles and cultural backgrounds.
- Reference age-appropriate guidelines where relevant.
- Avoid guilt-inducing language about parenting choices.
- Include both child and caregiver well-being perspectives.`,
  },

  "health-calculators": {
    structureGuide:
      DEFAULT_TEMPLATE.structureGuide +
      `\n\nCATEGORY-SPECIFIC RULES (Health Calculators):
- Explain the formula or method behind the calculation clearly.
- State the limitations and margin of error explicitly.
- Clarify that calculators provide estimates, not diagnoses.
- Reference when professional assessment is more appropriate.
- Include worked examples where helpful.`,
    faqCount: 4,
  },
};

/**
 * Get the merged template for a given category slug.
 */
export function getTemplate(categorySlug: string): ArticleTemplate {
  const overrides = CATEGORY_OVERRIDES[categorySlug] || {};
  return { ...DEFAULT_TEMPLATE, ...overrides };
}

/**
 * Get category metadata by slug. Returns undefined if not found.
 */
export function getCategoryMeta(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
