export const SITE_NAME = "DailyWellnessHub";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dailywellnesshub.com";
export const SITE_DESCRIPTION =
  "Science-backed wellness tips, healthy lifestyle guides, and self-improvement strategies for everyday life.";

export const CATEGORIES = [
  {
    slug: "nutrition",
    name: "Nutrition",
    description:
      "Evidence-based guides to healthy eating, meal planning, and understanding nutrients.",
    icon: "🥗",
  },
  {
    slug: "fitness",
    name: "Fitness",
    description:
      "Workout routines, exercise guides, and tips for building an active lifestyle.",
    icon: "💪",
  },
  {
    slug: "sleep",
    name: "Sleep",
    description:
      "Practical strategies for better sleep quality, routines, and rest.",
    icon: "😴",
  },
  {
    slug: "mental-wellness",
    name: "Mental Wellness",
    description:
      "Stress management, emotional well-being, and mental health awareness.",
    icon: "🧠",
  },
  {
    slug: "healthy-habits",
    name: "Healthy Habits",
    description:
      "Daily routines, habit-building techniques, and lifestyle improvements.",
    icon: "✅",
  },
  {
    slug: "natural-remedies",
    name: "Natural Remedies",
    description:
      "Traditional and natural approaches to everyday wellness concerns.",
    icon: "🌿",
  },
  {
    slug: "productivity",
    name: "Productivity",
    description:
      "Time management, focus techniques, and strategies for getting more done.",
    icon: "⚡",
  },
  {
    slug: "relationships",
    name: "Relationships",
    description:
      "Communication skills, healthy boundaries, and relationship well-being.",
    icon: "❤️",
  },
  {
    slug: "financial-wellness",
    name: "Financial Wellness",
    description:
      "Practical money management, budgeting, and reducing financial stress.",
    icon: "💰",
  },
  {
    slug: "mindfulness",
    name: "Mindfulness",
    description:
      "Meditation, breathing exercises, and present-moment awareness practices.",
    icon: "🧘",
  },
  {
    slug: "skin-and-beauty",
    name: "Skin & Beauty",
    description:
      "Skincare routines, natural beauty tips, and self-care practices.",
    icon: "✨",
  },
  {
    slug: "mens-and-womens-health",
    name: "Men's & Women's Health",
    description:
      "Gender-specific wellness topics, health awareness, and lifestyle guidance.",
    icon: "🩺",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
