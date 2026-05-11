import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { SiteDisclaimer } from "@/components/Disclaimer";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterInlineBlock } from "@/components/NewsletterInlineBlock";

export const metadata: Metadata = buildMetadata({
  title: "Free Wellness Tools & Calculators",
  description:
    "19 free health and wellness calculators and trackers: sleep, calories, macros, hydration, fasting, breathing, habit tracking, mobility, recovery, and more. No signup required.",
  path: "/tools",
});

interface ToolCategory {
  name: string;
  tools: { slug: string; name: string; description: string; icon: string }[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "Nutrition & Calories",
    tools: [
      {
        slug: "calorie-calculator",
        name: "Calorie & TDEE Calculator",
        description:
          "Estimate BMR and daily energy expenditure using the Mifflin-St Jeor equation.",
        icon: "🔥",
      },
      {
        slug: "macro-calculator",
        name: "Macro Calculator",
        description:
          "Calculate daily protein, carbs, and fat targets based on your goals.",
        icon: "📊",
      },
      {
        slug: "hydration-calculator",
        name: "Water Intake Calculator",
        description:
          "Estimate daily water intake based on weight, activity, and climate.",
        icon: "💧",
      },
      {
        slug: "walking-calorie-calculator",
        name: "Walking Calorie Calculator",
        description:
          "Calculate calories burned walking based on speed, distance, and terrain.",
        icon: "🚶",
      },
      {
        slug: "fasting-tracker",
        name: "Fasting Tracker",
        description:
          "Track intermittent fasting windows with a visual countdown timer.",
        icon: "⏱️",
      },
    ],
  },
  {
    name: "Sleep & Recovery",
    tools: [
      {
        slug: "sleep-calculator",
        name: "Sleep Calculator",
        description:
          "Find optimal bedtimes and wake times based on 90-minute sleep cycles.",
        icon: "🌙",
      },
      {
        slug: "recovery-tracker",
        name: "Recovery Tracker",
        description:
          "Monitor post-workout recovery with sleep, soreness, energy, and mood scores.",
        icon: "💓",
      },
    ],
  },
  {
    name: "Fitness & Movement",
    tools: [
      {
        slug: "flexibility-tracker",
        name: "Flexibility Tracker",
        description:
          "Rate and track flexibility across 8 key body areas with personalised suggestions.",
        icon: "🧘",
      },
      {
        slug: "mobility-assessment",
        name: "Mobility Assessment",
        description:
          "Test joint mobility across 8 areas and get a mobility score with improvement tips.",
        icon: "🏃",
      },
      {
        slug: "martial-arts-conditioning-planner",
        name: "Martial Arts Conditioning Planner",
        description:
          "Build a weekly conditioning program tailored to your martial arts discipline.",
        icon: "🥋",
      },
      {
        slug: "bmi-calculator",
        name: "BMI Calculator",
        description:
          "Calculate your Body Mass Index using height and weight.",
        icon: "⚖️",
      },
      {
        slug: "heart-rate-calculator",
        name: "Heart Rate Zones Calculator",
        description:
          "Calculate target heart rate training zones based on age and resting HR.",
        icon: "❤️",
      },
    ],
  },
  {
    name: "Stress & Mindfulness",
    tools: [
      {
        slug: "breathing-timer",
        name: "Breathing Timer",
        description:
          "Guided box breathing, 4-7-8, and deep belly breathing with visual cues.",
        icon: "🌬️",
      },
      {
        slug: "tai-chi-breathing-timer",
        name: "Tai Chi Breathing Timer",
        description:
          "Guided Tai Chi breathing patterns with natural, reverse, and flowing techniques.",
        icon: "🍃",
      },
      {
        slug: "stress-reduction-checklist",
        name: "Stress Reduction Checklist",
        description:
          "Daily science-backed stress management checklist across 4 wellness categories.",
        icon: "🛡️",
      },
    ],
  },
  {
    name: "Habits & Tracking",
    tools: [
      {
        slug: "habit-tracker",
        name: "Habit Tracker",
        description:
          "Track up to 10 daily habits with streak counters and progress bars.",
        icon: "✅",
      },
    ],
  },
];

export default function ToolsPage() {
  const totalTools = TOOL_CATEGORIES.reduce(
    (sum, cat) => sum + cat.tools.length,
    0,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Free Wellness Tools & Calculators
        </h1>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto">
          {totalTools} free tools to support your health and fitness journey.
          No signup required. For educational purposes only — not medical advice.
        </p>
      </div>

      <AdSlot slot="tools-index-top" format="horizontal" className="mb-8" />

      {/* Tool categories */}
      {TOOL_CATEGORIES.map((category, catIdx) => (
        <section key={category.name} className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-stone-800">
            {category.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <span className="text-3xl">{tool.icon}</span>
                <h3 className="text-base font-semibold mt-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA after second category */}
          {catIdx === 1 && (
            <div className="mt-8">
              <NewsletterInlineBlock
                heading="Get new tools first"
                body="Subscribe for free wellness tools, calculators, and evidence-based health guides."
              />
            </div>
          )}
        </section>
      ))}

      <AdSlot slot="tools-index-bottom" format="rectangle" className="my-8" />

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
            description:
              "Free health and wellness calculators, trackers, and assessment tools.",
            url: `${SITE_URL}/tools`,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: totalTools,
              itemListElement: TOOL_CATEGORIES.flatMap((cat) =>
                cat.tools.map((tool, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: tool.name,
                  url: `${SITE_URL}/tools/${tool.slug}`,
                })),
              ),
            },
          }),
        }}
      />
    </div>
  );
}
