"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("calorie-deficit-calculator")!;

type Sex = "male" | "female";
type HeightUnit = "cm" | "ft";
type WeightUnit = "kg" | "lbs";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extreme";

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Lightly active (1-3 days/week)",
  moderate: "Moderately active (3-5 days/week)",
  very: "Very active (6-7 days/week)",
  extreme: "Extremely active (twice/day or physical job)",
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};

interface DeficitOption {
  label: string;
  deficit: number;
  weeklyLossKg: number;
  dailyTarget: number;
  weeksToGoal: number;
  goalDate: string;
  belowMinimum: boolean;
}

interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
}

interface Results {
  bmr: number;
  tdee: number;
  options: DeficitOption[];
  macros: MacroBreakdown;
  sex: Sex;
}

function formatDate(weeksFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.round(weeksFromNow * 7));
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CalorieDeficitCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [results, setResults] = useState<Results | null>(null);

  function getHeightCm(): number {
    if (heightUnit === "cm") return Number(heightCm) || 0;
    const ft = Number(heightFt) || 0;
    const inches = Number(heightIn) || 0;
    return ft * 30.48 + inches * 2.54;
  }

  function getWeightKg(value: string): number {
    const n = Number(value) || 0;
    return weightUnit === "kg" ? n : n * 0.453592;
  }

  function calculate() {
    const ageNum = Number(age) || 0;
    const h = getHeightCm();
    const w = getWeightKg(currentWeight);
    const gw = getWeightKg(goalWeight);

    if (ageNum <= 0 || h <= 0 || w <= 0 || gw <= 0) return;

    // Mifflin-St Jeor
    const bmr =
      sex === "male"
        ? 10 * w + 6.25 * h - 5 * ageNum - 5
        : 10 * w + 6.25 * h - 5 * ageNum - 161;

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
    const weightToLose = w - gw;

    const deficits = [
      { label: "Mild deficit", deficit: 250, weeklyLossKg: 0.25 },
      { label: "Moderate deficit", deficit: 500, weeklyLossKg: 0.5 },
      { label: "Aggressive deficit", deficit: 750, weeklyLossKg: 0.75 },
    ];

    const minimumCal = sex === "male" ? 1500 : 1200;

    const options: DeficitOption[] = deficits.map((d) => {
      const dailyTarget = Math.round(tdee - d.deficit);
      const weeklyLossKg = d.deficit / 7700 * 7;
      const weeksToGoal =
        weightToLose > 0 ? Math.ceil(weightToLose / weeklyLossKg) : 0;
      return {
        label: d.label,
        deficit: d.deficit,
        weeklyLossKg: Math.round(weeklyLossKg * 100) / 100,
        dailyTarget,
        weeksToGoal,
        goalDate: formatDate(weeksToGoal),
        belowMinimum: dailyTarget < minimumCal,
      };
    });

    // Macro breakdown for moderate deficit (index 1)
    const moderateTarget = options[1].dailyTarget;
    const proteinCal = moderateTarget * 0.3;
    const carbsCal = moderateTarget * 0.4;
    const fatCal = moderateTarget * 0.3;

    const macros: MacroBreakdown = {
      protein: Math.round(proteinCal / 4),
      carbs: Math.round(carbsCal / 4),
      fat: Math.round(fatCal / 9),
    };

    setResults({ bmr: Math.round(bmr), tdee: Math.round(tdee), options, macros, sex });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Sex */}
        <div>
          <label className="block text-sm font-medium mb-2">Sex</label>
          <div className="flex gap-4">
            {(["male", "female"] as Sex[]).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  checked={sex === s}
                  onChange={() => setSex(s)}
                  className="accent-primary"
                />
                <span className="text-sm capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 30"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Height</label>
            <button
              type="button"
              onClick={() => setHeightUnit(heightUnit === "cm" ? "ft" : "cm")}
              className="text-xs text-primary hover:underline"
            >
              Switch to {heightUnit === "cm" ? "ft/in" : "cm"}
            </button>
          </div>
          {heightUnit === "cm" ? (
            <input
              type="number"
              min="50"
              max="300"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 175"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="8"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="ft"
                className="w-1/2 border border-stone-300 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                min="0"
                max="11"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="in"
                className="w-1/2 border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Current Weight */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Current weight</label>
            <button
              type="button"
              onClick={() => setWeightUnit(weightUnit === "kg" ? "lbs" : "kg")}
              className="text-xs text-primary hover:underline"
            >
              Switch to {weightUnit === "kg" ? "lbs" : "kg"}
            </button>
          </div>
          <input
            type="number"
            min="20"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder={weightUnit === "kg" ? "e.g. 85" : "e.g. 187"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Goal Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Goal weight ({weightUnit})
          </label>
          <input
            type="number"
            min="20"
            value={goalWeight}
            onChange={(e) => setGoalWeight(e.target.value)}
            placeholder={weightUnit === "kg" ? "e.g. 75" : "e.g. 165"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium mb-1">Activity level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as ActivityLevel)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((k) => (
              <option key={k} value={k}>
                {ACTIVITY_LABELS[k]}
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

      {results && (
        <div className="mt-6 space-y-4">
          {/* TDEE */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Your maintenance calories (TDEE)
            </p>
            <p className="text-3xl font-bold">{results.tdee} cal/day</p>
            <p className="text-xs text-stone-400 mt-1">
              BMR: {results.bmr} cal/day
            </p>
          </div>

          {/* Deficit options grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {results.options.map((opt, i) => {
              const bg =
                i === 0
                  ? "bg-green-50 border-green-200"
                  : i === 1
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200";
              return (
                <div key={i} className={`border rounded-xl p-4 space-y-2 ${bg}`}>
                  <p className="text-sm font-semibold text-stone-700">
                    {opt.label}
                  </p>
                  <p className="text-xs text-stone-500">
                    -{opt.deficit} cal/day (~{opt.weeklyLossKg} kg/week)
                  </p>
                  <p className="text-2xl font-bold">{opt.dailyTarget} cal</p>
                  {opt.weeksToGoal > 0 ? (
                    <>
                      <p className="text-sm text-stone-600">
                        {opt.weeksToGoal} weeks to goal
                      </p>
                      <p className="text-xs text-stone-500">
                        Target date: {opt.goalDate}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-stone-600">
                      You are already at or below your goal weight.
                    </p>
                  )}
                  {opt.belowMinimum && (
                    <p className="text-xs font-medium text-red-600 mt-1">
                      Warning: Below the recommended minimum of{" "}
                      {results.sex === "male" ? "1,500" : "1,200"} cal/day.
                      Consult a healthcare provider.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Macro breakdown for moderate deficit */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Suggested macro breakdown (moderate deficit:{" "}
              {results.options[1].dailyTarget} cal/day)
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-stone-500">Protein (30%)</p>
                <p className="text-xl font-bold">{results.macros.protein}g</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-stone-500">Carbs (40%)</p>
                <p className="text-xl font-bold">{results.macros.carbs}g</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-stone-500">Fat (30%)</p>
                <p className="text-xl font-bold">{results.macros.fat}g</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          About calorie deficits
        </p>
        <p className="mb-2">
          A calorie deficit occurs when you consume fewer calories than your body
          burns. This calculator uses the Mifflin-St Jeor equation, which is
          considered one of the most accurate methods for estimating basal
          metabolic rate (BMR). Your Total Daily Energy Expenditure (TDEE) is
          then calculated by multiplying BMR by an activity factor.
        </p>
        <p className="mb-2">
          A deficit of 500 calories per day results in roughly 0.5 kg (1 lb) of
          fat loss per week, since one kilogram of body fat stores approximately
          7,700 calories. The three deficit levels shown offer different
          trade-offs between speed and sustainability.
        </p>
        <p>
          Very low calorie diets (below 1,200 for women or 1,500 for men) can
          lead to nutritional deficiencies and should only be followed under
          medical supervision. This tool provides estimates for informational
          purposes only and is not medical advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
