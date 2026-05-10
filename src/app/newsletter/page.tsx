import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Subscribe to Our Newsletter",
  description:
    "Get weekly wellness tips, healthy living guides, and self-improvement strategies delivered to your inbox. Free forever.",
};

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Stay Healthy, Stay Informed</h1>
        <p className="text-muted">
          Join our growing community of wellness-minded readers. Every week,
          we&apos;ll send you our best articles — no fluff, no spam, just
          practical advice backed by research.
        </p>
      </div>

      <NewsletterForm variant="full" />

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center text-sm">
        <div>
          <p className="font-semibold mb-1">Weekly Delivery</p>
          <p className="text-muted">
            One curated email every week with our best new content.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-1">100% Free</p>
          <p className="text-muted">
            No premium tiers, no paywalls. All content is free.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-1">Easy Unsubscribe</p>
          <p className="text-muted">
            One-click unsubscribe in every email. No guilt, no hassle.
          </p>
        </div>
      </div>
    </div>
  );
}
