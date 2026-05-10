import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `${SITE_NAME} cookie policy — what cookies we use and why.`,
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <div className="space-y-4 text-stone-600 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <h2 className="text-xl font-semibold text-foreground">What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help us understand how you use our site and improve your
          experience.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Cookies We Use</h2>

        <h3 className="text-lg font-medium text-foreground">Essential Cookies</h3>
        <p>
          Required for basic site functionality. These cannot be disabled.
        </p>

        <h3 className="text-lg font-medium text-foreground">Analytics Cookies</h3>
        <p>
          Google Analytics cookies help us understand visitor behaviour
          (pages viewed, time on site, traffic sources). This data is
          anonymised and used solely to improve our content.
        </p>

        <h3 className="text-lg font-medium text-foreground">Advertising Cookies</h3>
        <p>
          Third-party advertising networks (such as Google AdSense or Ezoic)
          may use cookies to display relevant ads. These cookies track your
          browsing activity across websites to personalise advertisements.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings. Disabling
          certain cookies may affect your experience on our site. Most browsers
          allow you to refuse or delete cookies.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          Questions about our cookie practices? Please{" "}
          <a href="/contact" className="text-primary underline">contact us</a>.
        </p>
      </div>
    </div>
  );
}
