export function SiteDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
      <p className="font-semibold mb-1">Wellness Disclaimer</p>
      <p>
        The content on DailyWellnessHub is for informational and educational
        purposes only. It is not intended as medical advice, diagnosis, or
        treatment. Always consult a qualified healthcare professional before
        making changes to your diet, exercise, or wellness routine.
      </p>
    </div>
  );
}

export function ArticleDisclaimer() {
  return (
    <aside
      className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs text-stone-500 mt-8"
      role="note"
      aria-label="Content disclaimer"
    >
      <p className="font-medium text-stone-600 mb-1">Important Notice</p>
      <p>
        This article is for general informational purposes only and does not
        constitute professional medical advice. The information provided is
        based on general wellness research and should not be used as a
        substitute for consultation with a licensed healthcare provider. Always
        seek the advice of your physician or other qualified health provider
        with any questions you may have regarding a medical condition.
      </p>
    </aside>
  );
}

export function AffiliateDisclosure() {
  return (
    <p className="text-xs text-stone-400 italic mt-4">
      Some links in this article may be affiliate links. If you make a purchase
      through these links, we may earn a small commission at no extra cost to
      you. This helps support our editorial work. We only recommend products we
      genuinely believe can support your wellness journey.
    </p>
  );
}
