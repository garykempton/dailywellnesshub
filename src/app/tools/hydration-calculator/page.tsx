"use client";

import { useState } from "react";
import Link from "next/link";

export default function HydrationCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [activity, setActivity] = useState<"sedentary" | "moderate" | "active" | "very-active">("moderate");
  const [climate, setClimate] = useState<"temperate" | "hot" | "very-hot">("temperate");
  const [result, setResult] = useState<{ litres: number; glasses: number } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    const kg = unit === "lbs" ? w * 0.453592 : w;

    // Base: ~33ml per kg of body weight
    let ml = kg * 33;

    // Activity multiplier
    const activityMult: Record<string, number> = {
      sedentary: 0.9,
      moderate: 1.0,
      active: 1.2,
      "very-active": 1.4,
    };
    ml *= activityMult[activity] || 1;

    // Climate adjustment
    const climateMult: Record<string, number> = {
      temperate: 1.0,
      hot: 1.15,
      "very-hot": 1.3,
    };
    ml *= climateMult[climate] || 1;

    const litres = Math.round(ml / 100) / 10;
    const glasses = Math.round(ml / 250);
    setResult({ litres, glasses });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/tools" className="text-sm text-primary hover:underline mb-4 inline-block">
        &larr; All Tools
      </Link>
      <h1 className="text-3xl font-bold mb-2">Hydration Calculator</h1>
      <p className="text-stone-500 mb-6">
        Estimate how much water you should aim to drink daily based on your
        weight, activity level, and climate. Individual needs vary.
      </p>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Weight</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "kg" ? "70" : "154"}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "kg" | "lbs")}
              className="border border-stone-300 rounded-lg px-3 py-2"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as typeof activity)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            <option value="sedentary">Sedentary (little exercise)</option>
            <option value="moderate">Moderate (light exercise 2-3x/week)</option>
            <option value="active">Active (exercise 4-5x/week)</option>
            <option value="very-active">Very Active (daily intense exercise)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Climate</label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as typeof climate)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            <option value="temperate">Temperate / Cool</option>
            <option value="hot">Hot / Humid</option>
            <option value="very-hot">Very Hot / Tropical</option>
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
        <div className="mt-6 bg-white border border-stone-200 rounded-xl p-6 text-center">
          <p className="text-sm text-stone-500 mb-1">Estimated daily intake</p>
          <p className="text-5xl font-bold">{result.litres}L</p>
          <p className="text-lg text-stone-600 mt-1">
            ~{result.glasses} glasses (250ml each)
          </p>
          <p className="text-sm text-stone-400 mt-4 max-w-md mx-auto">
            This is a general estimate. Your actual needs may differ based on
            health conditions, medications, and other factors. Drink when you
            feel thirsty and monitor urine colour as a guide.
          </p>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">Disclaimer</p>
        <p>
          This calculator provides a rough estimate only. Water needs vary
          significantly based on individual health, diet, medications, and
          conditions. This is not medical advice. Consult a healthcare
          professional for personalised hydration guidance.
        </p>
      </div>
    </div>
  );
}
