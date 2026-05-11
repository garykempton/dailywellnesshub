"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("yoga-calorie-calculator")!;

type YogaStyle =
  | "restorative"
  | "hatha"
  | "general"
  | "vinyasa"
  | "ashtanga"
  | "power"
  | "hot";

const YOGA_OPTIONS: { value: YogaStyle; label: string; met: number }[] = [
  { value: "restorative", label: "Restorative / Yin", met: 2.0 },
  { value: "hatha", label: "Hatha / Gentle", met: 2.5 },
  { value: "general", label: "General Yoga", met: 3.0 },
  { value: "vinyasa", label: "Vinyasa / Flow", met: 4.0 },
  { value: "ashtanga", label: "Ashtanga", met: 5.0 },
  { value: "power", label: "Power Yoga", met: 5.5 },
  { value: "hot", label: "Hot / Bikram", met: 6.0 },
];

const COMPARISON_ACTIVITIES: { name: string; met: number }[] = [
  { name: "Walking (moderate)", met: 3.5 },
  { name: "Jogging (light)", met: 7.0 },
  { name: "Swimming (moderate)", met: 5.8 },
];

interface Result {
  totalCalories: number;
  calPerMin: number;
  styleComparison: { label: string; calories: number; met: number }[];
  equivalents: { name: string; minutes: number }[];
  weeklyProjection: { sessions: number; calories: number }[];
  foodEquivalents: { food: string; amount: string }[];
}

export default function YogaCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [duration, setDuration] = useState("60");
  const [yogaStyle, setYogaStyle] = useState<YogaStyle>("vinyasa");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || w <= 0 || !d || d <= 0) return;

    const kg = weightUnit === "lbs" ? w * 0.453592 : w;
    const hours = d / 60;

    const style = YOGA_OPTIONS.find((s) => s.value === yogaStyle)!;
    const totalCalories = Math.round(style.met * kg * hours);
    const calPerMin = Math.round((totalCalories / d) * 10) / 10;

    const styleComparison = YOGA_OPTIONS.map((s) => ({
      label: s.label,
      calories: Math.round(s.met * kg * hours),
      met: s.met,
    }));

    const caloriesPerMin = totalCalories / d;
    const equivalents = COMPARISON_ACTIVITIES.map((a) => ({
      name: a.name,
      minutes: Math.round(totalCalories / (a.met * kg / 60)),
    }));

    const weeklyProjection = [2, 3, 4].map((sessions) => ({
      sessions,
      calories: totalCalories * sessions,
    }));

    const foodEquivalents: { food: string; amount: string }[] = [
      { food: "Banana", amount: `${Math.round(totalCalories / 105 * 10) / 10}` },
      { food: "Slice of pizza", amount: `${Math.round(totalCalories / 285 * 10) / 10}` },
      { food: "Chocolate bar", amount: `${Math.round(totalCalories / 230 * 10) / 10}` },
      { food: "Glass of wine", amount: `${Math.round(totalCalories / 125 * 10) / 10}` },
    ];

    setResult({
      totalCalories,
      calPerMin,
      styleComparison,
      equivalents,
      weeklyProjection,
      foodEquivalents,
    });
  }

  const maxCal = result
    ? Math.max(...result.styleComparison.map((s) => s.calories))
    : 0;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">Body Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={weightUnit === "kg" ? "65" : "143"}
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex gap-1">
              {(["kg", "lbs"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setWeightUnit(u);
                    setResult(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    weightUnit === u
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 hover:border-stone-500"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Session Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Yoga Style */}
        <div>
          <label className="block text-sm font-medium mb-1">Yoga Style</label>
          <select
            value={yogaStyle}
            onChange={(e) => setYogaStyle(e.target.value as YogaStyle)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {YOGA_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label} (MET {s.met})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Calories
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Big calorie card - purple/lavender theme */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 text-center">
            <p className="text-sm text-purple-600 mb-1">Total Calories Burned</p>
            <p className="text-4xl font-bold text-purple-700">
              {result.totalCalories.toLocaleString()}
            </p>
            <p className="text-xs text-purple-400">kcal</p>
          </div>

          {/* Cal/min */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500">Calories per Minute</p>
            <p className="text-3xl font-bold">{result.calPerMin}</p>
            <p className="text-xs text-stone-400">kcal/min</p>
          </div>

          {/* Style comparison chart */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Calorie Comparison by Yoga Style
            </h3>
            <div className="space-y-3">
              {result.styleComparison.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">{s.label}</span>
                    <span className="font-medium text-stone-800">
                      {s.calories} kcal
                    </span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((s.calories / maxCal) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equivalence */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">Activity Equivalence</h3>
            <p className="text-sm text-stone-600">
              To burn the same {result.totalCalories} kcal, you would need approximately:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {result.equivalents.map((e) => (
                <div
                  key={e.name}
                  className="bg-stone-50 rounded-lg p-3 text-center"
                >
                  <p className="text-2xl font-bold text-stone-800">{e.minutes}</p>
                  <p className="text-xs text-stone-500">minutes of {e.name.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly projection */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">Weekly Projection</h3>
            <div className="grid grid-cols-3 gap-3">
              {result.weeklyProjection.map((p) => (
                <div
                  key={p.sessions}
                  className="bg-purple-50 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-purple-500">
                    {p.sessions}x per week
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {p.calories.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-400">kcal/week</p>
                </div>
              ))}
            </div>
          </div>

          {/* Food equivalents */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">Food Equivalents</h3>
            <p className="text-sm text-stone-500 mb-2">
              Your session burned the equivalent of:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {result.foodEquivalents.map((f) => (
                <div
                  key={f.food}
                  className="bg-stone-50 rounded-lg p-3 text-center"
                >
                  <p className="text-lg font-bold text-stone-800">{f.amount}</p>
                  <p className="text-xs text-stone-500">{f.food}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits beyond calories */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Benefits Beyond Calories
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Flexibility",
                  desc: "Regular yoga practice significantly improves range of motion and joint mobility, reducing injury risk in daily activities.",
                },
                {
                  title: "Stress Reduction",
                  desc: "Yoga lowers cortisol levels, activates the parasympathetic nervous system, and has been shown to reduce anxiety and improve mood.",
                },
                {
                  title: "Strength",
                  desc: "Holding poses builds isometric strength, particularly in the core, legs, and shoulders. Styles like Ashtanga and Power Yoga build notable muscular endurance.",
                },
                {
                  title: "Balance & Posture",
                  desc: "Standing and balancing poses train proprioception and postural muscles, helping prevent falls and improving spinal alignment.",
                },
              ].map((b) => (
                <div key={b.title} className="bg-stone-50 rounded-lg p-4">
                  <p className="font-medium text-stone-800 text-sm mb-1">
                    {b.title}
                  </p>
                  <p className="text-xs text-stone-600">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MET methodology */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-stone-800">About MET Methodology</h3>
            <p className="text-sm text-stone-600">
              MET (Metabolic Equivalent of Task) represents the energy cost of an
              activity relative to rest. One MET equals roughly 1 kcal per kilogram
              of body weight per hour. The formula used is:{" "}
              <strong>Calories = MET x weight (kg) x duration (hours)</strong>.
            </p>
            <p className="text-sm text-stone-600">
              MET values are sourced from the Compendium of Physical Activities and
              represent averages. Actual calorie burn can vary based on individual
              fitness level, body composition, effort intensity, room temperature, and
              other factors. Use these estimates as a general guide rather than an
              exact measurement.
            </p>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
