import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

// GET /api/admin/articles?status=DRAFT&category=nutrition&healthSensitive=true&reviewStatus=UNREVIEWED&factCheckStatus=UNCHECKED
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") || undefined;
  const category = sp.get("category") || undefined;
  const healthSensitive = sp.get("healthSensitive");
  const reviewStatus = sp.get("reviewStatus") || undefined;
  const factCheckStatus = sp.get("factCheckStatus") || undefined;

  const articles = await prisma.article.findMany({
    where: {
      ...(status && { status: status as "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED" }),
      ...(category && { categorySlug: category }),
      ...(healthSensitive !== null && healthSensitive !== undefined && { healthSensitive: healthSensitive === "true" }),
      ...(reviewStatus && { reviewStatus: reviewStatus as "UNREVIEWED" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED" }),
      ...(factCheckStatus && { factCheckStatus: factCheckStatus as "UNCHECKED" | "PENDING" | "VERIFIED" | "DISPUTED" | "NOT_APPLICABLE" }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      categorySlug: true,
      status: true,
      healthSensitive: true,
      factCheckStatus: true,
      reviewStatus: true,
      affiliateStatus: true,
      aiGenerated: true,
      wordCount: true,
      createdAt: true,
      publishedAt: true,
    },
    take: 100,
  });

  return NextResponse.json({ articles });
}
