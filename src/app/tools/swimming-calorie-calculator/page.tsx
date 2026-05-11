"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("swimming-calorie-calculator")!;

type StrokeType =
  | "freestyle-light"
  | "freestyle-moderate"
  | "freestyle-vigorous"
  | "backstroke"
  | "breaststroke"
  | "butterfly"
  | "treading"
  | "water-aerobics"
  | "leisure";

const STROKE_OPTIONS: { value: StrokeType; label: string; met: number }[] = [
  { value: "freestyle-light", label: "Freestyle (light)", met: 6.0 },
  { value: "freestyle-moderate", label: "Freestyle (moderate)", met: 8.3 },
  { value: "freestyle-vigorous", label: "Freestyle (vigorous)", met: 9.8 },
  { value: "backstroke", label: "Backstroke (moderate)", met: 7.0 },
  { value: "breaststroke", label: "Breaststroke (moderate)", met: 7.0 },
  { value: "butterfly", label: "Butterfly", met: 13.8 },
  { value: "treading", label: "Treading water (moderate)", met: 3.5 },
  { value: "water-aerobics", label: "Water aerobics", met: 5.3 },
  { value: "leisure", label: "Leisure / recreational", met: 6.0 },
];

export default function SwimmingCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [duration, setDuration] = useState("");
  const [stroke, setStroke] = useState<StrokeType>("freestyle-moderate");
  const [result, setResult] = useState<{
    totalCalories: number;
    caloriesPerMinute: number;
    caloriesPer30Min: number;
    comparisonText: string;
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || w <= 0 || !d || d <= 0) return;

    const kg = weightUnit === "lbs" ? w * 0.453592 : w;
    const hours = d / 60;

    const strokeOption = STROKE_OPTIONS.find((s) => s.value === stroke)!;

    const totalCalories = strokeOption.met * kg * hours;
    const caloriesPerMinute = totalCalories / d;
    const caloriesPer30Min = caloriesPerMinute * 30;

    const butterfly = STROKE_OPTIONS.find((s) => s.value === "butterfly")!;
    const butterflyCalories = Math.round(butterfly.met * kg * hours);
    const freestyleMod = STROKE_OPTIONS.find((s) => s.value === "freestyle-moderate")!;
    const freestyleCalories = Math.round(freestyleMod.met * kg * hours);
    const backstrokeOpt = STROKE_OPTIONS.find((s) => s.value === "backstroke")!;
    const backstrokeCalories = Math.round(backstrokeOpt.met * kg * hours);

    const comparisonText =
      `For the same duration, butterfly burns the most at ~${butterflyCalories} kcal, ` +
      `followed by freestyle (moderate) at ~${freestyleCalories} kcal ` +
      `and backstroke at ~${backstrokeCalories} kcal.`;

    setResult({
      totalCalories: Math.round(totalCalories),
      caloriesPerMinute: Math.round(caloriesPerMinute * 10) / 10,
      caloriesPer30Min: Math.round(caloriesPer30Min),
      comparisonText,
    });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={weightUnit === "kg" ? "70" : "154"}
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
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Stroke / Activity */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Stroke / Activity Type
          </label>
          <select
            value={stroke}
            onChange={(e) => setStroke(e.target.value as StrokeType)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {STROKE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate
        </button>
      </div>

      {result && (
        <>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-primary/30 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-500">Total Calories Burned</p>
              <p className="text-3xl font-bold text-primary">
                {result.totalCalories.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400">kcal</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-500">Calories per Minute</p>
              <p className="text-3xl font-bold">{result.caloriesPerMinute}</p>
              <p className="text-xs text-stone-400">kcal/min</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-500">Per 30 Minutes</p>
              <p className="text-3xl font-bold">{result.caloriesPer30Min}</p>
              <p className="text-xs text-stone-400">kcal/30 min</p>
            </div>
          </div>

          <div className="mt-4 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
            <p className="font-medium text-stone-700 mb-2">
              Stroke Comparison
            </p>
            <p>{result.comparisonText}</p>
          </div>
        </>
      )}
    </ToolPageLayout>
  );
}
