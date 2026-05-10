import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

// GET /api/admin/articles?status=DRAFT&category=nutrition
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status") || undefined;
  const category = req.nextUrl.searchParams.get("category") || undefined;

  const articles = await prisma.article.findMany({
    where: {
      ...(status && { status: status as "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED" }),
      ...(category && { categorySlug: category }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      categorySlug: true,
      status: true,
      aiGenerated: true,
      wordCount: true,
      createdAt: true,
      publishedAt: true,
    },
    take: 100,
  });

  return NextResponse.json({ articles });
}
