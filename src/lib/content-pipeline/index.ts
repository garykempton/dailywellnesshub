/**
 * Content Pipeline — Automated Article Generation System
 *
 * This module provides the full workflow for generating, validating,
 * and preparing wellness articles for the publishing pipeline.
 *
 * Usage:
 *   import { buildSystemPrompt, buildUserPrompt } from "@/lib/content-pipeline/prompts";
 *   import { parseAiResponse, validateArticle } from "@/lib/content-pipeline/validation";
 *   import { buildArticleMetadata } from "@/lib/content-pipeline/metadata";
 *   import { injectInternalLinks } from "@/lib/content-pipeline/internal-links";
 *
 * Workflow:
 *   1. Build prompts using topic data + existing site slugs
 *   2. Call AI API with system + user prompts
 *   3. Parse the JSON response
 *   4. Validate content (safety, structure, SEO)
 *   5. Inject internal links into body HTML
 *   6. Build metadata for database insertion
 *   7. Save as DRAFT (never auto-publish)
 */

export { getTemplate, getCategoryMeta } from "./templates";
export type { ArticleTemplate } from "./templates";

export { buildSystemPrompt, buildUserPrompt } from "./prompts";
export type { ArticlePromptInput } from "./prompts";

export {
  validateArticle,
  parseAiResponse,
} from "./validation";
export type { GeneratedArticle, ValidationResult } from "./validation";

export {
  injectInternalLinks,
  findRelatedArticles,
  generateSlug,
} from "./internal-links";
export type { InternalLink, ExistingArticle } from "./internal-links";

export {
  buildArticleMetadata,
  buildFaqSchema,
  estimateQualityScore,
} from "./metadata";
export type { ArticleMetadata } from "./metadata";
