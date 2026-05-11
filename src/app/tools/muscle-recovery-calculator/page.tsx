"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("muscle-recovery-calculator")!;

const MUSCLE_GROUPS = [
  { label: "Chest", value: "chest", base: 48 },
  { label: "Back", value: "back", base: 60 },
  { label: "Shoulders", value: "shoulders", base: 48 },
  { label: "Biceps", value: "biceps", base: 36 },
  { label: "Triceps", value: "triceps", base: 36 },
  { label: "Quads", value: "quads", base: 60 },
  { label: "Hamstrings", value: "hamstrings", base: 60 },
  { label: "Glutes", value: "glutes", base: 60 },
  { label: "Calves", value: "calves", base: 36 },
  { label: "Core", value: "core", base: 36 },
  { label: "Full Body", value: "full_body", base: 72 },
] as const;

const INTENSITY = [
  { label: "Light (few sets, not near failure)", value: "light", mult: 0.7 },
  { label: "Moderate (moderate volume, some sets near failure)", value: "moderate", mult: 1.0 },
  { label: "High (high volume, most sets to failure)", value: "high", mult: 1.3 },
  { label: "Very High (very high volume, drop sets, forced reps)", value: "very_high", mult: 1.5 },
] as const;

const EXPERIENCE = [
  { label: "Beginner (< 1 year)", value: "beginner", mult: 1.2 },
  { label: "Intermediate (1-3 years)", value: "intermediate", mult: 1.0 },
  { label: "Advanced (3+ years)", value: "advanced", mult: 0.9 },
] as const;

const SLEEP = [
  { label: "Poor (< 6 hours)", value: "poor", mult: 1.3 },
  { label: "Fair (6-7 hours)", value: "fair", mult: 1.1 },
  { label: "Good (7-8 hours)", value: "good", mult: 1.0 },
  { label: "Excellent (8+ hours)", value: "excellent", mult: 0.9 },
] as const;

const NUTRITION = [
  { label: "Poor", value: "poor", mult: 1.2 },
  { label: "Fair", value: "fair", mult: 1.1 },
  { label: "Good", value: "good", mult: 1.0 },
  { label: "Excellent", value: "excellent", mult: 0.9 },
] as const;

const STRESS = [
  { label: "Low", value: "low", mult: 0.9 },
  { label: "Moderate", value: "moderate", mult: 1.0 },
  { label: "High", value: "high", mult: 1.15 },
  { label: "Very High", value: "very_high", mult: 1.3 },
] as const;

const AGE = [
  { label: "Under 25", value: "under25", mult: 0.9 },
  { label: "25-35", value: "25-35", mult: 1.0 },
  { label: "35-45", value: "35-45", mult: 1.1 },
  { label: "45+", value: "45+", mult: 1.2 },
] as const;

interface Result {
  totalHours: number;
  readyDate: Date;
  factors: { name: string; multiplier: number }[];
  weakestFactor: string;
  base: number;
}

function getRecoveryTips(weakest: string): string[] {
  switch (weakest) {
    case "Sleep":
      return [
        "Aim for 7-9 hours of sleep per night for optimal recovery.",
        "Keep a consistent sleep schedule, even on weekends.",
        "Avoid screens for at least 30 minutes before bed.",
        "Keep your bedroom cool (18-20 C) and dark.",
      ];
    case "Nutrition":
      return [
        "Consume 1.6-2.2 g of protein per kg of body weight daily.",
        "Eat a meal with protein and carbs within 2 hours post-workout.",
        "Stay hydrated -- aim for at least 2 litres of water per day.",
        "Include anti-inflammatory foods like berries, fatty fish, and leafy greens.",
      ];
    case "Stress":
      return [
        "Practise 10 minutes of deep breathing or meditation daily.",
        "Take regular breaks during work to reduce cortisol.",
        "Consider light yoga or walking on rest days.",
        "Limit caffeine intake, especially after midday.",
      ];
    case "Intensity":
      return [
        "Consider periodising your training with deload weeks every 4-6 weeks.",
        "Not every set needs to go to failure -- leave 1-2 reps in reserve.",
        "Reduce volume by 30-40% during recovery-focused weeks.",
        "Focus on progressive overload rather than maximal effort each session.",
      ];
    case "Age":
      return [
        "Prioritise warm-ups and cool-downs to protect joints.",
        "Consider adding mobility work on rest days.",
        "Allow slightly longer between intense sessions targeting the same muscle.",
        "Focus on sleep quality and nutrition -- they matter more as you age.",
      ];
    case "Experience":
      return [
        "As a beginner, your muscles need more time to adapt to training stress.",
        "Start with 2-3 sessions per week and build up gradually.",
        "Focus on proper form before increasing intensity.",
        "Track your recovery so you learn how your body responds over time.",
      ];
    default:
      return [
        "Listen to your body and allow adequate rest between sessions.",
        "Stay consistent with sleep, nutrition, and hydration.",
      ];
  }
}

function getStatusLabel(hours: number): { label: string; color: string; width: string } {
  if (hours <= 36) return { label: "Fully Recovered Quickly", color: "bg-green-500", width: "25%" };
  if (hours <= 48) return { label: "Slightly Fatigued", color: "bg-green-400", width: "40%" };
  if (hours <= 60) return { label: "Moderately Fatigued", color: "bg-amber-400", width: "60%" };
  if (hours <= 72) return { label: "Significantly Fatigued", color: "bg-orange-500", width: "75%" };
  return { label: "Needs Full Rest", color: "bg-red-500", width: "90%" };
}

function getTrafficLight(hours: number): { color: string; label: string; bg: string } {
  if (hours < 36) return { color: "text-green-600", label: "Quick Recovery", bg: "bg-green-100" };
  if (hours <= 60) return { color: "text-amber-600", label: "Moderate Recovery", bg: "bg-amber-100" };
  return { color: "text-red-600", label: "Extended Recovery", bg: "bg-red-100" };
}

export default function MuscleRecoveryCalculatorPage() {
  const [muscleGroup, setMuscleGroup] = useState(0);
  const [intensity, setIntensity] = useState(1);
  const [experience, setExperience] = useState(1);
  const [sleep, setSleep] = useState(2);
  const [nutrition, setNutrition] = useState(2);
  const [stress, setStress] = useState(1);
  const [age, setAge] = useState(1);
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const mg = MUSCLE_GROUPS[muscleGroup];
    const intMult = INTENSITY[intensity];
    const expMult = EXPERIENCE[experience];
    const slpMult = SLEEP[sleep];
    const nutMult = NUTRITION[nutrition];
    const strMult = STRESS[stress];
    const ageMult = AGE[age];

    const factors = [
      { name: "Intensity", multiplier: intMult.mult },
      { name: "Experience", multiplier: expMult.mult },
      { name: "Sleep", multiplier: slpMult.mult },
      { name: "Nutrition", multiplier: nutMult.mult },
      { name: "Stress", multiplier: strMult.mult },
      { name: "Age", multiplier: ageMult.mult },
    ];

    const totalMult = factors.reduce((acc, f) => acc * f.multiplier, 1);
    const totalHours = Math.round(mg.base * totalMult);

    const worstFactor = factors.reduce((prev, curr) =>
      curr.multiplier > prev.multiplier ? curr : prev
    );

    const readyDate = new Date(Date.now() + totalHours * 60 * 60 * 1000);

    setResult({
      totalHours,
      readyDate,
      factors,
      weakestFactor: worstFactor.name,
      base: mg.base,
    });
  }

  const selectClass = "w-full border border-stone-300 rounded-lg px-3 py-2 bg-white";

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Muscle Group</label>
          <select className={selectClass} value={muscleGroup} onChange={(e) => setMuscleGroup(Number(e.target.value))}>
            {MUSCLE_GROUPS.map((g, i) => (
              <option key={g.value} value={i}>{g.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Workout Intensity</label>
          <select className={selectClass} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}>
            {INTENSITY.map((o, i) => (
              <option key={o.value} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Training Experience</label>
          <select className={selectClass} value={experience} onChange={(e) => setExperience(Number(e.target.value))}>
            {EXPERIENCE.map((o, i) => (
              <option key={o.value} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sleep Quality</label>
          <select className={selectClass} value={sleep} onChange={(e) => setSleep(Number(e.target.value))}>
            {SLEEP.map((o, i) => (
              <option key={o.value} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nutrition Quality</label>
          <select className={selectClass} value={nutrition} onChange={(e) => setNutrition(Number(e.target.value))}>
            {NUTRITION.map((o, i) => (
              <option key={o.value} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stress Level</label>
          <select className={selectClass} value={stress} onChange={(e) => setStress(Number(e.target.value))}>
            {STRESS.map((o, i) => (
              <option key={o.value} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Age Range</label>
          <select className={selectClass} value={age} onChange={(e) => setAge(Number(e.target.value))}>
            {AGE.map((o, i) => (
              <option key={o.value} value={i}>{o.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Recovery Time
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-6">
          {/* Main result */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500 mb-1">Estimated Recovery Time</p>
            <p className="text-5xl font-bold">{result.totalHours}h</p>
            <p className="text-stone-500 mt-1">
              {result.totalHours < 24
                ? `${result.totalHours} hours`
                : `${Math.floor(result.totalHours / 24)} day${Math.floor(result.totalHours / 24) !== 1 ? "s" : ""} ${result.totalHours % 24} hours`}
            </p>

            {/* Traffic light */}
            {(() => {
              const tl = getTrafficLight(result.totalHours);
              return (
                <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${tl.bg} ${tl.color}`}>
                  {tl.label}
                </div>
              );
            })()}

            <p className="text-sm text-stone-500 mt-4">
              Train again:{" "}
              <span className="font-medium text-stone-700">
                {result.readyDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {result.readyDate.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>

          {/* Recovery status bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <p className="text-sm font-medium mb-2">Recovery Status</p>
            {(() => {
              const status = getStatusLabel(result.totalHours);
              return (
                <>
                  <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${status.color} transition-all duration-500`}
                      style={{ width: status.width }}
                    />
                  </div>
                  <p className="text-sm text-stone-600 mt-1">{status.label}</p>
                </>
              );
            })()}
          </div>

          {/* Factor breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <p className="text-sm font-medium mb-4">Factor Breakdown</p>
            <p className="text-xs text-stone-400 mb-3">
              Base recovery: {result.base}h ({MUSCLE_GROUPS[muscleGroup].label})
            </p>
            <div className="space-y-3">
              {result.factors.map((f) => {
                const pct = Math.round(((f.multiplier - 0.7) / (1.5 - 0.7)) * 100);
                const barColor =
                  f.multiplier <= 0.95
                    ? "bg-green-400"
                    : f.multiplier <= 1.05
                      ? "bg-stone-400"
                      : f.multiplier <= 1.2
                        ? "bg-amber-400"
                        : "bg-red-400";
                return (
                  <div key={f.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-600">{f.name}</span>
                      <span className={`font-medium ${f.multiplier > 1 ? "text-red-600" : f.multiplier < 1 ? "text-green-600" : "text-stone-600"}`}>
                        {f.multiplier > 1 ? "+" : ""}
                        {Math.round((f.multiplier - 1) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recovery tips */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <p className="text-sm font-medium mb-1">Recovery Tips</p>
            <p className="text-xs text-stone-400 mb-3">
              Based on your weakest factor: {result.weakestFactor}
            </p>
            <ul className="space-y-2">
              {getRecoveryTips(result.weakestFactor).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="text-primary mt-0.5 shrink-0">&#8226;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
