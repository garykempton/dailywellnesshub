import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "BMI Calculator - Free Body Mass Index Tool",
  description:
    "Calculate your BMI instantly with our free Body Mass Index calculator. Supports metric and imperial units. Understand what your BMI result means.",
  path: "/tools/bmi-calculator",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "BMI Calculator",
            description:
              "Calculate your Body Mass Index using height and weight. Supports metric and imperial units.",
            url: `${SITE_URL}/tools/bmi-calculator`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
          }),
        }}
      />
    </>
  );
}
