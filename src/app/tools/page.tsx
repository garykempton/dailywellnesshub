import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { SiteDisclaimer } from "@/components/Disclaimer";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterInlineBlock } from "@/components/NewsletterInlineBlock";
import { TOOL_CATEGORIES, getToolsByCategory, TOOLS_REGISTRY } from "@/lib/tools";
import { ICON_MAP } from "@/components/ToolPageLayout";

const totalTools = TOOLS_REGISTRY.length;

export const metadata: Metadata = buildMetadata({
  title: "Free Wellness Tools & Calculators",
  description: `${totalTools} free health and wellness calculators and trackers: BMI, body fat, ideal weight, running pace, sleep cycles, calories, macros, protein, VO2 max, 1RM, hydration, fasting, and more. No signup required.`,
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Free Wellness Tools & Calculators
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto">
          {totalTools} free tools to support your health and fitness journey.
          No signup required. For educational purposes only — not medical advice.
        </p>
      </div>

      <AdSlot slot="tools-index-top" format="horizontal" className="mb-8" />

      {/* Tool categories */}
      {TOOL_CATEGORIES.map((category, catIdx) => {
        const tools = getToolsByCategory(category.slug);
        if (tools.length === 0) return null;

        return (
          <section key={category.slug} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                <h2 className="text-xl font-bold text-stone-800">
                  {category.name}
                </h2>
              </div>
              <Link
                href={`/tools/${category.slug}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <span className="text-3xl">
                    {ICON_MAP[tool.icon] || "🔧"}
                  </span>
                  <h3 className="text-base font-semibold mt-2 group-hover:text-primary transition-colors">
                    {tool.shortName}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* Newsletter CTA after second category */}
            {catIdx === 1 && (
              <div className="mt-8">
                <NewsletterInlineBlock
                  heading="Get new tools first"
                  body="Subscribe for free wellness tools, calculators, and evidence-based health guides."
                />
              </div>
            )}
          </section>
        );
      })}

      <AdSlot slot="tools-index-bottom" format="rectangle" className="my-8" />

      <div className="mt-12">
        <SiteDisclaimer />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Free Wellness Tools & Calculators",
            description:
              "Free health and wellness calculators, trackers, and assessment tools.",
            url: `${SITE_URL}/tools`,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalTools,
              itemListElement: TOOLS_REGISTRY.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: tool.shortName,
                url: `${SITE_URL}/tools/${tool.slug}`,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
