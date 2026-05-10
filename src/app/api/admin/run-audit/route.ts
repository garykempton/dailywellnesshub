import { NextRequest, NextResponse } from "next/server";
import type { AuditType, AuditSeverity } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

/**
 * POST /api/admin/run-audit
 *
 * Scans all non-archived articles for common issues and creates
 * SiteAudit records. Clears previously unresolved auto-generated
 * audits before re-scanning.
 *
 * Auth: x-api-key header (for admin or AI agent use)
 */
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Clear old auto-generated unresolved audits
  await prisma.siteAudit.deleteMany({
    where: { resolved: false, resolvedBy: null },
  });

  const articles = await prisma.article.findMany({
    where: { status: { not: "ARCHIVED" } },
    select: {
      id: true,
      slug: true,
      title: true,
      metaTitle: true,
      metaDesc: true,
      excerpt: true,
      coverImage: true,
      faqSection: true,
      sources: true,
      keywords: true,
      wordCount: true,
      status: true,
      healthSensitive: true,
      reviewStatus: true,
      factCheckStatus: true,
      affiliateStatus: true,
      affiliateLinks: true,
      relatedArticles: true,
      publishedAt: true,
      reviewedAt: true,
    },
  });

  type AuditEntry = {
    articleId: string;
    slug: string;
    type: AuditType;
    severity: AuditSeverity;
    message: string;
  };

  const issues: AuditEntry[] = [];

  for (const a of articles) {
    const add = (type: AuditType, severity: AuditSeverity, message: string) =>
      issues.push({ articleId: a.id, slug: a.slug, type, severity, message });

    // Missing metadata
    if (!a.metaTitle) add("MISSING_META_TITLE", "WARNING", `"${a.title}" has no meta title`);
    if (!a.metaDesc) add("MISSING_META_DESC", "WARNING", `"${a.title}" has no meta description`);
    if (!a.excerpt) add("MISSING_EXCERPT", "INFO", `"${a.title}" has no excerpt`);
    if (!a.coverImage) add("MISSING_COVER_IMAGE", "INFO", `"${a.title}" has no cover image`);
    if (!a.faqSection) add("MISSING_FAQ", "INFO", `"${a.title}" has no FAQ section`);
    if (!a.keywords || a.keywords.length === 0) add("MISSING_KEYWORDS", "WARNING", `"${a.title}" has no target keywords`);

    // Published articles missing sources
    if (a.status === "PUBLISHED" && !a.sources) {
      add("MISSING_SOURCES", "WARNING", `Published article "${a.title}" has no sources`);
    }

    // Short content (placeholder or thin)
    if (a.wordCount < 300 && a.status !== "DRAFT") {
      add("SHORT_CONTENT", "CRITICAL", `"${a.title}" has only ${a.wordCount} words`);
    }

    // Health-sensitive without review
    if (a.healthSensitive && a.status === "PUBLISHED" && a.reviewStatus !== "APPROVED") {
      add("REVIEW_OVERDUE", "CRITICAL", `Health-sensitive published article "${a.title}" is not approved`);
    }

    // Orphan page — no related articles
    if ((!a.relatedArticles || a.relatedArticles.length === 0) && a.status === "PUBLISHED") {
      add("ORPHAN_PAGE", "INFO", `"${a.title}" has no related articles linked`);
    }

    // Affiliate opportunity — published article with no affiliate assessment
    if (a.status === "PUBLISHED" && a.affiliateStatus === "NONE") {
      add("AFFILIATE_OPPORTUNITY", "INFO", `"${a.title}" has not been assessed for affiliate opportunities`);
    }
  }

  if (issues.length > 0) {
    await prisma.siteAudit.createMany({ data: issues });
  }

  // Log the action
  await prisma.adminAction.create({
    data: {
      action: "audit",
      entity: "site",
      details: JSON.stringify({
        articlesScanned: articles.length,
        issuesFound: issues.length,
      }),
      actor: "system",
    },
  });

  return NextResponse.json({
    scanned: articles.length,
    issues: issues.length,
    breakdown: {
      critical: issues.filter((i) => i.severity === "CRITICAL").length,
      warning: issues.filter((i) => i.severity === "WARNING").length,
      info: issues.filter((i) => i.severity === "INFO").length,
    },
  });
}
