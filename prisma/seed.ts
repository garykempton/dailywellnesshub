import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// healthSensitive: true → articles in this category require review before publishing
const CATEGORIES = [
  { slug: "sleep", name: "Sleep", description: "Practical tips that may help improve your sleep quality, bedtime routines, and rest.", icon: "😴", sortOrder: 1, healthSensitive: false },
  { slug: "weight-loss", name: "Weight Loss", description: "Evidence-informed approaches to weight management, sustainable eating, and healthy body composition.", icon: "⚖️", sortOrder: 2, healthSensitive: true },
  { slug: "fitness", name: "Fitness", description: "Workout ideas, exercise guides, and tips for building a more active lifestyle.", icon: "💪", sortOrder: 3, healthSensitive: false },
  { slug: "nutrition", name: "Nutrition", description: "Guides to balanced eating, meal planning, and understanding nutrients — speak to a dietitian for personal advice.", icon: "🥗", sortOrder: 4, healthSensitive: true },
  { slug: "menopause", name: "Menopause", description: "Information and lifestyle tips that may support well-being during perimenopause and menopause.", icon: "🌸", sortOrder: 5, healthSensitive: true },
  { slug: "stress", name: "Stress", description: "Techniques and lifestyle changes that are associated with lower stress levels and better coping.", icon: "🧘", sortOrder: 6, healthSensitive: false },
  { slug: "healthy-ageing", name: "Healthy Ageing", description: "Lifestyle factors that research suggests may support vitality and well-being as you age.", icon: "🌿", sortOrder: 7, healthSensitive: true },
  { slug: "habits", name: "Habits", description: "Practical strategies for building positive daily routines and breaking unhelpful patterns.", icon: "✅", sortOrder: 8, healthSensitive: false },
  { slug: "family-wellness", name: "Family Wellness", description: "Tips for supporting the health and well-being of your whole family, from children to older adults.", icon: "👨‍👩‍👧‍👦", sortOrder: 9, healthSensitive: true },
  { slug: "mental-wellness", name: "Mental Wellness", description: "Self-care ideas and awareness resources that may support emotional well-being. This is not therapy — please speak to a qualified professional if you need support.", icon: "🧠", sortOrder: 10, healthSensitive: true },
  { slug: "productivity", name: "Productivity", description: "Time management, focus techniques, and strategies for getting more done without burning out.", icon: "⚡", sortOrder: 11, healthSensitive: false },
  { slug: "health-calculators", name: "Simple Health Calculators", description: "Free tools for BMI, hydration, sleep needs, and more. For guidance only — always consult a professional.", icon: "🧮", sortOrder: 12, healthSensitive: false },
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

  console.log(`Seeded ${CATEGORIES.length} categories.`);
  console.log("Health-sensitive:", CATEGORIES.filter(c => c.healthSensitive).map(c => c.name).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
