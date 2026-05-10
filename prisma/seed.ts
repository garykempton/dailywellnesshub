import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { slug: "sleep", name: "Sleep", description: "Practical tips that may help improve your sleep quality, bedtime routines, and rest.", icon: "😴", sortOrder: 1 },
  { slug: "weight-loss", name: "Weight Loss", description: "Evidence-informed approaches to weight management, sustainable eating, and healthy body composition.", icon: "⚖️", sortOrder: 2 },
  { slug: "fitness", name: "Fitness", description: "Workout ideas, exercise guides, and tips for building a more active lifestyle.", icon: "💪", sortOrder: 3 },
  { slug: "nutrition", name: "Nutrition", description: "Guides to balanced eating, meal planning, and understanding nutrients — speak to a dietitian for personal advice.", icon: "🥗", sortOrder: 4 },
  { slug: "menopause", name: "Menopause", description: "Information and lifestyle tips that may support well-being during perimenopause and menopause.", icon: "🌸", sortOrder: 5 },
  { slug: "stress", name: "Stress", description: "Techniques and lifestyle changes that are associated with lower stress levels and better coping.", icon: "🧘", sortOrder: 6 },
  { slug: "healthy-ageing", name: "Healthy Ageing", description: "Lifestyle factors that research suggests may support vitality and well-being as you age.", icon: "🌿", sortOrder: 7 },
  { slug: "habits", name: "Habits", description: "Practical strategies for building positive daily routines and breaking unhelpful patterns.", icon: "✅", sortOrder: 8 },
  { slug: "family-wellness", name: "Family Wellness", description: "Tips for supporting the health and well-being of your whole family, from children to older adults.", icon: "👨‍👩‍👧‍👦", sortOrder: 9 },
  { slug: "mental-wellness", name: "Mental Wellness", description: "Self-care ideas and awareness resources that may support emotional well-being. This is not therapy — please speak to a qualified professional if you need support.", icon: "🧠", sortOrder: 10 },
  { slug: "productivity", name: "Productivity", description: "Time management, focus techniques, and strategies for getting more done without burning out.", icon: "⚡", sortOrder: 11 },
  { slug: "health-calculators", name: "Simple Health Calculators", description: "Free tools for BMI, hydration, sleep needs, and more. For guidance only — always consult a professional.", icon: "🧮", sortOrder: 12 },
];

// Old categories to remove (no longer used)
const OLD_SLUGS = [
  "healthy-habits",
  "natural-remedies",
  "relationships",
  "financial-wellness",
  "mindfulness",
  "skin-and-beauty",
  "mens-and-womens-health",
];

async function main() {
  console.log("Seeding categories...");

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // Remove old categories that no longer exist
  for (const slug of OLD_SLUGS) {
    await prisma.category.deleteMany({ where: { slug } });
  }

  console.log(`Seeded ${CATEGORIES.length} categories, removed ${OLD_SLUGS.length} old ones.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
