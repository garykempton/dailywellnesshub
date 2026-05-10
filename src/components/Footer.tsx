import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <p className="text-white font-bold text-lg mb-2">{SITE_NAME}</p>
            <p className="text-sm">
              Factual wellness guides and lifestyle tips for everyday life.
              Educational content only — this is not medical advice. Always
              speak to a qualified professional.
            </p>
          </div>

          {/* Topics */}
          <div>
            <p className="text-white font-semibold mb-3">Topics</p>
            <ul className="space-y-1 text-sm">
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

          <div>
            <p className="text-white font-semibold mb-3">More Topics</p>
            <ul className="space-y-1 text-sm">
              {CATEGORIES.slice(6).map((cat) => (
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

          {/* Legal */}
          <div>
            <p className="text-white font-semibold mb-3">Company</p>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/tools"
                  className="hover:text-white transition-colors"
                >
                  Free Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-6 text-sm text-stone-400 text-center">
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
