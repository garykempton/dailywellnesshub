import { prisma } from "@/lib/db";
import Link from "next/link";

function StatCard({
  label,
  value,
  sub,
  href,
  alert,
}: {
  label: string;
  value: number;
  sub?: string;
  href?: string;
  alert?: boolean;
}) {
  const card = (
    <div
      className={`bg-white rounded-xl border p-5 ${
        alert ? "border-red-300 bg-red-50" : "border-stone-200"
      }`}
    >
      <p className="text-sm text-stone-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${alert ? "text-red-600" : ""}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );

  return href ? (
    <Link href={href} className="block hover:shadow-md transition-shadow rounded-xl">
      {card}
    </Link>
  ) : (
    card
  );
}

export default async function AdminDashboardPage() {
  let data: Record<string, number> = {};

  try {
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
      noKeywords,
      shortContent,
      affiliateNone,
      subscribers,
      contactUnread,
      openAudits,
      criticalAudits,
      pendingJobs,
      failedJobs,
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
      prisma.article.count({ where: { keywords: { isEmpty: true } } }),
      prisma.article.count({ where: { wordCount: { lt: 300 }, status: { not: "ARCHIVED" } } }),
      prisma.article.count({ where: { affiliateStatus: "NONE" } }),
      prisma.subscriber.count({ where: { confirmed: true } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.siteAudit.count({ where: { resolved: false } }),
      prisma.siteAudit.count({ where: { resolved: false, severity: "CRITICAL" } }),
      prisma.contentJob.count({ where: { status: "PENDING" } }),
      prisma.contentJob.count({ where: { status: "FAILED" } }),
    ]);

    data = {
      totalArticles, published, drafts, inReview,
      healthSensitive, unreviewedSensitive, uncheckedFacts,
      noMetaTitle, noMetaDesc, noExcerpt, noCoverImage, noFaq, noKeywords, shortContent,
      affiliateNone, subscribers, contactUnread, openAudits, criticalAudits,
      pendingJobs, failedJobs,
    };
  } catch {
    // DB not connected
  }

  const d = data;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Content status */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Content Pipeline
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard label="Total Articles" value={d.totalArticles || 0} />
          <StatCard label="Published" value={d.published || 0} sub="Live on site" />
          <StatCard label="Drafts" value={d.drafts || 0} href="/admin/articles?status=DRAFT" />
          <StatCard label="In Review" value={d.inReview || 0} href="/admin/articles?status=IN_REVIEW" />
          <StatCard label="Pending Jobs" value={d.pendingJobs || 0} />
          <StatCard
            label="Failed Jobs"
            value={d.failedJobs || 0}
            alert={(d.failedJobs || 0) > 0}
          />
        </div>
      </section>

      {/* Review & safety */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Review & Safety
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Health-Sensitive"
            value={d.healthSensitive || 0}
            sub="Require review"
          />
          <StatCard
            label="Unreviewed Sensitive"
            value={d.unreviewedSensitive || 0}
            alert={(d.unreviewedSensitive || 0) > 0}
            href="/admin/articles?healthSensitive=true&reviewStatus=UNREVIEWED"
          />
          <StatCard
            label="Unchecked Facts"
            value={d.uncheckedFacts || 0}
            alert={(d.uncheckedFacts || 0) > 10}
          />
          <StatCard
            label="Short Content (<300w)"
            value={d.shortContent || 0}
            alert={(d.shortContent || 0) > 0}
          />
        </div>
      </section>

      {/* SEO gaps */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          SEO & Metadata Gaps
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard label="No Meta Title" value={d.noMetaTitle || 0} alert={(d.noMetaTitle || 0) > 0} />
          <StatCard label="No Meta Desc" value={d.noMetaDesc || 0} alert={(d.noMetaDesc || 0) > 0} />
          <StatCard label="No Excerpt" value={d.noExcerpt || 0} />
          <StatCard label="No Cover Image" value={d.noCoverImage || 0} />
          <StatCard label="No FAQ" value={d.noFaq || 0} />
          <StatCard label="No Keywords" value={d.noKeywords || 0} />
          <StatCard
            label="Open Audits"
            value={d.openAudits || 0}
            sub={`${d.criticalAudits || 0} critical`}
            href="/admin/audits"
            alert={(d.criticalAudits || 0) > 0}
          />
        </div>
      </section>

      {/* Monetisation & growth */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Monetisation & Growth
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="No Affiliate Links"
            value={d.affiliateNone || 0}
            sub="Potential opportunities"
          />
          <StatCard label="Subscribers" value={d.subscribers || 0} />
          <StatCard
            label="Unread Messages"
            value={d.contactUnread || 0}
            alert={(d.contactUnread || 0) > 5}
          />
        </div>
      </section>
    </>
  );
}
