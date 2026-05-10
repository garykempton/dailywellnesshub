import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `${SITE_NAME} wellness disclaimer — educational content only, not medical advice.`,
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      <div className="space-y-4 text-stone-600 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <h2 className="text-xl font-semibold text-foreground">General Information Only</h2>
        <p>
          The information provided on {SITE_NAME} is for general informational
          and educational purposes only. All content is provided in good faith;
          however, we make no representation or warranty of any kind, express or
          implied, regarding the accuracy, adequacy, validity, reliability, or
          completeness of any information on the site.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Not Medical Advice</h2>
        <p>
          {SITE_NAME} does not provide medical advice. The content on this
          website is not intended to be a substitute for professional medical
          advice, diagnosis, or treatment. Always seek the advice of your
          physician or other qualified health provider with any questions you
          may have regarding a medical condition. Never disregard professional
          medical advice or delay in seeking it because of something you have
          read on this website.
        </p>

        <h2 className="text-xl font-semibold text-foreground">No Guarantees</h2>
        <p>
          We do not guarantee any specific results from the information on this
          website. Individual results may vary. We do not make any claims about
          curing, treating, or preventing any disease or condition.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Affiliate Links & Advertising</h2>
        <p>
          Some articles on {SITE_NAME} may contain affiliate links or
          advertisements. If you click on an affiliate link and make a purchase,
          we may receive a small commission at no additional cost to you. This
          does not influence our editorial content or recommendations. We only
          recommend products and services we believe may be genuinely useful.
        </p>

        <h2 className="text-xl font-semibold text-foreground">External Links</h2>
        <p>
          This website may contain links to external websites that are not
          provided or maintained by us. We do not guarantee the accuracy,
          relevance, or completeness of any information on these external sites.
        </p>

        <h2 className="text-xl font-semibold text-foreground">AI-Assisted Content</h2>
        <p>
          Some content on this site may be created with the assistance of
          artificial intelligence tools. All AI-generated content is reviewed by
          our editorial team before publication to ensure accuracy and quality.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          If you have any questions about this disclaimer, please{" "}
          <a href="/contact" className="text-primary underline">contact us</a>.
        </p>
      </div>
    </div>
  );
}
