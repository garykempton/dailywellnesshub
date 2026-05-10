import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

interface Ctx {
  params: Promise<{ id: string }>;
}

// GET single article
export async function GET(req: NextRequest, { params }: Ctx) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ article });
}

// PATCH — update article fields (including status transitions)
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowedFields = [
    "title",
    "metaTitle",
    "metaDesc",
    "excerpt",
    "body",
    "coverImage",
    "coverAlt",
    "author",
    "authorBio",
    "status",
    "reviewedBy",
    "featured",
    "affiliateNote",
    "sources",
  ];

  const data: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) data[key] = body[key];
  }

  // Auto-set timestamps on status transitions
  if (data.status === "APPROVED" || data.status === "IN_REVIEW") {
    data.reviewedAt = new Date();
  }
  if (data.status === "PUBLISHED") {
    data.publishedAt = new Date();
  }

  // Recalculate word count if body changed
  if (data.body && typeof data.body === "string") {
    const wordCount = data.body.replace(/<[^>]+>/g, "").split(/\s+/).length;
    data.wordCount = wordCount;
    data.readTime = Math.max(1, Math.ceil(wordCount / 250));
  }

  const article = await prisma.article.update({
    where: { id },
    data,
  });

  return NextResponse.json({ article });
}

// DELETE
export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.article.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
