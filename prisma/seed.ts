import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { slug: "nutrition", name: "Nutrition", description: "Evidence-based guides to healthy eating, meal planning, and understanding nutrients.", icon: "🥗", sortOrder: 1 },
  { slug: "fitness", name: "Fitness", description: "Workout routines, exercise guides, and tips for building an active lifestyle.", icon: "💪", sortOrder: 2 },
  { slug: "sleep", name: "Sleep", description: "Practical strategies for better sleep quality, routines, and rest.", icon: "😴", sortOrder: 3 },
  { slug: "mental-wellness", name: "Mental Wellness", description: "Stress management, emotional well-being, and mental health awareness.", icon: "🧠", sortOrder: 4 },
  { slug: "healthy-habits", name: "Healthy Habits", description: "Daily routines, habit-building techniques, and lifestyle improvements.", icon: "✅", sortOrder: 5 },
  { slug: "natural-remedies", name: "Natural Remedies", description: "Traditional and natural approaches to everyday wellness concerns.", icon: "🌿", sortOrder: 6 },
  { slug: "productivity", name: "Productivity", description: "Time management, focus techniques, and strategies for getting more done.", icon: "⚡", sortOrder: 7 },
  { slug: "relationships", name: "Relationships", description: "Communication skills, healthy boundaries, and relationship well-being.", icon: "❤️", sortOrder: 8 },
  { slug: "financial-wellness", name: "Financial Wellness", description: "Practical money management, budgeting, and reducing financial stress.", icon: "💰", sortOrder: 9 },
  { slug: "mindfulness", name: "Mindfulness", description: "Meditation, breathing exercises, and present-moment awareness practices.", icon: "🧘", sortOrder: 10 },
  { slug: "skin-and-beauty", name: "Skin & Beauty", description: "Skincare routines, natural beauty tips, and self-care practices.", icon: "✨", sortOrder: 11 },
  { slug: "mens-and-womens-health", name: "Men's & Women's Health", description: "Gender-specific wellness topics, health awareness, and lifestyle guidance.", icon: "🩺", sortOrder: 12 },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
