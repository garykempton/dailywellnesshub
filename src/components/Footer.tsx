import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import { TOOL_CATEGORIES } from "@/lib/tools";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                W
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                Daily<span className="text-green-400">Wellness</span>Hub
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Factual wellness guides and lifestyle tips for everyday life.
              Educational content only — not medical advice. Always
              speak to a qualified professional.
            </p>
          </div>

          {/* Topics */}
          <div className="md:col-span-2">
            <p className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Topics</p>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Free Tools</p>
            <ul className="space-y-2.5 text-sm">
              {TOOL_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tools/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  View All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <p className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  Free Tools
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-6 text-sm text-stone-500 text-center">
          <p>
            &copy; {year} {SITE_NAME}. All rights reserved. Content is for
            informational purposes only and is not a substitute for professional
            medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
