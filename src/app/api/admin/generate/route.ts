import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";

/**
 * AI Content Generation endpoint.
 *
 * POST /api/admin/generate
 * Body: { topic, category, keywords[] }
 * Header: x-api-key: ADMIN_API_KEY
 *
 * Creates a ContentJob record and generates an article draft via Claude API.
 * The generated article is saved as DRAFT status (never auto-published).
 */
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { topic, category, keywords = [] } = await req.json();

    if (!topic || !category) {
      return NextResponse.json(
        { error: "topic and category are required." },
        { status: 400 },
      );
    }

    // Create job record
    const job = await prisma.contentJob.create({
      data: {
        topic,
        category,
        keywords,
        status: "PROCESSING",
      },
    });

    // Generate article via Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      await prisma.contentJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: "ANTHROPIC_API_KEY not configured" },
      });
      return NextResponse.json(
        { error: "AI generation not configured." },
        { status: 503 },
      );
    }

    const systemPrompt = `You are a wellness content writer for DailyWellnessHub. Write educational, evidence-based articles about wellness, lifestyle, and self-improvement.

STRICT RULES:
- NEVER make medical claims, diagnose conditions, or prescribe treatments
- NEVER use miracle-cure language ("guaranteed", "cures", "eliminates disease")
- Always use hedging language ("may help", "research suggests", "some people find")
- Include a brief mention that readers should consult healthcare professionals
- Write in a warm, approachable, authoritative tone
- Structure with clear H2 headings (use <h2> tags)
- Use <p>, <ul>, <li>, <blockquote> tags for formatting
- Aim for 1200-1800 words
- Include 3-5 practical, actionable takeaways
- End with a "Key Takeaways" section`;

    const userPrompt = `Write an article about: "${topic}"
Category: ${category}
Target keywords: ${keywords.join(", ") || "none specified"}

Return JSON with these fields:
- title: SEO-friendly article title (50-65 chars)
- metaTitle: SEO meta title (50-60 chars)
- metaDesc: SEO meta description (140-160 chars)
- excerpt: Short excerpt (1-2 sentences, under 200 chars)
- slug: URL slug (lowercase, hyphens, no special chars)
- body: Full article HTML
- tags: Array of 3-5 relevant tag names`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      await prisma.contentJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: errText },
      });
      return NextResponse.json(
        { error: "AI generation failed.", details: errText },
        { status: 502 },
      );
    }

    const aiResponse = await response.json();
    const textContent = aiResponse.content?.[0]?.text || "";

    // Extract JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      await prisma.contentJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: "Could not parse AI response" },
      });
      return NextResponse.json(
        { error: "Failed to parse AI response." },
        { status: 500 },
      );
    }

    const articleData = JSON.parse(jsonMatch[0]);
    const wordCount = articleData.body
      ? articleData.body.replace(/<[^>]+>/g, "").split(/\s+/).length
      : 0;

    // Ensure tags exist
    const tagRecords = [];
    for (const tagName of articleData.tags || []) {
      const slug = tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name: tagName, slug },
      });
      tagRecords.push(tag);
    }

    // Create article as DRAFT
    const article = await prisma.article.create({
      data: {
        slug: articleData.slug,
        title: articleData.title,
        metaTitle: articleData.metaTitle,
        metaDesc: articleData.metaDesc,
        excerpt: articleData.excerpt,
        body: articleData.body,
        categorySlug: category,
        wordCount,
        readTime: Math.max(1, Math.ceil(wordCount / 250)),
        aiGenerated: true,
        aiModel: "claude-haiku-4-5-20251001",
        aiPrompt: userPrompt,
        status: "DRAFT",
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
      },
    });

    // Update job
    await prisma.contentJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        articleId: article.id,
        targetSlug: article.slug,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      articleId: article.id,
      slug: article.slug,
      title: article.title,
      status: "DRAFT",
      message:
        "Article created as DRAFT. Review and approve before publishing.",
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Server error during generation." },
      { status: 500 },
    );
  }
}
