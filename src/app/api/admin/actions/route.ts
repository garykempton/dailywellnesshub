import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

// GET /api/admin/actions?entity=article&limit=50
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const entity = sp.get("entity") || undefined;
  const limit = Math.min(parseInt(sp.get("limit") || "50"), 200);

  const actions = await prisma.adminAction.findMany({
    where: { ...(entity && { entity }) },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ actions });
}

// POST /api/admin/actions — log an admin/agent action
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, entity, entityId, details, actor = "admin" } = await req.json();

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  const record = await prisma.adminAction.create({
    data: {
      action,
      entity: entity || null,
      entityId: entityId || null,
      details: details ? JSON.stringify(details) : null,
      actor,
    },
  });

  return NextResponse.json({ id: record.id });
}
