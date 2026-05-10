import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";

// ─── Organization (site-wide, placed on homepage) ───────────────────

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
    },
  };
}

// ─── WebSite (homepage, includes SearchAction) ──────────────────────

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };
}

// ─── Article ────────────────────────────────────────────────────────

interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  coverImage?: string;
  wordCount?: number;
  tags?: string[];
  categoryName?: string;
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  author,
  coverImage,
  wordCount,
  tags,
  categoryName,
}: ArticleJsonLdProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/${slug}/#article`,
    headline: title,
    description,
    url: `${SITE_URL}/${slug}`,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      "@type": "Person",
      name: author,
      url: `${SITE_URL}/about`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${slug}`,
    },
    ...(coverImage && {
      image: {
        "@type": "ImageObject",
        url: coverImage,
        width: 1200,
        height: 630,
      },
    }),
    ...(wordCount && { wordCount }),
    ...(tags &&
      tags.length > 0 && { keywords: tags.join(", ") }),
    ...(categoryName && {
      articleSection: categoryName,
    }),
    inLanguage: "en-US",
  };
}

// ─── Breadcrumbs ────────────────────────────────────────────────────

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

// ─── FAQ (auto-generated from article H2 headings) ──────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FaqItem[]) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Extract FAQ pairs from article HTML body.
 * Converts each H2 heading into a question and takes the first
 * paragraph(s) after it as the answer (up to 300 chars).
 */
export function extractFaqFromHtml(html: string): FaqItem[] {
  const faqs: FaqItem[] = [];
  // Match <h2>...</h2> followed by content until next <h2> or end
  const sections = html.split(/<h2[^>]*>/i);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const headingEnd = section.indexOf("</h2>");
    if (headingEnd === -1) continue;

    const question = section
      .slice(0, headingEnd)
      .replace(/<[^>]+>/g, "")
      .trim();
    if (!question) continue;

    // Get answer text from paragraphs after the heading
    const afterHeading = section.slice(headingEnd + 5);
    const paragraphs = afterHeading.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (!paragraphs || paragraphs.length === 0) continue;

    let answer = paragraphs
      .slice(0, 2)
      .map((p) => p.replace(/<[^>]+>/g, "").trim())
      .join(" ");

    if (answer.length > 300) {
      answer = answer.slice(0, 297) + "...";
    }

    if (answer.length > 30) {
      faqs.push({ question, answer });
    }
  }

  return faqs.slice(0, 10); // Google supports up to ~10 FAQ items
}

// ─── CollectionPage (category pages) ────────────────────────────────

interface CollectionPageProps {
  name: string;
  description: string;
  slug: string;
  articles: { title: string; url: string }[];
}

export function collectionPageJsonLd({
  name,
  description,
  slug,
  articles,
}: CollectionPageProps) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/${slug}/#collection`,
    name,
    description,
    url: `${SITE_URL}/${slug}`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: a.url,
      })),
    },
    inLanguage: "en-US",
  };
}

// ─── MedicalDisclaimer (for health-related pages) ───────────────────

export function medicalDisclaimerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${SITE_URL}/#medical-disclaimer`,
    lastReviewed: new Date().toISOString().split("T")[0],
    about: {
      "@type": "MedicalCondition",
      name: "General Wellness",
    },
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: ".article-body",
    },
    specialty: {
      "@type": "MedicalSpecialty",
      name: "Preventive Medicine",
    },
  };
}

// ─── Metadata helpers ───────────────────────────────────────────────

/**
 * Generate standard metadata for any page. Ensures consistent
 * title, description, canonical, OG, and Twitter card output.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogType = "website",
  ogImage,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}) {
  const canonical = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: ogType,
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(tags && { tags }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" as const : "summary" as const,
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}
