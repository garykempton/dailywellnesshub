"use client";

import { NewsletterForm } from "@/components/NewsletterForm";

interface Props {
  /** Contextual heading, e.g. "Want more sleep tips?" */
  heading?: string;
  /** Short body text */
  body?: string;
  className?: string;
}

/**
 * In-article newsletter signup block.
 *
 * Designed to sit between article sections (after the 2nd or 3rd H2)
 * to capture readers mid-engagement. More contextual than the
 * bottom-of-page NewsletterForm.
 */
export function NewsletterInlineBlock({
  heading = "Enjoying this article?",
  body = "Get more evidence-based wellness tips delivered to your inbox every week.",
  className = "",
}: Props) {
  return (
    <aside
      className={`border border-primary/20 bg-primary/5 rounded-xl p-6 text-center ${className}`}
      aria-label="Newsletter signup"
    >
      <h3 className="font-semibold text-lg mb-1">{heading}</h3>
      <p className="text-sm text-muted mb-4">{body}</p>
      <div className="max-w-sm mx-auto">
        <NewsletterForm variant="inline" />
      </div>
      <p className="text-xs text-muted mt-2">
        Free. No spam. Unsubscribe anytime.
      </p>
    </aside>
  );
}
