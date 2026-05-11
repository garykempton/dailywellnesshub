import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import { TOOL_CATEGORIES } from "@/lib/tools";
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
      <section className="gradient-calm py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Evidence-Based Wellness
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-foreground leading-[1.1]">
            Your Daily Guide to{" "}
            <span className="text-primary">Healthier Living</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Practical wellness guides, free health tools, and lifestyle tips backed by research — written for real people.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="inline" />
            <p className="text-xs text-muted mt-3">
              Free weekly newsletter. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <AdSlot slot="home-top" format="horizontal" className="max-w-4xl mx-auto px-4" />

      {/* Categories grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Explore Wellness Topics
          </h2>
          <p className="text-muted mt-2">Browse our collection of practical, evidence-based guides</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="card-hover bg-card border border-border/60 rounded-2xl p-5 md:p-6 group text-center"
            >
              <span className="text-3xl block mb-3">{cat.icon}</span>
              <h3 className="font-semibold text-stone-800 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Free Wellness Tools */}
      <section className="bg-surface py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Free Wellness Tools &amp; Calculators
            </h2>
            <p className="text-muted mt-2">
              76 free tools to support your health and fitness journey. No signup required.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {TOOL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tools/${cat.slug}`}
                className="card-hover bg-card border border-border/60 rounded-2xl p-5 md:p-6 group text-center"
              >
                <span className="text-3xl block mb-3">{cat.emoji}</span>
                <h3 className="font-semibold text-stone-800 group-hover:text-primary transition-colors">
                  {cat.shortName}
                </h3>
                <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-green-500/20"
            >
              Browse All Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <AdSlot slot="home-mid" format="horizontal" className="max-w-4xl mx-auto px-4" />

      {/* Value proposition */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center tracking-tight">
            Why {SITE_NAME}?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Factual & Cautious",
                text: 'We say "may help" and "research suggests" — never miracle cures. Every article is reviewed before publication.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: "Practical Advice",
                text: "No vague theories. We give you clear, actionable steps you can start today.",
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: "Honest & Transparent",
                text: "We clearly disclose affiliate links and always recommend speaking to a qualified professional.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <NewsletterForm variant="full" />
      </section>

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <SiteDisclaimer />
      </section>
    </>
  );
}
