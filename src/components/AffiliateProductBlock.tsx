import { AffiliateDisclosure } from "@/components/Disclaimer";

interface AffiliateProduct {
  url: string;
  label: string;
  vendor: string;
  description?: string;
  price?: string;
}

interface Props {
  /** JSON array stored in article.affiliateLinks */
  products: AffiliateProduct[];
  className?: string;
}

/**
 * Renders a block of affiliate product recommendations.
 *
 * Designed to be placed inside articles. Each product links out with
 * rel="nofollow sponsored" and proper disclosure.
 *
 * Pass an empty array or omit the component entirely when there are
 * no affiliate products — it renders nothing.
 */
export function AffiliateProductBlock({ products, className = "" }: Props) {
  if (!products.length) return null;

  return (
    <aside
      className={`border border-border rounded-xl p-6 bg-stone-50 ${className}`}
      aria-label="Recommended products"
    >
      <h3 className="font-semibold text-lg mb-1">Products We Recommend</h3>
      <p className="text-xs text-muted mb-4">
        Independently chosen. We may earn a commission if you buy through our links.
      </p>

      <div className="space-y-4">
        {products.map((product, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border border-border"
          >
            <div className="flex-1 min-w-0">
              <a
                href={product.url}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="font-medium text-primary hover:underline"
              >
                {product.label}
              </a>
              {product.description && (
                <p className="text-sm text-muted mt-1">{product.description}</p>
              )}
              <p className="text-xs text-muted mt-1">
                via {product.vendor}
                {product.price && <> &middot; {product.price}</>}
              </p>
            </div>
            <a
              href={product.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="shrink-0 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              View
            </a>
          </div>
        ))}
      </div>

      <AffiliateDisclosure />
    </aside>
  );
}
