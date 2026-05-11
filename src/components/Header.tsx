"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { TOOL_CATEGORIES } from "@/lib/tools";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-border/60 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            W
          </span>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Daily<span className="text-primary">Wellness</span>Hub
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          <div className="relative group">
            <button className="px-3 py-2 rounded-lg hover:bg-stone-50 text-muted hover:text-foreground transition-colors font-medium">
              Topics
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white border border-border/60 rounded-2xl shadow-xl shadow-black/5 p-3 grid grid-cols-2 gap-1 w-[440px]">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-green-50/60 text-sm transition-colors group/item"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-medium text-stone-700 group-hover/item:text-primary transition-colors">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="px-3 py-2 rounded-lg hover:bg-stone-50 text-muted hover:text-foreground transition-colors font-medium">
              Tools
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white border border-border/60 rounded-2xl shadow-xl shadow-black/5 p-3 grid grid-cols-2 gap-1 w-[440px]">
                {TOOL_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-green-50/60 text-sm transition-colors group/item"
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="font-medium text-stone-700 group-hover/item:text-primary transition-colors">{cat.name}</span>
                  </Link>
                ))}
                <Link
                  href="/tools"
                  className="col-span-2 text-center text-sm font-medium text-primary hover:text-primary-dark pt-2 mt-1 border-t border-border/60 transition-colors"
                >
                  View All Tools
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className="px-3 py-2 rounded-lg hover:bg-stone-50 text-muted hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg hover:bg-stone-50 text-muted hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <div className="w-px h-5 bg-border/60 mx-1" />
          <Link
            href="/newsletter"
            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition-all hover:shadow-md hover:shadow-green-500/20"
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-stone-50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5 text-stone-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-white px-4 pb-5">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest pt-4 pb-2">Topics</p>
          <div className="grid grid-cols-2 gap-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-green-50/60 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span className="font-medium text-stone-700">{cat.name}</span>
              </Link>
            ))}
          </div>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest pt-4 pb-2 border-t border-border/40 mt-3">Tools</p>
          <div className="grid grid-cols-2 gap-1">
            {TOOL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tools/${cat.slug}`}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-green-50/60 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span>{cat.emoji}</span>
                <span className="font-medium text-stone-700">{cat.shortName}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1 pt-3 mt-3 border-t border-border/40">
            <Link href="/tools" className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-primary" onClick={() => setMenuOpen(false)}>
              View All Tools
            </Link>
            <Link href="/about" className="px-3 py-2 text-sm text-stone-700 hover:text-primary" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="px-3 py-2 text-sm text-stone-700 hover:text-primary" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link
              href="/newsletter"
              className="bg-primary text-white px-4 py-2.5 rounded-full text-sm font-semibold text-center mt-2 hover:bg-primary-dark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Subscribe Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
