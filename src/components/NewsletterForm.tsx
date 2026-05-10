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
      <section className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Get Weekly Wellness Tips
        </h2>
        <p className="text-muted mb-6 max-w-md mx-auto">
          Join thousands of readers getting practical, evidence-based wellness
          advice delivered to their inbox every week. Free forever.
        </p>

        {status === "success" ? (
          <p className="text-primary font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-600 text-sm mt-2">{message}</p>
        )}

        <p className="text-xs text-muted mt-4">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
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
        className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Join"}
      </button>
    </form>
  );
}
