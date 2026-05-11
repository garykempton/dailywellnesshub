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
    <article className="card-hover bg-card border border-border/60 rounded-2xl overflow-hidden group">
      {coverImage && (
        <Link href={href}>
          <div className="aspect-video bg-stone-100 overflow-hidden">
            <img
              src={coverImage}
              alt={coverAlt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      <div className="p-5 md:p-6">
        <Link
          href={`/${categorySlug}`}
          className="inline-block text-[11px] font-semibold text-primary uppercase tracking-widest"
        >
          {categorySlug.replace(/-/g, " ")}
        </Link>
        <h3 className="mt-1.5 font-semibold text-lg leading-snug text-stone-800">
          <Link href={href} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">{excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <span className="font-medium text-stone-600">{author}</span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span>{readTime} min read</span>
          {publishedAt && (
            <>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
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
