"use client";

import { useState } from "react";
import Link from "next/link";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("macro-calculator")!;

type Goal = "weight-loss" | "maintenance" | "muscle-gain";
type Diet = "balanced" | "high-protein" | "low-carb" | "keto";

const GOAL_LABELS: Record<Goal, string> = {
  "weight-loss": "Weight Loss",
  maintenance: "Maintenance",
  "muscle-gain": "Muscle Gain",
};

const DIET_LABELS: Record<Diet, string> = {
  balanced: "Balanced",
  "high-protein": "High Protein",
  "low-carb": "Low Carb",
  keto: "Keto",
};

const MACRO_SPLITS: Record<Goal, Record<Diet, { p: number; c: number; f: number }>> = {
  "weight-loss": {
    balanced: { p: 40, c: 30, f: 30 },
    "high-protein": { p: 45, c: 25, f: 30 },
    "low-carb": { p: 40, c: 20, f: 40 },
    keto: { p: 30, c: 5, f: 65 },
  },
  maintenance: {
    balanced: { p: 30, c: 40, f: 30 },
    "high-protein": { p: 35, c: 35, f: 30 },
    "low-carb": { p: 35, c: 25, f: 40 },
    keto: { p: 25, c: 5, f: 70 },
  },
  "muscle-gain": {
    balanced: { p: 30, c: 45, f: 25 },
    "high-protein": { p: 35, c: 40, f: 25 },
    "low-carb": { p: 35, c: 30, f: 35 },
    keto: { p: 30, c: 5, f: 65 },
  },
};

interface MacroResult {
  calories: number;
  goal: Goal;
  split: { p: number; c: number; f: number };
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

export default function MacroCalculatorPage() {
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState<Goal>("maintenance");
  const [diet, setDiet] = useState<Diet>("balanced");
  const [result, setResult] = useState<MacroResult | null>(null);

  function calculate() {
    const cal = parseInt(calories);
    if (!cal || cal <= 0) return;

    const split = MACRO_SPLITS[goal][diet];
    const proteinGrams = Math.round((cal * split.p) / 100 / 4);
    const carbGrams = Math.round((cal * split.c) / 100 / 4);
    const fatGrams = Math.round((cal * split.f) / 100 / 9);

    setResult({
      calories: cal,
      goal,
      split,
      proteinGrams,
      carbGrams,
      fatGrams,
    });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        {/* Daily Calories Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Daily Calories (kcal)
          </label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="2000"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Goal Selector - Pill Buttons */}
        <div>
          <label className="block text-sm font-medium mb-2">Goal</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  goal === g
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Diet Preference - Select */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Diet Preference
          </label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value as Diet)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(DIET_LABELS) as Diet[]).map((d) => (
              <option key={d} value={d}>
                {DIET_LABELS[d]}
              </option>
            ))}
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Macros
        </button>

        {/* Link to calorie calculator */}
        <p className="text-sm text-stone-500 text-center">
          Don&apos;t know your daily calories?{" "}
          <Link
            href="/tools/calorie-calculator"
            className="text-primary hover:underline font-medium"
          >
            Use our Calorie Calculator first
          </Link>
          .
        </p>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Summary */}
          <p className="text-center text-stone-600 font-medium">
            Based on {result.calories.toLocaleString()} kcal/day for{" "}
            {GOAL_LABELS[result.goal].toLowerCase()}
          </p>

          {/* Macro Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Protein Card */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">P</span>
              </div>
              <p className="text-sm text-blue-600 font-medium">Protein</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">
                {result.proteinGrams}g
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {result.split.p}% &middot;{" "}
                {Math.round((result.calories * result.split.p) / 100)} kcal
              </p>
            </div>

            {/* Carbs Card */}
            <div className="bg-white border-2 border-amber-200 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-600 font-bold text-lg">C</span>
              </div>
              <p className="text-sm text-amber-600 font-medium">Carbs</p>
              <p className="text-3xl font-bold text-amber-700 mt-1">
                {result.carbGrams}g
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {result.split.c}% &middot;{" "}
                {Math.round((result.calories * result.split.c) / 100)} kcal
              </p>
            </div>

            {/* Fat Card */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">F</span>
              </div>
              <p className="text-sm text-purple-600 font-medium">Fat</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">
                {result.fatGrams}g
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {result.split.f}% &middot;{" "}
                {Math.round((result.calories * result.split.f) / 100)} kcal
              </p>
            </div>
          </div>

          {/* Horizontal Stacked Bar Chart */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              Macro Distribution
            </h3>
            <div className="w-full h-8 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.split.p}%` }}
              >
                {result.split.p}% P
              </div>
              <div
                className="bg-amber-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.split.c}%` }}
              >
                {result.split.c}% C
              </div>
              <div
                className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.split.f}%` }}
              >
                {result.split.f}% F
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" />
                Protein
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" />
                Carbs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full inline-block" />
                Fat
              </span>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
