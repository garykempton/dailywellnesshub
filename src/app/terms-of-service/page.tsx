import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${SITE_NAME} terms of service — rules and conditions for using our website.`,
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4 text-stone-600 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <h2 className="text-xl font-semibold text-foreground">Acceptance of Terms</h2>
        <p>
          By accessing and using {SITE_NAME} ({SITE_URL}), you accept and agree
          to be bound by these Terms of Service. If you do not agree, please do
          not use our website.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Use of Content</h2>
        <p>
          All content on {SITE_NAME} is for personal, non-commercial,
          educational use only. You may not reproduce, distribute, or create
          derivative works from our content without prior written permission.
        </p>

        <h2 className="text-xl font-semibold text-foreground">No Medical Advice</h2>
        <p>
          Our content is informational and educational. It is not medical
          advice, diagnosis, or treatment. See our{" "}
          <a href="/disclaimer" className="text-primary underline">
            Disclaimer
          </a>{" "}
          for full details.
        </p>

        <h2 className="text-xl font-semibold text-foreground">User Conduct</h2>
        <p>
          You agree not to misuse our website, including but not limited to:
          attempting to gain unauthorised access to our systems, scraping content
          without permission, or submitting false information through our forms.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
        <p>
          All content, trademarks, and intellectual property on this site are
          owned by {SITE_NAME} or our licensors. All rights reserved.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
        <p>
          {SITE_NAME} shall not be liable for any damages arising from the use
          or inability to use our website or content. This includes but is not
          limited to direct, indirect, incidental, or consequential damages.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be
          posted on this page with an updated date. Continued use of the website
          constitutes acceptance of the modified terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          Questions about these terms? Please{" "}
          <a href="/contact" className="text-primary underline">contact us</a>.
        </p>
      </div>
    </div>
  );
}
