import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
  const total = await prisma.article.count();
  console.log("Total articles:", total);

  if (total === 0) {
    console.log("No articles in database.");
    return;
  }

  const byStatus = await prisma.article.groupBy({
    by: ["status"],
    _count: true,
  });
  console.log("\nBy status:");
  for (const s of byStatus) {
    console.log(`  ${s.status}: ${s._count}`);
  }

  const byCategory = await prisma.article.groupBy({
    by: ["categorySlug"],
    _count: true,
    orderBy: { _count: { categorySlug: "desc" } },
  });
  console.log("\nBy category:");
  for (const c of byCategory) {
    console.log(`  ${c.categorySlug}: ${c._count}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
