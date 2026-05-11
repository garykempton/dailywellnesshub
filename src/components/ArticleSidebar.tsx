import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterForm } from "@/components/NewsletterForm";

interface RelatedArticle {
  slug: string;
  categorySlug: string;
  title: string;
}

interface Props {
  relatedArticles?: RelatedArticle[];
  categorySlug: string;
}

export function ArticleSidebar({ relatedArticles = [], categorySlug }: Props) {
  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-6">
      <div className="sticky top-24 space-y-6">
        <AdSlot
          slot={`${categorySlug}-sidebar-top`}
          format="rectangle"
        />

        {relatedArticles.length > 0 && (
          <div className="border border-border/60 rounded-2xl p-5">
            <h4 className="font-bold text-sm mb-4 text-stone-800">Related Articles</h4>
            <ul className="space-y-3">
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

        <div className="border border-primary/15 bg-gradient-to-b from-green-50/80 to-white rounded-2xl p-5 text-center">
          <p className="font-bold text-sm mb-1 text-stone-800">Weekly Tips</p>
          <p className="text-xs text-muted mb-4">
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
