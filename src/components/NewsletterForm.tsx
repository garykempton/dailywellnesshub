"use client";

import { useState } from "react";

interface Props {
  variant?: "inline" | "full";
}

export function NewsletterForm({ variant = "inline" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're in! Check your inbox for a welcome email.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (variant === "full") {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/30 to-white border border-primary/15 rounded-2xl p-8 md:p-10 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.06),transparent_50%)]" />
        <div className="relative">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Free Newsletter</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Get Weekly Wellness Tips
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto leading-relaxed">
            Join thousands of readers getting practical, evidence-based wellness
            advice delivered to their inbox every week.
          </p>

          {status === "success" ? (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 font-medium px-6 py-3 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-3 rounded-full border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe Free"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-red-600 text-sm mt-3">{message}</p>
          )}

          <p className="text-xs text-muted mt-5">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-2.5 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-all hover:shadow-md hover:shadow-green-500/20 disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Join"}
      </button>
    </form>
  );
}
