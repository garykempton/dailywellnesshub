import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

// GET /api/admin/traffic-notes?articleId=xxx
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articleId = req.nextUrl.searchParams.get("articleId") || undefined;

  const notes = await prisma.trafficNote.findMany({
    where: { ...(articleId && { articleId }) },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ notes });
}

// POST /api/admin/traffic-notes — add traffic notes (manual or AI agent)
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const items = Array.isArray(body) ? body : [body];

  const created = await prisma.trafficNote.createMany({
    data: items.map((item: Record<string, unknown>) => ({
      articleId: (item.articleId as string) || null,
      slug: (item.slug as string) || null,
      note: item.note as string,
      source: (item.source as string) || "manual",
      metric: (item.metric as string) || null,
      value: (item.value as string) || null,
      createdBy: (item.createdBy as string) || "admin",
    })),
  });

  return NextResponse.json({ created: created.count });
}
