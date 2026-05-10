export const SITE_NAME = "DailyWellnessHub";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dailywellnesshub.com";
export const SITE_DESCRIPTION =
  "Factual wellness guides, healthy lifestyle tips, and practical self-improvement strategies. Educational content only — not medical advice.";

export const CATEGORIES = [
  {
    slug: "sleep",
    name: "Sleep",
    description:
      "Practical tips that may help improve your sleep quality, bedtime routines, and rest.",
    icon: "😴",
  },
  {
    slug: "weight-loss",
    name: "Weight Loss",
    description:
      "Evidence-informed approaches to weight management, sustainable eating, and healthy body composition.",
    icon: "⚖️",
  },
  {
    slug: "fitness",
    name: "Fitness",
    description:
      "Workout ideas, exercise guides, and tips for building a more active lifestyle.",
    icon: "💪",
  },
  {
    slug: "nutrition",
    name: "Nutrition",
    description:
      "Guides to balanced eating, meal planning, and understanding nutrients — speak to a dietitian for personal advice.",
    icon: "🥗",
  },
  {
    slug: "menopause",
    name: "Menopause",
    description:
      "Information and lifestyle tips that may support well-being during perimenopause and menopause.",
    icon: "🌸",
  },
  {
    slug: "stress",
    name: "Stress",
    description:
      "Techniques and lifestyle changes that are associated with lower stress levels and better coping.",
    icon: "🧘",
  },
  {
    slug: "healthy-ageing",
    name: "Healthy Ageing",
    description:
      "Lifestyle factors that research suggests may support vitality and well-being as you age.",
    icon: "🌿",
  },
  {
    slug: "habits",
    name: "Habits",
    description:
      "Practical strategies for building positive daily routines and breaking unhelpful patterns.",
    icon: "✅",
  },
  {
    slug: "family-wellness",
    name: "Family Wellness",
    description:
      "Tips for supporting the health and well-being of your whole family, from children to older adults.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    slug: "mental-wellness",
    name: "Mental Wellness",
    description:
      "Self-care ideas and awareness resources that may support emotional well-being. This is not therapy — please speak to a qualified professional if you need support.",
    icon: "🧠",
  },
  {
    slug: "productivity",
    name: "Productivity",
    description:
      "Time management, focus techniques, and strategies for getting more done without burning out.",
    icon: "⚡",
  },
  {
    slug: "health-calculators",
    name: "Simple Health Calculators",
    description:
      "Free tools for BMI, hydration, sleep needs, and more. For guidance only — always consult a professional.",
    icon: "🧮",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
