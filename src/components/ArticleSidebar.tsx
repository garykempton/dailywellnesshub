import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterForm } from "@/components/NewsletterForm";

interface RelatedArticle {
  slug: string;
  categorySlug: string;
  title: string;
}

interface Props {
  /** Related articles to cross-link */
  relatedArticles?: RelatedArticle[];
  /** Ad slot prefix, e.g. "sleep" for "sleep-sidebar-top" */
  categorySlug: string;
}

/**
 * Sticky sidebar for article pages (desktop only).
 *
 * Contains: ad slot, related articles, newsletter CTA, and a
 * second ad slot. Designed to sit alongside the article body
 * in a 2-column layout.
 */
export function ArticleSidebar({ relatedArticles = [], categorySlug }: Props) {
  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-6">
      <div className="sticky top-8 space-y-6">
        <AdSlot
          slot={`${categorySlug}-sidebar-top`}
          format="rectangle"
        />

        {relatedArticles.length > 0 && (
          <div className="border border-border rounded-xl p-4">
            <h4 className="font-semibold text-sm mb-3">Related Articles</h4>
            <ul className="space-y-2">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/${a.categorySlug}/${a.slug}`}
                    className="text-sm text-muted hover:text-primary transition-colors leading-snug block"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border border-primary/20 bg-primary/5 rounded-xl p-4 text-center">
          <p className="font-semibold text-sm mb-2">Weekly Tips</p>
          <p className="text-xs text-muted mb-3">
            Free wellness advice in your inbox.
          </p>
          <NewsletterForm variant="inline" />
        </div>

        <AdSlot
          slot={`${categorySlug}-sidebar-bottom`}
          format="rectangle"
        />
      </div>
    </aside>
  );
}
