"use client";

import { NewsletterForm } from "@/components/NewsletterForm";

interface Props {
  heading?: string;
  body?: string;
  className?: string;
}

export function NewsletterInlineBlock({
  heading = "Enjoying this article?",
  body = "Get more evidence-based wellness tips delivered to your inbox every week.",
  className = "",
}: Props) {
  return (
    <aside
      className={`relative overflow-hidden border border-primary/15 bg-gradient-to-r from-green-50/80 to-emerald-50/40 rounded-2xl p-6 md:p-8 text-center ${className}`}
      aria-label="Newsletter signup"
    >
      <h3 className="font-bold text-lg mb-1.5">{heading}</h3>
      <p className="text-sm text-muted mb-5 leading-relaxed">{body}</p>
      <div className="max-w-sm mx-auto">
        <NewsletterForm variant="inline" />
      </div>
      <p className="text-xs text-muted mt-3">
        Free. No spam. Unsubscribe anytime.
      </p>
    </aside>
  );
}
