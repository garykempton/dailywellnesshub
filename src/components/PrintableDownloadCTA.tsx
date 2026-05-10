"use client";

interface Props {
  /** What the printable is, e.g. "Sleep Hygiene Checklist" */
  title: string;
  /** Brief description of what the download contains */
  description?: string;
  /** URL to the printable PDF. When set, renders a direct download link. */
  href?: string;
  /** When no href is provided, shows a "coming soon" state or newsletter signup prompt */
  comingSoon?: boolean;
  className?: string;
}

/**
 * CTA block for printable/downloadable resources.
 *
 * Three modes:
 * 1. href provided → direct download link
 * 2. comingSoon=true → "coming soon, subscribe to be notified"
 * 3. No href, no comingSoon → newsletter gate (future: email-for-download)
 */
export function PrintableDownloadCTA({
  title,
  description,
  href,
  comingSoon = false,
  className = "",
}: Props) {
  return (
    <aside
      className={`border-2 border-dashed border-primary/30 rounded-xl p-6 bg-green-50/50 text-center ${className}`}
      aria-label="Free download"
    >
      <div className="text-3xl mb-2" aria-hidden="true">
        📄
      </div>
      <h3 className="font-semibold text-lg mb-1">Free Download: {title}</h3>
      {description && (
        <p className="text-sm text-muted mb-4 max-w-md mx-auto">
          {description}
        </p>
      )}

      {href ? (
        <a
          href={href}
          download
          className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
        >
          Download PDF
        </a>
      ) : comingSoon ? (
        <p className="text-sm text-muted italic">
          This printable is coming soon. Subscribe to be notified when it is ready.
        </p>
      ) : (
        <p className="text-sm text-muted italic">
          This printable will be available soon as a free download.
        </p>
      )}

      <p className="text-xs text-muted mt-3">
        Free for personal use. Not for redistribution.
      </p>
    </aside>
  );
}
