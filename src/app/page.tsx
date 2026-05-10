import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import { websiteJsonLd, organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "@/components/NewsletterForm";
import { AdSlot } from "@/components/AdSlot";
import { SiteDisclaimer } from "@/components/Disclaimer";

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-background py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your Daily Guide to{" "}
            <span className="text-primary">Healthier Living</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            Factual wellness guides, practical lifestyle tips, and simple health
            tools — written for real people. Educational only, not medical advice.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="inline" />
            <p className="text-xs text-muted mt-2">
              Free weekly newsletter. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <AdSlot slot="home-top" format="horizontal" className="max-w-4xl mx-auto px-4" />

      {/* Categories grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Explore Wellness Topics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all group text-center"
            >
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted mt-1 line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot slot="home-mid" format="horizontal" className="max-w-4xl mx-auto px-4" />

      {/* Value proposition */}
      <section className="bg-stone-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Why {SITE_NAME}?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold mb-1">Factual & Cautious</h3>
              <p className="text-sm text-muted">
                We say &ldquo;may help&rdquo; and &ldquo;research suggests&rdquo;
                — never miracle cures. Every article is reviewed before publication.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-1">Practical Advice</h3>
              <p className="text-sm text-muted">
                No vague theories. We give you clear, actionable steps you can
                start today.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold mb-1">Honest & Transparent</h3>
              <p className="text-sm text-muted">
                We clearly disclose affiliate links and always recommend speaking
                to a qualified professional. Your trust matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <NewsletterForm variant="full" />
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <SiteDisclaimer />
      </section>
    </>
  );
}
