import Link from "next/link";

interface Props {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  coverAlt?: string | null;
  author: string;
  readTime: number;
  publishedAt: Date | null;
}

export function ArticleCard({
  slug,
  categorySlug,
  title,
  excerpt,
  coverImage,
  coverAlt,
  author,
  readTime,
  publishedAt,
}: Props) {
  const href = `/${categorySlug}/${slug}`;

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
      {coverImage && (
        <Link href={href}>
          <div className="aspect-video bg-stone-100 overflow-hidden">
            <img
              src={coverImage}
              alt={coverAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      <div className="p-5">
        <Link
          href={`/${categorySlug}`}
          className="text-xs font-medium text-primary uppercase tracking-wide"
        >
          {categorySlug.replace(/-/g, " ")}
        </Link>
        <h3 className="mt-1 font-semibold text-lg leading-snug">
          <Link href={href} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-muted line-clamp-2">{excerpt}</p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          <span>{author}</span>
          <span>&middot;</span>
          <span>{readTime} min read</span>
          {publishedAt && (
            <>
              <span>&middot;</span>
              <time dateTime={publishedAt.toISOString()}>
                {publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
