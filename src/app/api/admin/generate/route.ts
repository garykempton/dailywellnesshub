import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin";
import {
  buildSystemPrompt,
  buildUserPrompt,
  parseAiResponse,
  validateArticle,
  buildArticleMetadata,
  injectInternalLinks,
  findRelatedArticles,
  estimateQualityScore,
} from "@/lib/content-pipeline";
import type { ArticlePromptInput, ExistingArticle } from "@/lib/content-pipeline";

const AI_MODEL = "claude-haiku-4-5-20251001";

/**
 * AI Content Generation endpoint.
 *
 * POST /api/admin/generate
 * Body: { topic, category, keywords[], relatedTools[], relatedArticles[] }
 * Header: x-api-key: ADMIN_API_KEY
 *
 * Creates a ContentJob record and generates a validated article draft via Claude API.
 * The generated article is saved as DRAFT status (never auto-published).
 */
export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      topic,
      category,
      keywords = [],
      relatedTools = [],
      relatedArticles = [],
    } = await req.json();

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

    // Check API key
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

    // Fetch existing article slugs for internal linking context
    const existingArticles: ExistingArticle[] = await prisma.article
      .findMany({
        where: { status: { in: ["PUBLISHED", "DRAFT", "APPROVED"] } },
        select: { slug: true, categorySlug: true, title: true, keywords: true },
      })
      .then((articles) =>
        articles.map((a) => ({
          slug: a.slug,
          categorySlug: a.categorySlug,
          title: a.title,
          keywords: a.keywords as string[],
        })),
      );

    const existingSlugs = existingArticles.map((a) => a.slug);

    // Build prompts using the content pipeline
    const systemPrompt = buildSystemPrompt(category);
    const promptInput: ArticlePromptInput = {
      topic,
      category,
      keywords,
      relatedTools,
      relatedArticles,
      existingSlugs,
    };
    const userPrompt = buildUserPrompt(promptInput);

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 8192,
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

    // Parse and validate using content pipeline
    let articleData;
    try {
      articleData = parseAiResponse(textContent);
    } catch (parseError) {
      const msg =
        parseError instanceof Error ? parseError.message : "Parse error";
      await prisma.contentJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: msg },
      });
      return NextResponse.json(
        { error: "Failed to parse AI response.", details: msg },
        { status: 500 },
      );
    }

    // Validate content
    const validation = validateArticle(articleData, category);

    if (!validation.valid) {
      await prisma.contentJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: `Validation failed: ${validation.errors.join("; ")}`,
        },
      });
      return NextResponse.json(
        {
          error: "Generated article failed validation.",
          validationErrors: validation.errors,
          validationWarnings: validation.warnings,
        },
        { status: 422 },
      );
    }

    // Inject internal links into body
    articleData.body = injectInternalLinks(
      articleData.body,
      articleData.internalLinks,
      existingArticles,
    );

    // Enrich related articles if AI didn't provide enough
    if (articleData.relatedArticles.length < 3) {
      const suggested = findRelatedArticles(
        articleData.keywords,
        category,
        existingArticles,
        5,
      );
      const existing = new Set(articleData.relatedArticles);
      for (const slug of suggested) {
        if (!existing.has(slug)) {
          articleData.relatedArticles.push(slug);
          existing.add(slug);
        }
        if (articleData.relatedArticles.length >= 5) break;
      }
    }

    // Build metadata for database
    const metadata = buildArticleMetadata(
      articleData,
      category,
      AI_MODEL,
      userPrompt,
    );

    // Compute quality score
    const qualityScore = estimateQualityScore(articleData, category);

    // Ensure tags exist
    const tagRecords = [];
    for (const tagName of metadata.tags) {
      const tagSlug = tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      tagRecords.push(tag);
    }

    // Create article as DRAFT
    const article = await prisma.article.create({
      data: {
        slug: metadata.slug,
        title: metadata.title,
        metaTitle: metadata.metaTitle,
        metaDesc: metadata.metaDesc,
        excerpt: metadata.excerpt,
        summary: metadata.summary,
        body: metadata.body,
        categorySlug: metadata.categorySlug,
        keywords: metadata.keywords,
        faqSection: metadata.faqSection,
        sourceNotes: metadata.sourceNotes,
        internalLinks: metadata.internalLinks,
        relatedTools: metadata.relatedTools,
        relatedArticles: metadata.relatedArticles,
        wordCount: metadata.wordCount,
        readTime: metadata.readTime,
        healthSensitive: metadata.healthSensitive,
        aiGenerated: metadata.aiGenerated,
        aiModel: metadata.aiModel,
        aiPrompt: metadata.aiPrompt,
        status: metadata.status,
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
      qualityScore,
      validation: {
        warnings: validation.warnings,
        stats: validation.stats,
      },
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
