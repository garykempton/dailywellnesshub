import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Heart Rate Zones Calculator - Training Zone Tool",
  description:
    "Calculate your target heart rate training zones using the Karvonen method. Free tool for planning cardio workouts and optimising training intensity.",
  path: "/tools/heart-rate-calculator",
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
            name: "Heart Rate Zones Calculator",
            description:
              "Calculate target heart rate training zones based on age and resting heart rate.",
            url: `${SITE_URL}/tools/heart-rate-calculator`,
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
