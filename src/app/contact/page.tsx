import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with DailyWellnessHub. Questions, corrections, or partnership inquiries welcome.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted mb-8">
        Have a question, spotted an error, or want to discuss a partnership?
        Fill out the form below and we&apos;ll get back to you.
      </p>
      <ContactForm />
    </div>
  );
}
