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
    "31 free health and wellness calculators and trackers: body fat, ideal weight, running pace, sleep cycles, calories, macros, protein, VO2 max, 1RM, hydration, fasting, and more. No signup required.",
  path: "/tools",
});

interface ToolCategory {
  name: string;
  tools: { slug: string; name: string; description: string; icon: string }[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "Body Composition",
    tools: [
      {
        slug: "bmi-calculator",
        name: "BMI Calculator",
        description:
          "Calculate your Body Mass Index using height and weight.",
        icon: "⚖️",
      },
      {
        slug: "body-fat-calculator",
        name: "Body Fat Calculator",
        description:
          "Estimate body fat percentage using the US Navy tape measure method.",
        icon: "📏",
      },
      {
        slug: "ideal-weight-calculator",
        name: "Ideal Weight Calculator",
        description:
          "Calculate ideal weight using four established medical formulas.",
        icon: "🎯",
      },
      {
        slug: "lean-body-mass-calculator",
        name: "Lean Body Mass Calculator",
        description:
          "Estimate fat-free mass using Boer, James, and Hume formulas.",
        icon: "💪",
      },
      {
        slug: "waist-hip-ratio-calculator",
        name: "Waist-to-Hip Ratio",
        description:
          "Calculate WHR and assess cardiovascular health risk level.",
        icon: "📐",
      },
    ],
  },
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
        slug: "protein-calculator",
        name: "Protein Intake Calculator",
        description:
          "Calculate daily protein needs based on weight, activity, and goals.",
        icon: "🥚",
      },
      {
        slug: "hydration-calculator",
        name: "Water Intake Calculator",
        description:
          "Estimate daily water intake based on weight, activity, and climate.",
        icon: "💧",
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
    name: "Cardio & Running",
    tools: [
      {
        slug: "heart-rate-calculator",
        name: "Heart Rate Zones Calculator",
        description:
          "Calculate target heart rate training zones based on age and resting HR.",
        icon: "❤️",
      },
      {
        slug: "running-pace-calculator",
        name: "Running Pace Calculator",
        description:
          "Calculate pace, finish time, or distance with race projections.",
        icon: "🏃‍♂️",
      },
      {
        slug: "vo2-max-calculator",
        name: "VO2 Max Estimator",
        description:
          "Estimate aerobic fitness using the Cooper run or Rockport walk test.",
        icon: "🫁",
      },
      {
        slug: "running-calorie-calculator",
        name: "Running Calorie Calculator",
        description:
          "Calculate calories burned running based on speed, distance, and terrain.",
        icon: "👟",
      },
      {
        slug: "cycling-calorie-calculator",
        name: "Cycling Calorie Calculator",
        description:
          "Calculate calories burned cycling by type, speed, and duration.",
        icon: "🚴",
      },
      {
        slug: "swimming-calorie-calculator",
        name: "Swimming Calorie Calculator",
        description:
          "Calculate calories burned swimming by stroke, intensity, and duration.",
        icon: "🏊",
      },
      {
        slug: "walking-calorie-calculator",
        name: "Walking Calorie Calculator",
        description:
          "Calculate calories burned walking based on speed, distance, and terrain.",
        icon: "🚶",
      },
      {
        slug: "steps-to-calories-calculator",
        name: "Steps to Calories Calculator",
        description:
          "Convert your daily step count into estimated calories burned.",
        icon: "🚶",
      },
    ],
  },
  {
    name: "Strength & Fitness",
    tools: [
      {
        slug: "one-rep-max-calculator",
        name: "One Rep Max (1RM) Calculator",
        description:
          "Estimate your max lift using Epley, Brzycki, and Lombardi formulas.",
        icon: "🏋️",
      },
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
        slug: "nap-calculator",
        name: "Nap Calculator",
        description:
          "Find the ideal nap duration and timing to boost alertness without grogginess.",
        icon: "😴",
      },
      {
        slug: "caffeine-calculator",
        name: "Caffeine Calculator",
        description:
          "Track caffeine half-life and find your latest safe coffee cutoff time.",
        icon: "☕",
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
    name: "Habits & Lifestyle",
    tools: [
      {
        slug: "habit-tracker",
        name: "Habit Tracker",
        description:
          "Track up to 10 daily habits with streak counters and progress bars.",
        icon: "✅",
      },
      {
        slug: "pregnancy-due-date-calculator",
        name: "Pregnancy Due Date Calculator",
        description:
          "Estimate your delivery date, trimester timeline, and pregnancy milestones.",
        icon: "👶",
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
