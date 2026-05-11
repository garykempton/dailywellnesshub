"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("chronotype-quiz")!;

type Chronotype = "lion" | "bear" | "wolf" | "dolphin";

interface Question {
  text: string;
  options: { label: string; type: Chronotype }[];
}

const QUESTIONS: Question[] = [
  {
    text: "What time do you naturally wake up on a free day?",
    options: [
      { label: "Before 6 am", type: "lion" },
      { label: "6 - 7:30 am", type: "bear" },
      { label: "7:30 - 9 am", type: "wolf" },
      { label: "After 9 am or irregular", type: "dolphin" },
    ],
  },
  {
    text: "When do you feel most alert and productive?",
    options: [
      { label: "Early morning", type: "lion" },
      { label: "Late morning", type: "bear" },
      { label: "Afternoon / evening", type: "wolf" },
      { label: "Varies, hard to predict", type: "dolphin" },
    ],
  },
  {
    text: "What time do you prefer to exercise?",
    options: [
      { label: "Before 8 am", type: "lion" },
      { label: "8 am - 12 pm", type: "bear" },
      { label: "After 5 pm", type: "wolf" },
      { label: "I struggle to find a good time", type: "dolphin" },
    ],
  },
  {
    text: "If you have no obligations, when would you go to sleep?",
    options: [
      { label: "Before 9:30 pm", type: "lion" },
      { label: "9:30 - 11 pm", type: "bear" },
      { label: "11 pm - 1 am", type: "wolf" },
      { label: "Irregular / very late", type: "dolphin" },
    ],
  },
  {
    text: "How quickly do you fall asleep?",
    options: [
      { label: "Within 5 minutes", type: "lion" },
      { label: "10 - 20 minutes", type: "bear" },
      { label: "20 - 45 minutes", type: "wolf" },
      { label: "Takes over 45 min or very variable", type: "dolphin" },
    ],
  },
  {
    text: "How do you feel about mornings?",
    options: [
      { label: "Love them, jump out of bed", type: "lion" },
      { label: "Fine once I get going", type: "bear" },
      { label: "Hate them, need time", type: "wolf" },
      { label: "Depends on the night", type: "dolphin" },
    ],
  },
  {
    text: "When does your energy dip?",
    options: [
      { label: "Early afternoon", type: "lion" },
      { label: "Late afternoon", type: "bear" },
      { label: "Rarely dip", type: "wolf" },
      { label: "Energy is unpredictable", type: "dolphin" },
    ],
  },
  {
    text: "How would you describe your sleep?",
    options: [
      { label: "Deep, restful", type: "lion" },
      { label: "Generally good", type: "bear" },
      { label: "Prefer staying up late", type: "wolf" },
      { label: "Light, easily disrupted", type: "dolphin" },
    ],
  },
];

const CHRONOTYPE_INFO: Record<
  Chronotype,
  {
    emoji: string;
    name: string;
    description: string;
    traits: string[];
    schedule: { wake: string; peak: string; workout: string; bedtime: string };
    tips: string[];
  }
> = {
  lion: {
    emoji: "\u{1F981}",
    name: "Lion",
    description:
      "Lions are natural early risers who feel most energised in the morning. They are driven, optimistic, and tend to be high achievers who tackle their most important tasks before most people have had breakfast.",
    traits: ["Morning person", "Naturally disciplined", "Goal-oriented", "Energy fades by evening"],
    schedule: {
      wake: "5:30 - 6:00 am",
      peak: "8:00 am - 12:00 pm",
      workout: "Before 8:00 am",
      bedtime: "9:00 - 10:00 pm",
    },
    tips: [
      "Schedule your hardest tasks before noon when your focus is sharpest.",
      "Avoid evening social commitments that push your bedtime late.",
      "Use the afternoon for lighter, collaborative tasks.",
      "Keep a consistent wake time even on weekends to protect your rhythm.",
    ],
  },
  bear: {
    emoji: "\u{1F43B}",
    name: "Bear",
    description:
      "Bears follow the solar cycle and make up about 50% of the population. They are friendly, open, and tend to be most productive in the mid-morning. Bears generally sleep well and adapt easily to conventional schedules.",
    traits: ["Follows the sun", "Sociable and adaptable", "Steady energy", "Peaks mid-morning"],
    schedule: {
      wake: "7:00 - 7:30 am",
      peak: "10:00 am - 2:00 pm",
      workout: "Morning or lunchtime",
      bedtime: "10:30 - 11:30 pm",
    },
    tips: [
      "Leverage your mid-morning peak for deep, focused work.",
      "Take a short walk after lunch to counter the afternoon dip.",
      "Avoid heavy meals close to bedtime to maintain your good sleep quality.",
      "Maintain regular meal and sleep times to keep your internal clock stable.",
    ],
  },
  wolf: {
    emoji: "\u{1F43A}",
    name: "Wolf",
    description:
      "Wolves are classic night owls who come alive in the evening. They are creative, introverted, and often produce their best work after sunset. Mornings are a struggle, but evenings spark inspiration.",
    traits: ["Night owl", "Creative and impulsive", "Evening energy surge", "Slow mornings"],
    schedule: {
      wake: "7:30 - 9:00 am",
      peak: "5:00 pm - 12:00 am",
      workout: "After 5:00 pm",
      bedtime: "12:00 - 1:00 am",
    },
    tips: [
      "Do not fight your rhythm - schedule creative work for evenings when possible.",
      "Use mornings for routine tasks that require less brainpower.",
      "Get bright light exposure in the morning to help you feel more alert earlier.",
      "Limit screens in the hour before bed to avoid pushing your bedtime even later.",
    ],
  },
  dolphin: {
    emoji: "\u{1F42C}",
    name: "Dolphin",
    description:
      "Dolphins are light sleepers with irregular patterns. They are highly intelligent, detail-oriented, and often anxious about sleep itself. Their energy fluctuates unpredictably, but they can be incredibly productive in focused bursts.",
    traits: ["Light sleeper", "Detail-oriented", "Anxious tendencies", "Unpredictable energy"],
    schedule: {
      wake: "6:30 - 7:00 am",
      peak: "10:00 am - 12:00 pm (varies)",
      workout: "Morning, to burn off nervous energy",
      bedtime: "11:00 pm - 12:00 am",
    },
    tips: [
      "Create a calming bedtime routine to ease your racing mind.",
      "Exercise in the morning to regulate your energy and reduce anxiety.",
      "Use short focused work blocks (25-50 min) rather than long marathons.",
      "Avoid caffeine after noon, as your sensitivity may amplify its effects.",
    ],
  },
};

interface Results {
  primary: Chronotype;
  secondary: Chronotype;
  scores: Record<Chronotype, number>;
  pcts: Record<Chronotype, number>;
}

function scoreQuiz(answers: number[]): Results {
  const scores: Record<Chronotype, number> = { lion: 0, bear: 0, wolf: 0, dolphin: 0 };
  const types: Chronotype[] = ["lion", "bear", "wolf", "dolphin"];

  answers.forEach((answer, qi) => {
    const type = QUESTIONS[qi].options[answer].type;
    scores[type]++;
  });

  const total = answers.length;
  const pcts = {} as Record<Chronotype, number>;
  for (const t of types) {
    pcts[t] = Math.round((scores[t] / total) * 100);
  }

  const sorted = types.slice().sort((a, b) => scores[b] - scores[a]);

  return { primary: sorted[0], secondary: sorted[1], scores, pcts };
}

export default function ChronotypeQuizPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [results, setResults] = useState<Results | null>(null);

  function handleSelect(qi: number, oi: number) {
    const next = [...answers];
    next[qi] = oi;
    setAnswers(next);
  }

  function handleSubmit() {
    if (answers.some((a) => a === null)) return;
    setResults(scoreQuiz(answers as number[]));
  }

  function handleRetake() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setResults(null);
  }

  const allAnswered = answers.every((a) => a !== null);
  const types: Chronotype[] = ["lion", "bear", "wolf", "dolphin"];

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!results ? (
          <>
            {/* Questions */}
            {QUESTIONS.map((q, qi) => (
              <div key={qi} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-stone-800">
                  {qi + 1}. {q.text}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleSelect(qi, oi)}
                      className={`text-left border rounded-lg px-4 py-3 transition-colors ${
                        answers[qi] === oi
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-stone-300 text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                allAnswered
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              {allAnswered ? "See My Chronotype" : `Answer all ${QUESTIONS.length} questions to continue`}
            </button>
          </>
        ) : (
          <>
            {/* Result card */}
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-3">
              <p className="text-6xl">{CHRONOTYPE_INFO[results.primary].emoji}</p>
              <h2 className="text-3xl font-bold text-stone-800">
                You are a {CHRONOTYPE_INFO[results.primary].name}
              </h2>
              {results.primary !== results.secondary && (
                <p className="text-stone-500">
                  with {CHRONOTYPE_INFO[results.secondary].name} tendencies
                </p>
              )}
              <p className="text-stone-600 max-w-lg mx-auto">
                {CHRONOTYPE_INFO[results.primary].description}
              </p>
            </div>

            {/* Score breakdown */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Score Breakdown</h3>
              <div className="space-y-3">
                {types.map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <span className="w-8 text-xl">{CHRONOTYPE_INFO[t].emoji}</span>
                    <span className="w-20 text-sm font-medium text-stone-600 capitalize">{t}</span>
                    <div className="flex-1 h-5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          t === results.primary ? "bg-primary" : "bg-stone-300"
                        }`}
                        style={{ width: `${results.pcts[t]}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-right text-stone-600">{results.pcts[t]}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal schedule */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Your Ideal Daily Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    ["Wake Time", CHRONOTYPE_INFO[results.primary].schedule.wake],
                    ["Peak Productivity", CHRONOTYPE_INFO[results.primary].schedule.peak],
                    ["Best Workout Time", CHRONOTYPE_INFO[results.primary].schedule.workout],
                    ["Ideal Bedtime", CHRONOTYPE_INFO[results.primary].schedule.bedtime],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="bg-stone-50 rounded-lg p-4">
                    <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-stone-800 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">
                Tips for {CHRONOTYPE_INFO[results.primary].name}s
              </h3>
              <ul className="space-y-2">
                {CHRONOTYPE_INFO[results.primary].tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-700">
                    <span className="text-primary font-bold mt-0.5">&#x2022;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparison table */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">All Chronotypes Compared</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-2 pr-3 text-stone-500 font-medium">Trait</th>
                      {types.map((t) => (
                        <th
                          key={t}
                          className={`py-2 px-2 text-center font-medium ${
                            t === results.primary ? "text-primary" : "text-stone-500"
                          }`}
                        >
                          {CHRONOTYPE_INFO[t].emoji} {CHRONOTYPE_INFO[t].name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-stone-600">
                    {["wake", "peak", "workout", "bedtime"].map((key) => (
                      <tr key={key} className="border-b border-stone-100">
                        <td className="py-2 pr-3 font-medium capitalize text-stone-700">{key === "peak" ? "Peak Hours" : key === "workout" ? "Best Workout" : key === "wake" ? "Wake Time" : "Bedtime"}</td>
                        {types.map((t) => (
                          <td
                            key={t}
                            className={`py-2 px-2 text-center text-xs ${
                              t === results.primary ? "font-semibold text-stone-800" : ""
                            }`}
                          >
                            {CHRONOTYPE_INFO[t].schedule[key as keyof typeof CHRONOTYPE_INFO.lion.schedule]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Retake Quiz
            </button>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
