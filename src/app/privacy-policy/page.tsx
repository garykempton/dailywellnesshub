import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE_NAME} privacy policy — how we collect, use, and protect your data.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-stone-600 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <h2 className="text-xl font-semibold text-foreground">Introduction</h2>
        <p>
          {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;)
          operates {SITE_URL}. This Privacy Policy explains how we collect, use,
          and protect your personal information when you visit our website.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Newsletter subscribers:</strong> email address and optional
            name, provided voluntarily.
          </li>
          <li>
            <strong>Contact form:</strong> name, email, and message content.
          </li>
          <li>
            <strong>Analytics:</strong> anonymised usage data (page views,
            device type, referral source) via Google Analytics.
          </li>
          <li>
            <strong>Cookies:</strong> functional and analytics cookies as
            described in our Cookie Policy.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To send newsletter emails you have subscribed to.</li>
          <li>To respond to contact form enquiries.</li>
          <li>To improve our website content and user experience.</li>
          <li>To display relevant advertisements via third-party ad networks.</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
        <p>
          We use the following third-party services that may collect data:
          Google Analytics, Google AdSense (or Ezoic), and Resend (email
          delivery). Each service has its own privacy policy.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Data Retention</h2>
        <p>
          Newsletter subscriber data is retained until you unsubscribe. Contact
          messages are retained for up to 12 months. Analytics data is retained
          as per Google&apos;s default retention settings.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data at any time by contacting us. You can unsubscribe from our
          newsletter using the link in any email.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          For privacy-related enquiries, please{" "}
          <a href="/contact" className="text-primary underline">contact us</a>.
        </p>
      </div>
    </div>
  );
}
