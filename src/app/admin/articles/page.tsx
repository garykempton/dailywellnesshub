import { prisma } from "@/lib/db";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-stone-100 text-stone-600",
  IN_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  PUBLISHED: "bg-green-600 text-white",
  ARCHIVED: "bg-stone-200 text-stone-500",
};

const REVIEW_COLORS: Record<string, string> = {
  UNREVIEWED: "text-stone-400",
  PENDING_REVIEW: "text-blue-600",
  CHANGES_REQUESTED: "text-amber-600",
  APPROVED: "text-green-600",
  REJECTED: "text-red-600",
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminArticlesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const statusFilter = sp.status || undefined;
  const categoryFilter = sp.category || undefined;
  const healthFilter = sp.healthSensitive;
  const reviewFilter = sp.reviewStatus || undefined;

  let articles: {
    id: string;
    slug: string;
    title: string;
    categorySlug: string;
    status: string;
    healthSensitive: boolean;
    reviewStatus: string;
    factCheckStatus: string;
    affiliateStatus: string;
    wordCount: number;
    metaTitle: string | null;
    metaDesc: string | null;
    faqSection: string | null;
    coverImage: string | null;
    keywords: string[];
    createdAt: Date;
    publishedAt: Date | null;
  }[] = [];

  try {
    articles = await prisma.article.findMany({
      where: {
        ...(statusFilter && { status: statusFilter as "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED" }),
        ...(categoryFilter && { categorySlug: categoryFilter }),
        ...(healthFilter !== undefined && { healthSensitive: healthFilter === "true" }),
        ...(reviewFilter && { reviewStatus: reviewFilter as "UNREVIEWED" | "PENDING_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED" }),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        categorySlug: true,
        status: true,
        healthSensitive: true,
        reviewStatus: true,
        factCheckStatus: true,
        affiliateStatus: true,
        wordCount: true,
        metaTitle: true,
        metaDesc: true,
        faqSection: true,
        coverImage: true,
        keywords: true,
        createdAt: true,
        publishedAt: true,
      },
      take: 200,
    });
  } catch {
    // DB not connected
  }

  function metaScore(a: typeof articles[number]): number {
    let score = 0;
    if (a.metaTitle) score++;
    if (a.metaDesc) score++;
    if (a.faqSection) score++;
    if (a.coverImage) score++;
    if (a.keywords.length > 0) score++;
    return score;
  }

  const activeFilters = [statusFilter, categoryFilter, healthFilter, reviewFilter].filter(Boolean);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles ({articles.length})</h1>
        {activeFilters.length > 0 && (
          <Link href="/admin/articles" className="text-sm text-primary hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"].map((s) => (
          <Link
            key={s}
            href={`/admin/articles?status=${s}`}
            className={`px-3 py-1 rounded-full border ${
              statusFilter === s ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 hover:border-stone-500"
            }`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
        <span className="border-l border-stone-300 mx-1" />
        <Link
          href="/admin/articles?healthSensitive=true"
          className={`px-3 py-1 rounded-full border ${
            healthFilter === "true" ? "bg-red-600 text-white border-red-600" : "border-stone-300 hover:border-stone-500"
          }`}
        >
          Health-Sensitive
        </Link>
        <Link
          href="/admin/articles?reviewStatus=UNREVIEWED"
          className={`px-3 py-1 rounded-full border ${
            reviewFilter === "UNREVIEWED" ? "bg-amber-600 text-white border-amber-600" : "border-stone-300 hover:border-stone-500"
          }`}
        >
          Unreviewed
        </Link>
      </div>

      {/* Articles table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Review</th>
                <th className="px-4 py-3">Words</th>
                <th className="px-4 py-3">SEO</th>
                <th className="px-4 py-3">Affiliate</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {articles.map((a) => {
                const seo = metaScore(a);
                return (
                  <tr key={a.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium truncate" title={a.title}>
                        {a.title}
                      </div>
                      <div className="text-xs text-stone-400 truncate">
                        {a.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs">{a.categorySlug}</span>
                      {a.healthSensitive && (
                        <span className="ml-1 text-red-500" title="Health-sensitive">
                          !
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          STATUS_COLORS[a.status] || ""
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-medium ${REVIEW_COLORS[a.reviewStatus] || ""}`}>
                        {a.reviewStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      <span className={a.wordCount < 300 ? "text-red-500 font-medium" : ""}>
                        {a.wordCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < seo ? "bg-green-500" : "bg-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {a.affiliateStatus === "NONE" ? (
                        <span className="text-stone-300">--</span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          {a.affiliateStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-stone-400">
                      {a.publishedAt
                        ? a.publishedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                        : a.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
