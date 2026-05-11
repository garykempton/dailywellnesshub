"use client";

import Link from "next/link";
import { NewsletterInlineBlock } from "@/components/NewsletterInlineBlock";
import { AdSlot } from "@/components/AdSlot";
import type { ToolDefinition } from "@/lib/tools";
import { getRelatedTools } from "@/lib/tools";

interface Props {
  tool: ToolDefinition;
  children: React.ReactNode;
}

const ICON_MAP: Record<string, string> = {
  moon: "🌙",
  droplets: "💧",
  flame: "🔥",
  footprints: "🚶",
  stretch: "🧘",
  activity: "🏃",
  "heart-pulse": "💓",
  wind: "🌬️",
  "check-square": "✅",
  timer: "⏱️",
  "pie-chart": "📊",
  swords: "🥋",
  leaf: "🍃",
  "shield-check": "🛡️",
};

export function ToolPageLayout({ tool, children }: Props) {
  const relatedTools = getRelatedTools(tool.slug);
  const icon = ICON_MAP[tool.icon] || "🔧";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-stone-400 mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/tools" className="hover:text-primary transition-colors">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-stone-600 font-medium">{tool.shortName}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl" role="img" aria-hidden="true">
            {icon}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {tool.shortName}
          </h1>
        </div>
        <p className="text-lg text-stone-600 max-w-2xl">{tool.longDescription}</p>
      </header>

      {/* Top ad slot */}
      <AdSlot slot={`tools-${tool.slug}-top`} format="horizontal" className="mb-6" />

      {/* Calculator widget */}
      <section aria-label={`${tool.shortName} tool`}>{children}</section>

      {/* Mid-page ad */}
      <AdSlot slot={`tools-${tool.slug}-mid`} format="in-article" className="my-8" />

      {/* Newsletter CTA */}
      <div className="my-10">
        <NewsletterInlineBlock
          heading={`Like the ${tool.shortName}?`}
          body="Get free wellness tools, tips, and evidence-based guides delivered weekly."
        />
      </div>

      {/* Affiliate-ready section */}
      <section className="border border-border rounded-xl p-6 bg-stone-50 my-10">
        <h2 className="text-xl font-semibold mb-2">
          {tool.affiliateHeading || "Recommended Products"}
        </h2>
        <p className="text-sm text-stone-500 mb-4">
          {tool.affiliateText ||
            "We may earn a commission if you purchase through our links."}
        </p>
        <div className="bg-white border border-dashed border-stone-300 rounded-lg p-8 text-center text-stone-400 text-sm">
          Product recommendations coming soon. We are carefully selecting items
          we genuinely believe will support your wellness journey.
        </div>
        <p className="text-xs text-stone-400 italic mt-3">
          Some links may be affiliate links. If you make a purchase, we may earn
          a small commission at no extra cost to you.
        </p>
      </section>

      {/* FAQ Section */}
      {tool.faqs.length > 0 && (
        <section className="my-10">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-stone-200 rounded-xl bg-white"
              >
                <summary className="cursor-pointer px-6 py-4 font-medium text-stone-800 hover:text-primary transition-colors list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-stone-400 group-open:rotate-180 transition-transform ml-4 shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 7.5L10 12.5L15 7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-4 text-stone-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="my-10">
          <h2 className="text-2xl font-bold mb-4">Related Tools</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedTools.map((rt) => (
              <Link
                key={rt.slug}
                href={`/tools/${rt.slug}`}
                className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <span className="text-2xl">
                  {ICON_MAP[rt.icon] || "🔧"}
                </span>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {rt.shortName}
                  </p>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {rt.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Articles */}
      {tool.relatedArticles.length > 0 && (
        <section className="my-10">
          <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
          <ul className="space-y-2">
            {tool.relatedArticles.map((article, i) => (
              <li key={i}>
                <Link
                  href={article.href}
                  className="text-primary hover:underline font-medium"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bottom ad */}
      <AdSlot
        slot={`tools-${tool.slug}-bottom`}
        format="rectangle"
        className="my-8"
      />

      {/* Disclaimer */}
      <aside className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mt-10">
        <p className="font-semibold mb-1">Wellness Disclaimer</p>
        <p>
          This tool provides general estimates for informational and educational
          purposes only. It is not a substitute for professional medical advice,
          diagnosis, or treatment. Individual results vary. Always consult a
          qualified healthcare provider before making changes to your health
          routine.
        </p>
      </aside>
    </div>
  );
}
