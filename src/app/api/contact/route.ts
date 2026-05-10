import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 },
      );
    }

    // Save to DB
    await prisma.contactMessage.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).toLowerCase().trim(),
        subject: subject ? String(subject).slice(0, 200) : null,
        message: String(message).slice(0, 5000),
      },
    });

    // Notify admin
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.RESEND_FROM || "DailyWellnessHub <hello@dailywellnesshub.com>",
        to: process.env.RESEND_FROM || "hello@dailywellnesshub.com",
        replyTo: email,
        subject: `[Contact] ${subject || "New message"} — from ${name}`,
        html: `
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject || "(none)"}</p>
          <hr />
          <p>${String(message).replace(/\n/g, "<br />")}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
