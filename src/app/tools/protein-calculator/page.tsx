"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("protein-calculator")!;

type Unit = "metric" | "imperial";

type Goal =
  | "sedentary"
  | "recreational"
  | "endurance"
  | "strength"
  | "weight-loss"
  | "older-adult";

const GOAL_LABELS: Record<Goal, string> = {
  sedentary: "Sedentary adult",
  recreational: "Recreational exerciser",
  endurance: "Endurance athlete",
  strength: "Strength / muscle building",
  "weight-loss": "Weight loss (preserving muscle)",
  "older-adult": "Older adult (50+)",
};

const MULTIPLIERS: Record<Goal, [number, number]> = {
  sedentary: [0.8, 0.8],
  recreational: [1.2, 1.2],
  endurance: [1.2, 1.4],
  strength: [1.6, 2.2],
  "weight-loss": [1.6, 2.4],
  "older-adult": [1.2, 1.5],
};

interface Result {
  low: number;
  high: number;
  isRange: boolean;
  perMeal3Low: number;
  perMeal3High: number;
  perMeal4Low: number;
  perMeal4High: number;
  chickenBreastsLow: number;
  chickenBreastsHigh: number;
  eggsLow: number;
  eggsHigh: number;
  wheyScoopsLow: number;
  wheyScoopsHigh: number;
  yoghurtLow: number;
  yoghurtHigh: number;
}

export default function ProteinCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<Unit>("metric");
  const [goal, setGoal] = useState<Goal>("strength");
  const [age, setAge] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [ageSuggestion, setAgeSuggestion] = useState(false);

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    const weightKg = unit === "imperial" ? w * 0.453592 : w;

    let selectedGoal = goal;
    const ageNum = parseInt(age);
    const isOlder = ageNum >= 50;

    // If user is 50+ and hasn't already selected older-adult, show suggestion
    if (isOlder && goal !== "older-adult") {
      setAgeSuggestion(true);
    } else {
      setAgeSuggestion(false);
    }

    const [lowMult, highMult] = MULTIPLIERS[selectedGoal];
    const low = Math.round(weightKg * lowMult);
    const high = Math.round(weightKg * highMult);
    const isRange = lowMult !== highMult;

    // Use high end for food equivalents (midpoint for range, exact for single value)
    const midProtein = isRange ? Math.round((low + high) / 2) : low;

    setResult({
      low,
      high,
      isRange,
      perMeal3Low: Math.round(low / 3),
      perMeal3High: Math.round(high / 3),
      perMeal4Low: Math.round(low / 4),
      perMeal4High: Math.round(high / 4),
      chickenBreastsLow: Math.round((midProtein / 31) * 10) / 10,
      chickenBreastsHigh: Math.round((midProtein / 31) * 10) / 10,
      eggsLow: Math.round(midProtein / 6),
      eggsHigh: Math.round(midProtein / 6),
      wheyScoopsLow: Math.round((midProtein / 25) * 10) / 10,
      wheyScoopsHigh: Math.round((midProtein / 25) * 10) / 10,
      yoghurtLow: Math.round((midProtein / 10) * 100),
      yoghurtHigh: Math.round((midProtein / 10) * 100),
    });
  }

  function formatRange(low: number, high: number, isRange: boolean): string {
    return isRange ? `${low}-${high}` : `${low}`;
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Unit toggle */}
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button
              key={u}
              onClick={() => {
                setUnit(u);
                setResult(null);
                setAgeSuggestion(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                unit === u
                  ? "bg-primary text-white border-primary"
                  : "border-stone-300 hover:border-stone-500"
              }`}
            >
              {u === "metric" ? "Metric (kg)" : "Imperial (lbs)"}
            </button>
          ))}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Body weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "70" : "154"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium mb-1">Goal</label>
          <select
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value as Goal);
              setResult(null);
              setAgeSuggestion(false);
            }}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => {
              const [lo, hi] = MULTIPLIERS[g];
              const label =
                lo === hi
                  ? `${GOAL_LABELS[g]} (${lo}g/kg)`
                  : `${GOAL_LABELS[g]} (${lo}-${hi}g/kg)`;
              return (
                <option key={g} value={g}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Age (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Age (optional)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Protein Needs
        </button>
      </div>

      {/* Age suggestion */}
      {ageSuggestion && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          You are 50 or older. Consider selecting the &quot;Older adult (50+)&quot;
          goal for recommendations that account for age-related increases in protein
          needs (1.2-1.5g/kg) to help prevent sarcopenia.
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Daily target */}
          <div className="bg-white border border-primary/30 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Daily Protein Target
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatRange(result.low, result.high, result.isRange)}g
            </p>
            <p className="text-xs text-stone-400">grams per day</p>
          </div>

          {/* Per meal */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Per Meal (3 meals)</p>
              <p className="text-3xl font-bold">
                {formatRange(
                  result.perMeal3Low,
                  result.perMeal3High,
                  result.isRange
                )}
                g
              </p>
              <p className="text-xs text-stone-400">per meal</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Per Meal (4 meals)</p>
              <p className="text-3xl font-bold">
                {formatRange(
                  result.perMeal4Low,
                  result.perMeal4High,
                  result.isRange
                )}
                g
              </p>
              <p className="text-xs text-stone-400">per meal</p>
            </div>
          </div>

          {/* Visual protein source examples */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              What does{" "}
              {formatRange(result.low, result.high, result.isRange)}g of
              protein look like?
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-3">
                <span className="text-2xl">🍗</span>
                <div>
                  <p className="font-medium">
                    ~{result.chickenBreastsLow} chicken breasts
                  </p>
                  <p className="text-stone-400">31g protein each</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-3">
                <span className="text-2xl">🥚</span>
                <div>
                  <p className="font-medium">~{result.eggsLow} eggs</p>
                  <p className="text-stone-400">6g protein each</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-3">
                <span className="text-2xl">🥤</span>
                <div>
                  <p className="font-medium">
                    ~{result.wheyScoopsLow} scoops of whey
                  </p>
                  <p className="text-stone-400">25g protein each</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-3">
                <span className="text-2xl">🥛</span>
                <div>
                  <p className="font-medium">
                    ~{result.yoghurtLow}g Greek yoghurt
                  </p>
                  <p className="text-stone-400">10g protein per 100g</p>
                </div>
              </div>
            </div>
          </div>

          {/* Multiplier reference */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              Protein Needs by Goal
            </h3>
            <div className="space-y-2 text-sm">
              {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => {
                const [lo, hi] = MULTIPLIERS[g];
                const rangeStr =
                  lo === hi ? `${lo}g/kg` : `${lo}-${hi}g/kg`;
                return (
                  <div
                    key={g}
                    className={`flex justify-between py-1 px-2 rounded ${
                      goal === g ? "bg-primary/10 font-medium" : ""
                    }`}
                  >
                    <span>{GOAL_LABELS[g]}</span>
                    <span className="text-stone-500">{rangeStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About this calculator</p>
        <p>
          Protein recommendations are based on current sports nutrition research and
          position stands from the International Society of Sports Nutrition (ISSN).
          Individual needs may vary based on training intensity, calorie intake, body
          composition, and health conditions. Consult a registered dietitian or
          healthcare professional for personalised nutrition advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
