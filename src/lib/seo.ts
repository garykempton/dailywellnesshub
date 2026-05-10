import { SITE_NAME, SITE_URL } from "./constants";

interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  coverImage?: string;
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  author,
  coverImage,
}: ArticleJsonLdProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}/${slug}`,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(coverImage && {
      image: {
        "@type": "ImageObject",
        url: coverImage,
      },
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${slug}`,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Science-backed wellness tips, healthy lifestyle guides, and self-improvement strategies.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
