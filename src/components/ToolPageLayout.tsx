"use client";

import Link from "next/link";
import { NewsletterInlineBlock } from "@/components/NewsletterInlineBlock";
import { ToolShareBar } from "@/components/ToolShareBar";
import { AdSlot } from "@/components/AdSlot";
import type { ToolDefinition } from "@/lib/tools";
import { getRelatedTools, getToolCategoryForTool, getToolsByCategory } from "@/lib/tools";
import { SITE_URL } from "@/lib/constants";

interface Props {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export const ICON_MAP: Record<string, string> = {
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
  ruler: "📏",
  target: "🎯",
  dumbbell: "💪",
  "tape-measure": "📐",
  running: "🏃‍♂️",
  lungs: "🫁",
  shoe: "👟",
  bike: "🚴",
  waves: "🏊",
  barbell: "🏋️",
  egg: "🥚",
  nap: "😴",
  coffee: "☕",
  baby: "👶",
  calendar: "🗓️",
  flower: "🌸",
  stethoscope: "🩺",
  "chart-down": "📉",
  wine: "🍷",
  "body-type": "🧍",
  stopwatch: "⏲️",
  lotus: "🪷",
  clipboard: "📋",
  arrows: "🔄",
  acrobat: "🤸",
  phone: "📱",
  "muscle-clock": "⏳",
  "yoga-flow": "🧘‍♀️",
  pill: "💊",
  "sleep-debt": "😪",
  owl: "🦉",
  snowflake: "❄️",
  thermometer: "🌡️",
  pregnant: "🤰",
  dna: "🧬",
  "clock-meal": "🕐",
  grain: "🌾",
  "jump-rope": "⏭️",
  stairs: "🪜",
  rowing: "🚣",
  plank: "🧱",
  beer: "🍺",
  pushup: "🫸",
  desk: "🖥️",
  bacon: "🥓",
  "flame-small": "🔥",
  "muscle-up": "💪🏋️",
  "foam-roller": "🧴",
  "step-goal": "👣",
  hourglass: "⏳",
  "heart-check": "❤️‍🩹",
  "height-ruler": "📐",
  salt: "🧂",
  "heart-recovery": "💗",
  "yoga-mat": "🧘‍♀️",
  pilates: "🤸‍♀️",
  trophy: "🏆",
  contraction: "⏱️👶",
  "heart-rest": "🫀",
};

export function ToolPageLayout({ tool, children }: Props) {
  const relatedTools = getRelatedTools(tool.slug);
  const category = getToolCategoryForTool(tool);
  const icon = ICON_MAP[tool.icon] || "🔧";
  const toolUrl = `${SITE_URL}/tools/${tool.slug}`;

  const categoryTools = category
    ? getToolsByCategory(category.slug).filter((t) => t.slug !== tool.slug)
    : [];

  const newsletterHeading = category
    ? `More free ${category.shortName.toLowerCase()} tools coming soon`
    : `Like the ${tool.shortName}?`;
  const newsletterBody = category
    ? `Subscribe to get notified when we add new ${category.shortName.toLowerCase()} tools, plus weekly wellness tips and guides.`
    : "Get free wellness tools, tips, and evidence-based guides delivered weekly.";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted mb-6">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li aria-hidden="true" className="text-stone-300">/</li>
          <li>
            <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true" className="text-stone-300">/</li>
              <li>
                <Link href={`/tools/${category.slug}`} className="hover:text-primary transition-colors">
                  {category.shortName}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true" className="text-stone-300">/</li>
          <li className="text-stone-700 font-medium">{tool.shortName}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl md:text-5xl" role="img" aria-hidden="true">{icon}</span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">{tool.shortName}</h1>
        </div>
        <p className="text-lg text-muted max-w-2xl mb-5 leading-relaxed">{tool.longDescription}</p>
        <ToolShareBar url={toolUrl} title={`${tool.shortName} - Free Online Tool`} description={tool.description} />
      </header>

      <AdSlot slot={`tools-${tool.slug}-top`} format="horizontal" className="mb-8" />

      {/* Calculator widget */}
      <section aria-label={`${tool.shortName} tool`}>{children}</section>

      <AdSlot slot={`tools-${tool.slug}-mid`} format="in-article" className="my-10" />

      {/* Newsletter CTA */}
      <div className="my-12">
        <NewsletterInlineBlock heading={newsletterHeading} body={newsletterBody} />
      </div>

      {/* Affiliate-ready section */}
      <section className="border border-border/60 rounded-2xl p-6 md:p-8 bg-surface my-12">
        <h2 className="text-xl font-bold mb-2">
          {tool.affiliateHeading || "Recommended Products"}
        </h2>
        <p className="text-sm text-muted mb-5">
          {tool.affiliateText || "We may earn a commission if you purchase through our links."}
        </p>
        <div className="bg-white border border-dashed border-stone-200 rounded-xl p-10 text-center text-muted text-sm">
          Product recommendations coming soon. We are carefully selecting items
          we genuinely believe will support your wellness journey.
        </div>
        <p className="text-xs text-stone-400 italic mt-4">
          Some links may be affiliate links. If you make a purchase, we may earn
          a small commission at no extra cost to you.
        </p>
      </section>

      {/* FAQ Section */}
      {tool.faqs.length > 0 && (
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {tool.faqs.map((faq, i) => (
              <details key={i} className="group border border-border/60 rounded-2xl bg-white">
                <summary className="cursor-pointer px-6 py-4 font-medium text-stone-800 hover:text-primary transition-colors list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-stone-400 group-open:rotate-180 transition-transform ml-4 shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 7.5L10 12.5L15 7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-5 text-muted text-sm leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* More tools in this category */}
      {categoryTools.length > 0 && (
        <section className="my-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold tracking-tight">More {category?.shortName} Tools</h2>
            {category && (
              <Link href={`/tools/${category.slug}`} className="text-sm text-primary hover:text-primary-dark font-semibold transition-colors">
                View all &rarr;
              </Link>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {categoryTools.slice(0, 4).map((ct) => (
              <Link
                key={ct.slug}
                href={`/tools/${ct.slug}`}
                className="card-hover flex items-center gap-3 bg-white border border-border/60 rounded-2xl p-4 group"
              >
                <span className="text-2xl shrink-0">{ICON_MAP[ct.icon] || "🔧"}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800 group-hover:text-primary transition-colors">{ct.shortName}</p>
                  <p className="text-xs text-muted line-clamp-1">{ct.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-5 tracking-tight">Related Tools</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedTools.map((rt) => (
              <Link
                key={rt.slug}
                href={`/tools/${rt.slug}`}
                className="card-hover flex items-center gap-3 bg-white border border-border/60 rounded-2xl p-4 group"
              >
                <span className="text-2xl shrink-0">{ICON_MAP[rt.icon] || "🔧"}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-stone-800 group-hover:text-primary transition-colors">{rt.shortName}</p>
                  <p className="text-xs text-muted line-clamp-1">{rt.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Articles */}
      {tool.relatedArticles.length > 0 && (
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-5 tracking-tight">Related Articles</h2>
          <div className="space-y-3">
            {tool.relatedArticles.map((article, i) => (
              <Link
                key={i}
                href={article.href}
                className="block p-4 border border-border/60 rounded-2xl hover:border-primary/30 hover:bg-green-50/30 transition-all group"
              >
                <p className="font-semibold text-stone-800 group-hover:text-primary transition-colors">{article.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom share bar */}
      <div className="my-10 py-5 border-t border-border/60">
        <ToolShareBar url={toolUrl} title={`${tool.shortName} - Free Online Tool`} description={tool.description} />
      </div>

      <AdSlot slot={`tools-${tool.slug}-bottom`} format="rectangle" className="my-8" />

      {/* Disclaimer */}
      <aside className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-5 text-sm text-amber-800 mt-12">
        <p className="font-bold mb-1.5">Wellness Disclaimer</p>
        <p className="leading-relaxed">
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
