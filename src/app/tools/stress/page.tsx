import type { Metadata } from "next";
import Link from "next/link";
import { getToolCategory, getToolsByCategory, toolCategoryJsonLd, TOOL_CATEGORIES } from "@/lib/tools";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterInlineBlock } from "@/components/NewsletterInlineBlock";
import { SiteDisclaimer } from "@/components/Disclaimer";

const category = getToolCategory("stress")!;
const tools = getToolsByCategory("stress");

export const metadata: Metadata = buildMetadata({
  title: category.name,
  description: category.description,
  path: `/tools/${category.slug}`,
});

export default function CategoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-stone-400 mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/tools" className="hover:text-primary transition-colors">Tools</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-stone-600 font-medium">{category.shortName}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{category.emoji}</span>
          <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
        </div>
        <p className="text-lg text-stone-600 max-w-3xl">{category.longDescription}</p>
        <p className="text-sm text-stone-400 mt-2">{tools.length} free tools — no signup required</p>
      </div>

      <AdSlot slot={`tools-cat-${category.slug}-top`} format="horizontal" className="mb-8" />

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {tools.map(tool => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}
            className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all group">
            <h2 className="text-base font-semibold group-hover:text-primary transition-colors">
              {tool.shortName}
            </h2>
            <p className="text-sm text-stone-500 mt-1 line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <NewsletterInlineBlock
        heading={`Get more ${category.shortName.toLowerCase()} tools`}
        body={`Subscribe to be the first to know when we add new ${category.shortName.toLowerCase()} tools, plus weekly wellness tips.`}
      />

      <AdSlot slot={`tools-cat-${category.slug}-bottom`} format="rectangle" className="my-8" />

      {/* Browse other categories */}
      <section className="my-12">
        <h2 className="text-xl font-bold mb-4">Browse Other Tool Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOOL_CATEGORIES.filter(c => c.slug !== category.slug).map(c => (
            <Link key={c.slug} href={`/tools/${c.slug}`}
              className="bg-white border border-stone-200 rounded-lg p-3 hover:shadow-sm hover:border-primary/30 transition-all group text-center">
              <span className="text-2xl block mb-1">{c.emoji}</span>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{c.shortName}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteDisclaimer />

      {/* JSON-LD */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolCategoryJsonLd(category)) }} />
    </div>
  );
}
