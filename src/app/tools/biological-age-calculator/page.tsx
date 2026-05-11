"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("biological-age-calculator")!;

interface Question {
  id: string;
  category: string;
  text: string;
  options: { label: string; modifier: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: "exercise_freq",
    category: "Exercise",
    text: "How often do you exercise?",
    options: [
      { label: "Never", modifier: 2 },
      { label: "1-2 times/week", modifier: 1 },
      { label: "3-4 times/week", modifier: -0.5 },
      { label: "5+ times/week", modifier: -1.5 },
    ],
  },
  {
    id: "exercise_type",
    category: "Exercise",
    text: "What type of exercise do you do?",
    options: [
      { label: "None", modifier: 2 },
      { label: "Cardio only", modifier: 1 },
      { label: "Strength only", modifier: -0.5 },
      { label: "Both cardio and strength", modifier: -1.5 },
    ],
  },
  {
    id: "sleep",
    category: "Sleep",
    text: "How many hours do you sleep per night?",
    options: [
      { label: "Less than 5", modifier: 2 },
      { label: "5-6 hours", modifier: 1 },
      { label: "7-8 hours", modifier: -1.5 },
      { label: "8-9 hours", modifier: -0.5 },
    ],
  },
  {
    id: "diet",
    category: "Diet",
    text: "How would you rate your diet?",
    options: [
      { label: "Poor (mostly processed food)", modifier: 2 },
      { label: "Fair", modifier: 1 },
      { label: "Good (mostly whole foods)", modifier: -0.5 },
      { label: "Excellent (balanced, whole foods)", modifier: -1.5 },
    ],
  },
  {
    id: "smoking",
    category: "Habits",
    text: "Do you smoke?",
    options: [
      { label: "Yes, daily", modifier: 2 },
      { label: "Occasionally", modifier: 1 },
      { label: "Former smoker", modifier: -0.5 },
      { label: "Never", modifier: -1.5 },
    ],
  },
  {
    id: "alcohol",
    category: "Habits",
    text: "How many alcoholic drinks per week?",
    options: [
      { label: "14+", modifier: 2 },
      { label: "7-14", modifier: 1 },
      { label: "1-7", modifier: -0.5 },
      { label: "None or rare", modifier: -1.5 },
    ],
  },
  {
    id: "stress",
    category: "Stress",
    text: "How would you rate your stress level?",
    options: [
      { label: "Very high", modifier: 2 },
      { label: "High", modifier: 1 },
      { label: "Moderate", modifier: -0.5 },
      { label: "Low", modifier: -1.5 },
    ],
  },
  {
    id: "social",
    category: "Social",
    text: "How strong are your social connections?",
    options: [
      { label: "Isolated", modifier: 2 },
      { label: "Some friends", modifier: 1 },
      { label: "Good network", modifier: -0.5 },
      { label: "Very connected", modifier: -1.5 },
    ],
  },
  {
    id: "weight",
    category: "Diet",
    text: "Do you maintain a healthy weight?",
    options: [
      { label: "Obese", modifier: 2 },
      { label: "Overweight", modifier: 1 },
      { label: "Healthy range", modifier: -0.5 },
      { label: "Very fit", modifier: -1.5 },
    ],
  },
  {
    id: "chronic",
    category: "Habits",
    text: "Any chronic health conditions?",
    options: [
      { label: "Multiple", modifier: 2 },
      { label: "One, managed", modifier: 1 },
      { label: "One, well-controlled", modifier: -0.5 },
      { label: "None", modifier: -1.5 },
    ],
  },
  {
    id: "checkups",
    category: "Habits",
    text: "How often do you see a doctor for checkups?",
    options: [
      { label: "Never", modifier: 2 },
      { label: "Rarely", modifier: 1 },
      { label: "Annually", modifier: -0.5 },
      { label: "Regularly", modifier: -1.5 },
    ],
  },
];

const CATEGORIES = ["Exercise", "Sleep", "Diet", "Stress", "Habits", "Social"];

interface Recommendation {
  category: string;
  text: string;
}

const RECS: Record<string, Recommendation> = {
  Exercise: {
    category: "Exercise",
    text: "Aim for at least 150 minutes of moderate exercise per week, combining both cardio and strength training.",
  },
  Sleep: {
    category: "Sleep",
    text: "Prioritise 7-8 hours of quality sleep. Maintain a consistent sleep schedule and limit screen time before bed.",
  },
  Diet: {
    category: "Diet",
    text: "Focus on whole, unprocessed foods. Increase vegetable intake and reduce added sugars and ultra-processed items.",
  },
  Stress: {
    category: "Stress",
    text: "Incorporate daily stress management: breathing exercises, meditation, or time in nature can significantly lower chronic stress.",
  },
  Habits: {
    category: "Habits",
    text: "Eliminate smoking, moderate alcohol intake, stay on top of regular health screenings, and manage any chronic conditions proactively.",
  },
  Social: {
    category: "Social",
    text: "Invest in social relationships. Regular meaningful connection with others is strongly linked to longevity and well-being.",
  },
};

function getCategoryLabel(cat: string): string {
  return cat;
}

export default function BiologicalAgeCalculatorPage() {
  const [chronAge, setChronAge] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    bioAge: number;
    diff: number;
    category: string;
    categoryScores: Record<string, number>;
    strengths: string[];
    improvements: string[];
    topRecs: Recommendation[];
  } | null>(null);

  function setAnswer(qId: string, modifier: number) {
    setAnswers((prev) => ({ ...prev, [qId]: modifier }));
  }

  function calculate() {
    const age = parseInt(chronAge, 10);
    if (!age || age < 1) return;
    if (Object.keys(answers).length < QUESTIONS.length) return;

    const totalModifier = Object.values(answers).reduce((s, v) => s + v, 0);
    let bioAge = Math.round((age + totalModifier) * 10) / 10;
    bioAge = Math.max(age - 15, Math.min(age + 20, bioAge));
    bioAge = Math.round(bioAge);

    const diff = bioAge - age;

    let category = "Average";
    if (diff <= -8) category = "Excellent";
    else if (diff <= -3) category = "Good";
    else if (diff <= 3) category = "Average";
    else if (diff <= 8) category = "Needs Improvement";
    else category = "At Risk";

    // Category scores: sum modifiers per category, normalise to 0-100
    // Lower modifier = better, so invert for display
    const categoryScores: Record<string, number> = {};
    const categoryModifiers: Record<string, number[]> = {};
    QUESTIONS.forEach((q) => {
      if (!categoryModifiers[q.category]) categoryModifiers[q.category] = [];
      categoryModifiers[q.category].push(answers[q.id]);
    });

    const strengths: string[] = [];
    const improvements: string[] = [];

    CATEGORIES.forEach((cat) => {
      const mods = categoryModifiers[cat] || [];
      const avg = mods.reduce((s, v) => s + v, 0) / mods.length;
      // Map from [-1.5, 2] range to [100, 0] score
      const score = Math.round(Math.max(0, Math.min(100, ((2 - avg) / 3.5) * 100)));
      categoryScores[cat] = score;

      if (score >= 70) strengths.push(cat);
      else if (score < 50) improvements.push(cat);
    });

    // Top 3 worst categories for recommendations
    const sorted = CATEGORIES.slice().sort(
      (a, b) => (categoryScores[a] || 0) - (categoryScores[b] || 0)
    );
    const topRecs = sorted.slice(0, 3).map((cat) => RECS[cat]);

    setResult({ bioAge, diff, category, categoryScores, strengths, improvements, topRecs });
  }

  function diffColor(diff: number): string {
    if (diff <= -5) return "text-green-600";
    if (diff < 0) return "text-green-500";
    if (diff === 0) return "text-amber-500";
    if (diff <= 5) return "text-orange-500";
    return "text-red-600";
  }

  function categoryColor(cat: string): string {
    if (cat === "Excellent") return "text-green-600";
    if (cat === "Good") return "text-green-500";
    if (cat === "Average") return "text-amber-500";
    if (cat === "Needs Improvement") return "text-orange-500";
    return "text-red-600";
  }

  function barColor(score: number): string {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-amber-400";
    if (score >= 30) return "bg-orange-400";
    return "bg-red-500";
  }

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  return (
    <ToolPageLayout tool={tool}>
      {!result && (
        <div className="space-y-6">
          {/* Chronological age */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Chronological Age
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={chronAge}
                onChange={(e) => setChronAge(e.target.value)}
                placeholder="35"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Quiz questions */}
          {QUESTIONS.map((q, qi) => (
            <div
              key={q.id}
              className="bg-white border border-stone-200 rounded-xl p-6 space-y-3"
            >
              <p className="font-medium text-stone-800">
                <span className="text-stone-400 mr-2">{qi + 1}.</span>
                {q.text}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setAnswer(q.id, opt.modifier)}
                    className={`text-left px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      answers[q.id] === opt.modifier
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={calculate}
            disabled={!allAnswered || !chronAge}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              allAnswered && chronAge
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {allAnswered ? "Calculate Biological Age" : `Answer all ${QUESTIONS.length} questions to continue`}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Main result */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center space-y-3">
            <p className="text-sm text-stone-500">Your Biological Age</p>
            <p className={`text-6xl font-bold ${diffColor(result.diff)}`}>
              {result.bioAge}
            </p>
            <p className="text-stone-600">
              {result.diff === 0
                ? "Same as your chronological age"
                : result.diff < 0
                ? `${Math.abs(result.diff)} years younger than your chronological age of ${chronAge}`
                : `${result.diff} years older than your chronological age of ${chronAge}`}
            </p>
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${categoryColor(result.category)}`}
            >
              {result.category}
            </span>
          </div>

          {/* Category bars */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-800">Scores by Category</p>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const score = result.categoryScores[cat] || 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-700">{getCategoryLabel(cat)}</span>
                      <span className="text-stone-500">{score}/100</span>
                    </div>
                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths and improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.strengths.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-2">
                <p className="font-medium text-green-800">Factors Working for You</p>
                <ul className="text-sm text-green-700 space-y-1">
                  {result.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="mt-0.5 text-green-500 font-bold">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.improvements.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2">
                <p className="font-medium text-amber-800">Areas to Improve</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  {result.improvements.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-500 font-bold">!</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Top 3 recommendations */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-800">Top Recommendations</p>
            <div className="space-y-3">
              {result.topRecs.map((rec, i) => (
                <div
                  key={rec.category}
                  className="bg-stone-50 border border-stone-100 rounded-lg p-4"
                >
                  <p className="text-sm font-semibold text-stone-700 mb-1">
                    {i + 1}. {rec.category}
                  </p>
                  <p className="text-sm text-stone-600">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
              setChronAge("");
            }}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">Disclaimer</p>
        <p>
          Biological age is an estimate based on lifestyle factors and is not a
          medical diagnosis. True biological age measurement requires clinical
          biomarkers such as DNA methylation, telomere length, and blood panels.
          This quiz provides a general indication of how your habits may
          influence your rate of ageing. Use it as motivation, not as medical
          advice. Always consult a healthcare professional for personalised
          health assessments.
        </p>
      </div>
    </ToolPageLayout>
  );
}
