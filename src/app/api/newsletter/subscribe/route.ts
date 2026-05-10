import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 },
      );
    }

    const normalised = email.toLowerCase().trim();

    // Check existing
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalised },
    });

    if (existing && !existing.unsubscribedAt) {
      return NextResponse.json(
        { error: "You're already subscribed!" },
        { status: 409 },
      );
    }

    // Upsert subscriber
    await prisma.subscriber.upsert({
      where: { email: normalised },
      update: { unsubscribedAt: null, confirmed: true },
      create: { email: normalised, confirmed: true },
    });

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.RESEND_FROM || "DailyWellnessHub <hello@dailywellnesshub.com>",
        to: normalised,
        subject: "Welcome to DailyWellnessHub!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Welcome to DailyWellnessHub!</h1>
            <p>Thanks for subscribing. You'll receive our best wellness articles every week — practical, evidence-based, and always free.</p>
            <p>In the meantime, explore our latest content at <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #16a34a;">dailywellnesshub.com</a>.</p>
            <p style="color: #999; font-size: 12px; margin-top: 32px;">
              You can unsubscribe at any time using the link at the bottom of any email.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
