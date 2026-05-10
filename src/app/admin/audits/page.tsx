import { prisma } from "@/lib/db";

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  WARNING: "bg-amber-100 text-amber-700 border-amber-200",
  INFO: "bg-blue-100 text-blue-700 border-blue-200",
};

export default async function AdminAuditsPage() {
  let audits: {
    id: string;
    type: string;
    severity: string;
    message: string;
    slug: string | null;
    articleId: string | null;
    resolved: boolean;
    createdAt: Date;
  }[] = [];

  let openCount = 0;
  let criticalCount = 0;

  try {
    audits = await prisma.siteAudit.findMany({
      where: { resolved: false },
      orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        type: true,
        severity: true,
        message: true,
        slug: true,
        articleId: true,
        resolved: true,
        createdAt: true,
      },
      take: 200,
    });
    openCount = audits.length;
    criticalCount = audits.filter((a) => a.severity === "CRITICAL").length;
  } catch {
    // DB not connected
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Site Audits</h1>
          <p className="text-sm text-stone-500 mt-1">
            {openCount} open issue{openCount !== 1 ? "s" : ""}
            {criticalCount > 0 && (
              <span className="text-red-600 font-medium ml-2">
                ({criticalCount} critical)
              </span>
            )}
          </p>
        </div>
      </div>

      {audits.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">&#10003;</div>
          <p className="text-lg font-medium text-stone-600">No open audit issues</p>
          <p className="text-sm text-stone-400 mt-1">
            Run an audit via the API or wait for the next automated scan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {audits.map((audit) => (
            <div
              key={audit.id}
              className={`bg-white border rounded-xl p-4 flex items-start gap-4 ${
                audit.severity === "CRITICAL" ? "border-red-200" : "border-stone-200"
              }`}
            >
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${
                  SEVERITY_COLORS[audit.severity] || ""
                }`}
              >
                {audit.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{audit.message}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                  <span className="font-mono">{audit.type}</span>
                  {audit.slug && <span>slug: {audit.slug}</span>}
                  <span>
                    {audit.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
