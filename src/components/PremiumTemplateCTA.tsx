interface Props {
  /** Template name, e.g. "30-Day Wellness Journal" */
  title: string;
  /** Brief value proposition */
  description?: string;
  /** Future: link to product/checkout page */
  href?: string;
  className?: string;
}

/**
 * CTA for future premium templates / digital products.
 *
 * Renders a teaser block that can later link to a checkout page,
 * Gumroad, Lemon Squeezy, or Stripe payment link.
 *
 * When no href is provided, shows a "coming soon" state.
 */
export function PremiumTemplateCTA({
  title,
  description,
  href,
  className = "",
}: Props) {
  return (
    <aside
      className={`relative overflow-hidden border border-accent/30 rounded-xl p-6 bg-amber-50/50 ${className}`}
      aria-label="Premium template"
    >
      <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
        Premium
      </div>

      <div className="text-3xl mb-2" aria-hidden="true">
        ✨
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted mb-4 max-w-md">
          {description}
        </p>
      )}

      {href ? (
        <a
          href={href}
          className="inline-block bg-accent text-white font-medium px-6 py-3 rounded-full hover:bg-amber-600 transition-colors"
        >
          Get Template
        </a>
      ) : (
        <p className="text-sm text-muted italic">
          Coming soon. Subscribe to be notified when premium templates launch.
        </p>
      )}
    </aside>
  );
}
