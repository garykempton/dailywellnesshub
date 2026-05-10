import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Run all queries in parallel
  const [
    totalArticles,
    published,
    drafts,
    inReview,
    healthSensitive,
    unreviewedSensitive,
    uncheckedFacts,
    noMetaTitle,
    noMetaDesc,
    noExcerpt,
    noCoverImage,
    noFaq,
    noSources,
    noKeywords,
    shortContent,
    affiliateNone,
    affiliateHasLinks,
    subscribers,
    contactUnread,
    pendingJobs,
    failedJobs,
    openAudits,
    criticalAudits,
    categoryBreakdown,
    recentActions,
    recentNotes,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "IN_REVIEW" } }),
    prisma.article.count({ where: { healthSensitive: true } }),
    prisma.article.count({ where: { healthSensitive: true, reviewStatus: "UNREVIEWED" } }),
    prisma.article.count({ where: { factCheckStatus: "UNCHECKED", status: { not: "ARCHIVED" } } }),
    prisma.article.count({ where: { metaTitle: null } }),
    prisma.article.count({ where: { metaDesc: null } }),
    prisma.article.count({ where: { excerpt: null } }),
    prisma.article.count({ where: { coverImage: null } }),
    prisma.article.count({ where: { faqSection: null } }),
    prisma.article.count({ where: { sources: null, status: "PUBLISHED" } }),
    prisma.article.count({ where: { keywords: { isEmpty: true } } }),
    prisma.article.count({ where: { wordCount: { lt: 300 }, status: { not: "ARCHIVED" } } }),
    prisma.article.count({ where: { affiliateStatus: "NONE" } }),
    prisma.article.count({ where: { affiliateStatus: "HAS_LINKS" } }),
    prisma.subscriber.count({ where: { confirmed: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contentJob.count({ where: { status: "PENDING" } }),
    prisma.contentJob.count({ where: { status: "FAILED" } }),
    prisma.siteAudit.count({ where: { resolved: false } }),
    prisma.siteAudit.count({ where: { resolved: false, severity: "CRITICAL" } }),
    prisma.article.groupBy({
      by: ["categorySlug"],
      _count: true,
      orderBy: { categorySlug: "asc" },
    }),
    prisma.adminAction.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.trafficNote.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // Status breakdown
  const statusBreakdown = await prisma.article.groupBy({
    by: ["status"],
    _count: true,
  });

  // Review status breakdown
  const reviewBreakdown = await prisma.article.groupBy({
    by: ["reviewStatus"],
    _count: true,
  });

  return NextResponse.json({
    overview: {
      totalArticles,
      published,
      drafts,
      inReview,
      subscribers,
      contactUnread,
    },
    content: {
      healthSensitive,
      unreviewedSensitive,
      uncheckedFacts,
      pendingJobs,
      failedJobs,
      statusBreakdown: Object.fromEntries(statusBreakdown.map((s) => [s.status, s._count])),
      reviewBreakdown: Object.fromEntries(reviewBreakdown.map((s) => [s.reviewStatus, s._count])),
      categoryBreakdown: Object.fromEntries(categoryBreakdown.map((c) => [c.categorySlug, c._count])),
    },
    seo: {
      noMetaTitle,
      noMetaDesc,
      noExcerpt,
      noCoverImage,
      noFaq,
      noSources,
      noKeywords,
      shortContent,
    },
    monetisation: {
      affiliateNone,
      affiliateHasLinks,
    },
    audits: {
      open: openAudits,
      critical: criticalAudits,
    },
    recentActions,
    recentNotes,
  });
}
