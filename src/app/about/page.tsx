import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { SiteDisclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_NAME} — our mission, editorial standards, and commitment to evidence-based wellness content.`,
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
          We create educational content that helps people make informed
          decisions about their well-being. From nutrition and fitness to mental
          wellness and healthy habits, our goal is to translate complex research
          into advice you can actually use.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Editorial Standards
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Evidence-based:</strong> We reference published studies and
            expert guidance wherever possible. Sources are cited at the bottom
            of each article.
          </li>
          <li>
            <strong>Reviewed before publication:</strong> Every article goes
            through an editorial review process before it goes live.
          </li>
          <li>
            <strong>No miracle claims:</strong> We never promise cures,
            guaranteed results, or overnight transformations. Wellness is a
            journey, and we respect that.
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
          concern, please consult a qualified healthcare provider.
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
