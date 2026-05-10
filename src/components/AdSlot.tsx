"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle" | "in-article";
  className?: string;
  /** Lazy-load: only initialise when the slot scrolls into view */
  lazy?: boolean;
}

/**
 * Universal ad placeholder for AdSense / Ezoic.
 *
 * When NEXT_PUBLIC_ADSENSE_CLIENT_ID is set, renders a real <ins> tag.
 * When NEXT_PUBLIC_EZOIC is set, renders an Ezoic placeholder div.
 * Otherwise renders nothing in production (invisible placeholder in dev).
 */
export function AdSlot({
  slot,
  format = "auto",
  className = "",
  lazy = true,
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const ezoic = process.env.NEXT_PUBLIC_EZOIC;

  // Push adsbygoogle once the element is visible
  useEffect(() => {
    if (!clientId || pushed.current || !ref.current) return;

    const push = () => {
      if (pushed.current) return;
      pushed.current = true;
      try {
        ((window as unknown as Record<string, unknown>).adsbygoogle as unknown[] || []).push({});
      } catch {
        // adsbygoogle not loaded yet — safe to ignore
      }
    };

    if (!lazy) {
      push();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          push();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [clientId, lazy]);

  // Ezoic mode
  if (ezoic) {
    return (
      <div
        id={`ezoic-pub-ad-placeholder-${slot}`}
        className={className}
        data-ad-slot={slot}
      />
    );
  }

  // AdSense mode
  if (clientId) {
    return (
      <div ref={ref} className={className} data-ad-slot={slot}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format === "in-article" ? "fluid" : format}
          data-ad-layout={format === "in-article" ? "in-article" : undefined}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Dev mode — invisible placeholder with data attribute for debugging
  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`ad-slot ${className}`} data-ad-slot={slot}>
        <span>Ad — {slot} ({format})</span>
      </div>
    );
  }

  // Production with no ad provider — render nothing
  return null;
}

/**
 * In-article ad that sits between content sections.
 * Optimised for readability — adds vertical spacing.
 */
export function InArticleAd({ slot }: { slot: string }) {
  return (
    <AdSlot
      slot={slot}
      format="in-article"
      className="my-8"
    />
  );
}
