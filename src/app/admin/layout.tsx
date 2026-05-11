import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/audits", label: "Audits" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-green-400">
              DWH Admin
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-stone-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-stone-400 hover:text-white transition-colors"
            >
              View Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="text-stone-400 hover:text-white transition-colors"
      >
        Logout
      </button>
    </form>
  );
}
