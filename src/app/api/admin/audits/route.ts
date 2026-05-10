import { NextRequest, NextResponse } from "next/server";
import type { AuditType, AuditSeverity } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

// GET /api/admin/audits?resolved=false&severity=CRITICAL&type=MISSING_META_TITLE
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const resolved = sp.get("resolved");
  const severity = sp.get("severity");
  const type = sp.get("type");

  const audits = await prisma.siteAudit.findMany({
    where: {
      ...(resolved !== null && resolved !== undefined && { resolved: resolved === "true" }),
      ...(severity && { severity: severity as "CRITICAL" | "WARNING" | "INFO" }),
      ...(type && { type: type as AuditType }),
    },
    orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return NextResponse.json({ audits });
}

// POST /api/admin/audits — create audit entries (used by AI agents and cron)
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Support single or batch creation
  const items = Array.isArray(body) ? body : [body];

  const created = await prisma.siteAudit.createMany({
    data: items.map((item: Record<string, unknown>) => ({
      articleId: (item.articleId as string) || null,
      slug: (item.slug as string) || null,
      type: item.type as AuditType,
      severity: ((item.severity as string) || "INFO") as AuditSeverity,
      message: item.message as string,
      details: item.details ? JSON.stringify(item.details) : null,
    })),
  });

  return NextResponse.json({ created: created.count });
}

// PATCH /api/admin/audits — resolve audits by IDs
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, resolved = true, resolvedBy = "admin" } = await req.json();

  if (!Array.isArray(ids) || !ids.length) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  const result = await prisma.siteAudit.updateMany({
    where: { id: { in: ids } },
    data: {
      resolved,
      resolvedAt: resolved ? new Date() : null,
      resolvedBy: resolved ? resolvedBy : null,
    },
  });

  return NextResponse.json({ updated: result.count });
}
