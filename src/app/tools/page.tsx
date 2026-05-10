import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { SiteDisclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Free Wellness Tools & Calculators",
  description:
    "Free health and wellness calculators including BMI, hydration, sleep, calorie, and heart rate tools. For educational purposes only.",
};

const TOOLS = [
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description:
      "Calculate your Body Mass Index using height and weight. Understand what your result means.",
    icon: "⚖️",
  },
  {
    slug: "hydration-calculator",
    name: "Hydration Calculator",
    description:
      "Estimate your daily water intake based on weight, activity level, and climate.",
    icon: "💧",
  },
  {
    slug: "sleep-calculator",
    name: "Sleep Calculator",
    description:
      "Find optimal bedtimes and wake times based on sleep cycles and your schedule.",
    icon: "😴",
  },
  {
    slug: "calorie-calculator",
    name: "Calorie & TDEE Calculator",
    description:
      "Estimate your Total Daily Energy Expenditure based on age, weight, height, and activity.",
    icon: "🔥",
  },
  {
    slug: "heart-rate-calculator",
    name: "Heart Rate Zones Calculator",
    description:
      "Calculate your target heart rate training zones based on age and resting heart rate.",
    icon: "❤️",
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Free Wellness Tools</h1>
      <p className="text-stone-500 mb-8">
        Simple calculators to support your wellness journey. These tools
        provide general estimates only and are not a substitute for
        professional advice.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <span className="text-3xl">{tool.icon}</span>
            <h2 className="text-lg font-semibold mt-3 group-hover:text-primary transition-colors">
              {tool.name}
            </h2>
            <p className="text-sm text-stone-500 mt-1">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <SiteDisclaimer />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Free Wellness Tools & Calculators",
            description: "Free health and wellness calculators.",
            url: `https://dailywellnesshub.com/tools`,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
          }),
        }}
      />
    </div>
  );
}
