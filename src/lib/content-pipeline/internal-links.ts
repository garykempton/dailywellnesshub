import type { GeneratedArticle } from "./validation";

// ─── Internal linking system ────────────────────────────────────────

export interface InternalLink {
  slug: string;
  anchorText: string;
  categorySlug?: string;
}

export interface ExistingArticle {
  slug: string;
  categorySlug: string;
  title: string;
  keywords?: string[];
}

/**
 * Inject internal links into article body HTML.
 * Links are inserted as <a href="/category/slug">anchor text</a>.
 *
 * Only inserts links that:
 * 1. Reference slugs in the existingArticles list
 * 2. Haven't already been linked in the body
 * 3. Have a matching anchor text found in the body text
 */
export function injectInternalLinks(
  body: string,
  links: InternalLink[],
  existingArticles: ExistingArticle[],
): string {
  if (!links || links.length === 0) return body;

  const slugMap = new Map(existingArticles.map((a) => [a.slug, a]));
  let result = body;
  let insertedCount = 0;
  const maxLinks = 5; // Don't over-link

  for (const link of links) {
    if (insertedCount >= maxLinks) break;

    const article = slugMap.get(link.slug);
    if (!article) continue; // Skip invalid slugs

    const href = `/${article.categorySlug}/${article.slug}`;
    const anchor = escapeRegex(link.anchorText);

    // Check if this exact link already exists
    if (result.includes(href)) continue;

    // Find the anchor text in a paragraph (not inside an existing link or heading)
    const pattern = new RegExp(
      `(<p[^>]*>[^<]*?)\\b(${anchor})\\b([^<]*?</p>)`,
      "i",
    );

    const match = result.match(pattern);
    if (match) {
      const replacement = `${match[1]}<a href="${href}">${match[2]}</a>${match[3]}`;
      result = result.replace(match[0], replacement);
      insertedCount++;
    }
  }

  return result;
}

/**
 * Find related articles based on keyword and category overlap.
 * Used as a fallback when the AI doesn't suggest good related articles.
 */
export function findRelatedArticles(
  currentKeywords: string[],
  currentCategory: string,
  existingArticles: ExistingArticle[],
  limit = 5,
): string[] {
  if (!existingArticles.length || !currentKeywords.length) return [];

  const scored = existingArticles
    .filter((a) => a.slug !== "") // Skip empty
    .map((article) => {
      let score = 0;

      // Same category gets a small boost
      if (article.categorySlug === currentCategory) score += 1;

      // Keyword overlap
      const articleKeywords = article.keywords || [];
      for (const kw of currentKeywords) {
        const kwLower = kw.toLowerCase();
        if (articleKeywords.some((ak) => ak.toLowerCase().includes(kwLower))) {
          score += 3;
        }
        if (article.title.toLowerCase().includes(kwLower)) {
          score += 2;
        }
      }

      return { slug: article.slug, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.slug);
}

/**
 * Generate a URL-safe slug from a title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
