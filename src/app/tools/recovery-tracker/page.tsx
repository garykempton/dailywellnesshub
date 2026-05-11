"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("recovery-tracker")!;

interface Metric {
  key: string;
  label: string;
  question: string;
  options: string[];
}

const METRICS: Metric[] = [
  {
    key: "sleep",
    label: "Sleep Quality",
    question: "How well did you sleep last night?",
    options: ["Very Poor", "Poor", "Okay", "Good", "Excellent"],
  },
  {
    key: "soreness",
    label: "Muscle Soreness",
    question: "How sore are you?",
    options: ["Very Sore", "Quite Sore", "Moderate", "Mild", "None"],
  },
  {
    key: "energy",
    label: "Energy Level",
    question: "How is your energy today?",
    options: ["Exhausted", "Low", "Moderate", "High", "Very High"],
  },
  {
    key: "mood",
    label: "Mood",
    question: "How is your mood?",
    options: ["Very Low", "Low", "Neutral", "Good", "Great"],
  },
  {
    key: "heartRate",
    label: "Resting Heart Rate",
    question: "Is your resting HR higher than usual?",
    options: ["Much Higher", "Somewhat Higher", "Normal", "Slightly Low", "Low/Normal"],
  },
];

function getScoreColor(score: number) {
  if (score >= 80) return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
  if (score >= 60) return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" };
  if (score >= 40) return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" };
  return { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" };
}

function getRecommendation(score: number) {
  if (score >= 80) return { label: "Ready to Train Hard", detail: "Your recovery metrics look great. You are well-positioned for a high-intensity session today. Focus on compound lifts, intervals, or a challenging workout." };
  if (score >= 60) return { label: "Moderate Training Recommended", detail: "Recovery is decent but not optimal. Consider a moderate session — steady-state cardio, lighter weights, or skill work. Avoid maximal efforts." };
  if (score >= 40) return { label: "Light Activity / Active Recovery", detail: "Your body is still recovering. Stick to light activity like walking, gentle yoga, stretching, or foam rolling. Prioritise sleep and nutrition today." };
  return { label: "Rest Day Recommended", detail: "Your recovery metrics suggest you need rest. Take the day off from structured training. Focus on sleep, hydration, nutrition, and stress management." };
}

function getBarColor(value: number) {
  if (value >= 4) return "bg-green-500";
  if (value >= 3) return "bg-blue-500";
  if (value >= 2) return "bg-amber-500";
  return "bg-red-500";
}

export default function RecoveryTrackerPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const allRated = METRICS.every((m) => ratings[m.key] !== undefined);

  function handleRate(key: string, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
    setShowResults(false);
  }

  function calculate() {
    if (!allRated) return;
    setShowResults(true);
  }

  function reset() {
    setRatings({});
    setShowResults(false);
  }

  const sum = Object.values(ratings).reduce((a, b) => a + b, 0);
  const score = Math.round((sum / 25) * 100);
  const colors = getScoreColor(score);
  const recommendation = getRecommendation(score);

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        {METRICS.map((metric) => (
          <div key={metric.key}>
            <p className="font-medium text-stone-800 mb-1">{metric.label}</p>
            <p className="text-sm text-stone-500 mb-2">{metric.question}</p>
            <div className="flex flex-wrap gap-2">
              {metric.options.map((label, i) => {
                const value = i + 1;
                const selected = ratings[metric.key] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleRate(metric.key, value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {value} - {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={calculate}
          disabled={!allRated}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            allRated
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          Calculate Recovery Score
        </button>
      </div>

      {showResults && (
        <div className="mt-6 space-y-6">
          {/* Score display */}
          <div className={`border rounded-xl p-6 text-center ${colors.bg} ${colors.border}`}>
            <p className="text-sm font-medium text-stone-500 mb-1">Recovery Score</p>
            <p className={`text-6xl font-bold ${colors.text}`}>{score}%</p>
            <p className={`text-lg font-semibold mt-2 ${colors.text}`}>
              {recommendation.label}
            </p>
          </div>

          {/* Metric breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Metric Breakdown</h3>
            <div className="space-y-3">
              {METRICS.map((metric) => {
                const value = ratings[metric.key];
                const pct = (value / 5) * 100;
                return (
                  <div key={metric.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-stone-700">{metric.label}</span>
                      <span className="text-stone-500">
                        {value}/5 — {metric.options[value - 1]}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getBarColor(value)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-600">
            <p className="font-semibold text-stone-700 mb-2">Training Recommendation</p>
            <p>{recommendation.detail}</p>
          </div>

          <button
            onClick={reset}
            className="w-full border border-stone-300 py-3 rounded-lg font-medium text-stone-600 hover:border-stone-500 transition-colors"
          >
            Reset &amp; Re-assess
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
