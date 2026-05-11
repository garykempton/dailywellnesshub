import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug, toolJsonLd } from "@/lib/tools";

const tool = getToolBySlug("vo2-max-calculator")!;

export const metadata: Metadata = buildMetadata({
  title: tool.name,
  description: tool.description,
  path: `/tools/${tool.slug}`,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {toolJsonLd(tool).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
