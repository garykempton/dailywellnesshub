import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { SiteDisclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_NAME} — our mission, editorial standards, and commitment to factual, helpful wellness content.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About {SITE_NAME}</h1>

      <div className="space-y-6 text-stone-600 leading-relaxed">
        <p>
          {SITE_NAME} is a wellness and lifestyle resource built on one simple
          belief: everyone deserves access to clear, honest, and practical
          health information.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
        <p>
          We create educational content that may help people make more informed
          decisions about their well-being. From sleep and nutrition to stress
          management and healthy ageing, our goal is to share what research
          suggests in plain, useful language — while always being honest about
          what is and isn&apos;t well-established.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Editorial Standards
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Factual and cautious:</strong> We use hedging language like
            &ldquo;may help&rdquo;, &ldquo;is associated with&rdquo;, and
            &ldquo;research suggests&rdquo;. We never promise cures or
            guaranteed results.
          </li>
          <li>
            <strong>Reviewed before publication:</strong> Every article goes
            through an editorial review process before it goes live.
          </li>
          <li>
            <strong>Sources cited:</strong> We reference published studies and
            expert guidance wherever possible. Sources are listed at the bottom
            of each article.
          </li>
          <li>
            <strong>Transparent affiliates:</strong> Some articles contain
            affiliate links. These are always disclosed, and they never
            influence our editorial opinions.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">
          What We Are Not
        </h2>
        <p>
          {SITE_NAME} is <strong>not</strong> a medical website. We do not
          diagnose, treat, or prescribe. Our content is educational and should
          never replace professional medical advice. If you have a health
          concern, please speak to a qualified healthcare provider.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          Have a question, suggestion, or correction? We&apos;d love to hear
          from you. Visit our{" "}
          <a href="/contact" className="text-primary underline">
            contact page
          </a>{" "}
          to get in touch.
        </p>
      </div>

      <div className="mt-10">
        <SiteDisclaimer />
      </div>
    </div>
  );
}
