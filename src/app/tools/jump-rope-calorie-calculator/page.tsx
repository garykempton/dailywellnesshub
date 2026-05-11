"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("jump-rope-calorie-calculator")!;

type Intensity = "slow" | "moderate" | "fast" | "double-unders";
type WeightUnit = "kg" | "lbs";

const INTENSITY_CONFIG: Record<
  Intensity,
  { label: string; met: number; description: string }
> = {
  slow: {
    label: "Slow (< 100 skips/min)",
    met: 8.8,
    description: "Relaxed pace, under 100 skips per minute",
  },
  moderate: {
    label: "Moderate (100-120 skips/min)",
    met: 11.8,
    description: "Steady rhythm, 100-120 skips per minute",
  },
  fast: {
    label: "Fast (> 120 skips/min)",
    met: 12.3,
    description: "High tempo, over 120 skips per minute",
  },
  "double-unders": {
    label: "Double Unders",
    met: 14.0,
    description: "Advanced technique, rope passes twice per jump",
  },
};

const COMPARISON_ACTIVITIES: { name: string; met: number }[] = [
  { name: "Walking", met: 3.5 },
  { name: "Jogging", met: 7.0 },
  { name: "Cycling", met: 7.5 },
  { name: "Swimming", met: 6.0 },
];

const FOOD_EQUIVALENTS: { name: string; calories: number; unit: string }[] = [
  { name: "Slices of bread", calories: 79, unit: "slice" },
  { name: "Bananas", calories: 105, unit: "banana" },
  { name: "Tbsp peanut butter", calories: 94, unit: "tbsp" },
];

interface Results {
  totalCalories: number;
  caloriesPerMinute: number;
  durationMin: number;
  intensityLabel: string;
  weightKg: number;
  comparisons: { name: string; calories: number }[];
  foodEquivalents: { name: string; amount: number; unit: string }[];
  weeklyCalories: number;
  monthlyFatKg: number;
}

export default function JumpRopeCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("moderate");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("3");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const rawWeight = parseFloat(weight) || 70;
    const weightKg = weightUnit === "lbs" ? rawWeight * 0.453592 : rawWeight;
    const durationMin = parseFloat(duration) || 15;
    const durationHrs = durationMin / 60;
    const met = INTENSITY_CONFIG[intensity].met;

    const totalCalories = Math.round(met * weightKg * durationHrs);
    const caloriesPerMinute = Math.round((totalCalories / durationMin) * 10) / 10;

    const comparisons = COMPARISON_ACTIVITIES.map((a) => ({
      name: a.name,
      calories: Math.round(a.met * weightKg * durationHrs),
    }));

    const foodEquivalents = FOOD_EQUIVALENTS.map((f) => ({
      name: f.name,
      amount: Math.round((totalCalories / f.calories) * 10) / 10,
      unit: f.unit,
    }));

    const sessions = parseInt(sessionsPerWeek) || 3;
    const weeklyCalories = totalCalories * sessions;
    // 1 kg of fat ~ 7700 calories
    const monthlyFatKg =
      Math.round(((weeklyCalories * 4.33) / 7700) * 100) / 100;

    setResults({
      totalCalories,
      caloriesPerMinute,
      durationMin,
      intensityLabel: INTENSITY_CONFIG[intensity].label,
      weightKg: Math.round(weightKg * 10) / 10,
      comparisons,
      foodEquivalents,
      weeklyCalories,
      monthlyFatKg,
    });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Body Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="20"
              max="300"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={weightUnit === "kg" ? "e.g. 70" : "e.g. 154"}
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex border border-stone-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setWeightUnit("kg")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  weightUnit === "kg"
                    ? "bg-primary text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                kg
              </button>
              <button
                onClick={() => setWeightUnit("lbs")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  weightUnit === "lbs"
                    ? "bg-primary text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                lbs
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="180"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 15"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Intensity</label>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as Intensity)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {Object.entries(INTENSITY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-stone-400 mt-1">
            MET: {INTENSITY_CONFIG[intensity].met} &mdash;{" "}
            {INTENSITY_CONFIG[intensity].description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sessions per week (for projection)
          </label>
          <input
            type="number"
            min="1"
            max="14"
            value={sessionsPerWeek}
            onChange={(e) => setSessionsPerWeek(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Calories
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Total calories burned */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-sm text-orange-600 mb-1">Total Calories Burned</p>
            <p className="text-4xl font-bold text-orange-600">
              {results.totalCalories}
            </p>
            <p className="text-sm text-orange-500 mt-1">calories</p>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500 mb-0.5">Per Minute</p>
              <p className="text-xl font-bold">{results.caloriesPerMinute}</p>
              <p className="text-xs text-stone-400">cal/min</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500 mb-0.5">Duration</p>
              <p className="text-xl font-bold">{results.durationMin}</p>
              <p className="text-xs text-stone-400">minutes</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500 mb-0.5">Weight</p>
              <p className="text-xl font-bold">{results.weightKg}</p>
              <p className="text-xs text-stone-400">kg</p>
            </div>
          </div>

          {/* Comparison grid */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Comparison: {results.durationMin} minutes of other activities
            </p>
            <div className="grid grid-cols-2 gap-3">
              {results.comparisons.map((c) => (
                <div
                  key={c.name}
                  className="border border-stone-100 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-stone-500">{c.name}</p>
                  <p className="text-lg font-bold text-stone-700">
                    {c.calories} cal
                  </p>
                </div>
              ))}
              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-3 text-center col-span-2">
                <p className="text-xs text-orange-500">Jump Rope</p>
                <p className="text-lg font-bold text-orange-600">
                  {results.totalCalories} cal
                </p>
              </div>
            </div>
          </div>

          {/* Food equivalents */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Food Equivalent
            </p>
            <p className="text-sm text-stone-500">
              {results.totalCalories} calories is roughly equivalent to:
            </p>
            <div className="space-y-2">
              {results.foodEquivalents.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm border-b border-stone-100 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-stone-600">{f.name}</span>
                  <span className="font-medium text-stone-800">
                    ~{f.amount} {f.amount === 1 ? f.unit : f.unit + "s"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly projection */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Weekly Projection
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-stone-500 mb-0.5">
                  Calories / Week
                </p>
                <p className="text-2xl font-bold text-stone-800">
                  {results.weeklyCalories.toLocaleString()}
                </p>
                <p className="text-xs text-stone-400">
                  {sessionsPerWeek}x per week
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-stone-500 mb-0.5">
                  Fat Loss / Month
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  ~{results.monthlyFatKg} kg
                </p>
                <p className="text-xs text-stone-400">
                  based on caloric deficit alone
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400">
              Fat loss estimate assumes all excess calories come from fat stores
              (7,700 cal per kg). Actual results depend on diet and overall
              activity level.
            </p>
          </div>

          {/* Jump rope benefits */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Jump Rope Benefits
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex gap-2">
                <span className="text-orange-500 shrink-0">*</span>
                <span>
                  <strong>High calorie burn:</strong> Jump rope burns 25-50%
                  more calories per minute than most other cardio exercises at
                  similar perceived effort.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 shrink-0">*</span>
                <span>
                  <strong>Full-body workout:</strong> Engages calves, quads,
                  core, shoulders, and forearms simultaneously.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 shrink-0">*</span>
                <span>
                  <strong>Cardiovascular health:</strong> Rapidly improves heart
                  rate variability, VO2 max, and overall cardiovascular fitness.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 shrink-0">*</span>
                <span>
                  <strong>Coordination and agility:</strong> Improves timing,
                  footwork, and hand-eye coordination -- valuable for all
                  sports.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 shrink-0">*</span>
                <span>
                  <strong>Bone density:</strong> The low-level impact of jumping
                  stimulates bone growth, helping prevent osteoporosis.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 shrink-0">*</span>
                <span>
                  <strong>Portable and affordable:</strong> A jump rope costs
                  under $20, fits in a bag, and needs minimal space.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          About this calculator
        </p>
        <p>
          Calorie estimates use the MET (Metabolic Equivalent of Task) formula:
          Calories = MET x weight (kg) x duration (hours). MET values are based
          on the Compendium of Physical Activities. Actual calorie burn varies
          based on individual fitness level, technique, rest intervals, and
          environmental conditions. This tool provides estimates for
          informational purposes only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
