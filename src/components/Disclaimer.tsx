export function SiteDisclaimer() {
  return (
    <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-5 text-sm text-amber-800">
      <p className="font-bold mb-1.5">Wellness Disclaimer</p>
      <p className="leading-relaxed">
        The content on DailyWellnessHub is for informational and educational
        purposes only. It is not intended as medical advice, diagnosis, or
        treatment. Information here may help inform your decisions, but it is
        not a substitute for professional guidance. Always speak to a qualified
        healthcare provider before making changes to your diet, exercise, or
        wellness routine.
      </p>
    </div>
  );
}

export function ArticleDisclaimer() {
  return (
    <aside
      className="bg-stone-50 border border-border/60 rounded-2xl p-5 text-xs text-muted mt-10"
      role="note"
      aria-label="Content disclaimer"
    >
      <p className="font-semibold text-stone-600 mb-1.5">Important Notice</p>
      <p className="leading-relaxed">
        This article is for general informational purposes only and does not
        constitute professional medical advice. The information provided is
        based on general wellness research and should not be used as a
        substitute for consultation with a licensed healthcare provider.
        Individual results may vary. Always seek the advice of your physician
        or other qualified health provider with any questions you may have
        regarding a medical condition. This is not medical advice.
      </p>
    </aside>
  );
}

export function AffiliateDisclosure() {
  return (
    <p className="text-xs text-stone-400 italic mt-5 leading-relaxed">
      Some links in this article may be affiliate links. If you make a purchase
      through these links, we may earn a small commission at no extra cost to
      you. This helps support our editorial work. We only recommend products we
      genuinely believe may support your wellness journey.
    </p>
  );
}
