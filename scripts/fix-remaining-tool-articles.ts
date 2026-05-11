/**
 * Fix the remaining 10 broken relatedArticles hrefs by finding best matches.
 */
import "dotenv/config";
import { prisma } from "../src/lib/db";
import * as fs from "fs";

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, categorySlug: true, title: true },
  });

  // Manual mappings based on topic relevance
  const fixes: Record<string, { title: string; href: string }[]> = {};

  // recovery-tracker: needs recovery/rest day articles
  const recoveryArticles = articles.filter(a =>
    a.slug.includes("recovery") || a.slug.includes("rest-day") || a.slug.includes("active-recovery")
  );
  console.log("Recovery candidates:", recoveryArticles.map(a => `/${a.categorySlug}/${a.slug}`));

  // running-pace-calculator: needs running articles
  const runningArticles = articles.filter(a =>
    a.slug.includes("running") || a.slug.includes("rucking") || a.slug.includes("walking-for")
  );
  console.log("Running candidates:", runningArticles.map(a => `/${a.categorySlug}/${a.slug}`));

  // vo2-max-calculator: needs cardio/fitness articles
  const vo2Articles = articles.filter(a =>
    a.slug.includes("cardio") || a.slug.includes("heart-rate") || a.slug.includes("exercise") && a.categorySlug === "fitness"
  );
  console.log("VO2 candidates:", vo2Articles.map(a => `/${a.categorySlug}/${a.slug}`));

  // cold-plunge-timer: needs cold/recovery articles
  const coldArticles = articles.filter(a =>
    a.slug.includes("cold") || a.slug.includes("immersion") || a.slug.includes("recovery")
  );
  console.log("Cold candidates:", coldArticles.map(a => `/${a.categorySlug}/${a.slug}`));

  // sauna-timer
  const saunaArticles = articles.filter(a =>
    a.slug.includes("sauna") || a.slug.includes("recovery") || a.slug.includes("inflammation")
  );
  console.log("Sauna candidates:", saunaArticles.map(a => `/${a.categorySlug}/${a.slug}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
