"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("running-calorie-calculator")!;

type Speed =
  | "jogging"
  | "running-6"
  | "running-7"
  | "running-8"
  | "running-9"
  | "running-10"
  | "running-11";

type Terrain = "flat" | "slight" | "hilly" | "trail";

const SPEED_OPTIONS: { value: Speed; label: string; met: number; kmh: number }[] = [
  { value: "jogging", label: "Jogging (8 km/h / 5 mph)", met: 8.0, kmh: 8 },
  { value: "running-6", label: "Running (9.5 km/h / 6 mph)", met: 9.8, kmh: 9.5 },
  { value: "running-7", label: "Running (11 km/h / 7 mph)", met: 11.0, kmh: 11 },
  { value: "running-8", label: "Running (12.5 km/h / 8 mph)", met: 11.8, kmh: 12.5 },
  { value: "running-9", label: "Running (14 km/h / 9 mph)", met: 12.8, kmh: 14 },
  { value: "running-10", label: "Running (16 km/h / 10 mph)", met: 14.5, kmh: 16 },
  { value: "running-11", label: "Running (17.5+ km/h / 11+ mph)", met: 16.0, kmh: 17.5 },
];

const TERRAIN_OPTIONS: { value: Terrain; label: string; multiplier: number }[] = [
  { value: "flat", label: "Flat", multiplier: 1.0 },
  { value: "slight", label: "Slight incline", multiplier: 1.15 },
  { value: "hilly", label: "Hilly", multiplier: 1.3 },
  { value: "trail", label: "Trail", multiplier: 1.2 },
];

const FOOD_COMPARISONS: { name: string; calories: number }[] = [
  { name: "slices of bread", calories: 79 },
  { name: "bananas", calories: 105 },
  { name: "eggs", calories: 78 },
  { name: "chocolate chip cookies", calories: 160 },
];

export default function RunningCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [duration, setDuration] = useState("");
  const [speed, setSpeed] = useState<Speed>("running-6");
  const [terrain, setTerrain] = useState<Terrain>("flat");
  const [result, setResult] = useState<{
    totalCalories: number;
    caloriesPerMinute: number;
    caloriesPerKm: number;
    caloriesPerMile: number;
    foodComparisons: { name: string; amount: string }[];
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || w <= 0 || !d || d <= 0) return;

    const kg = weightUnit === "lbs" ? w * 0.453592 : w;
    const hours = d / 60;

    const speedOption = SPEED_OPTIONS.find((s) => s.value === speed)!;
    const terrainOption = TERRAIN_OPTIONS.find((t) => t.value === terrain)!;

    const totalCalories = speedOption.met * kg * hours * terrainOption.multiplier;
    const caloriesPerMinute = totalCalories / d;
    const distanceKm = speedOption.kmh * hours;
    const distanceMiles = distanceKm * 0.621371;
    const caloriesPerKm = distanceKm > 0 ? totalCalories / distanceKm : 0;
    const caloriesPerMile = distanceMiles > 0 ? totalCalories / distanceMiles : 0;

    const foodComparisons = FOOD_COMPARISONS.map((food) => ({
      name: food.name,
      amount: (totalCalories / food.calories).toFixed(1),
    }));

    setResult({
      totalCalories: Math.round(totalCalories),
      caloriesPerMinute: Math.round(caloriesPerMinute * 10) / 10,
      caloriesPerKm: Math.round(caloriesPerKm),
      caloriesPerMile: Math.round(caloriesPerMile),
      foodComparisons,
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

        {/* Speed */}
        <div>
          <label className="block text-sm font-medium mb-1">Speed / Pace</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value as Speed)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {SPEED_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Terrain */}
        <div>
          <label className="block text-sm font-medium mb-1">Terrain</label>
          <select
            value={terrain}
            onChange={(e) => setTerrain(e.target.value as Terrain)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {TERRAIN_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label} ({t.multiplier}x)
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
              <p className="text-sm text-stone-500">Calories per km / mile</p>
              <p className="text-3xl font-bold">{result.caloriesPerKm}</p>
              <p className="text-xs text-stone-400">
                kcal/km ({result.caloriesPerMile} kcal/mi)
              </p>
            </div>
          </div>

          <div className="mt-4 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
            <p className="font-medium text-stone-700 mb-2">Food Equivalents</p>
            <p>
              Your run burned the equivalent of{" "}
              {result.foodComparisons
                .map((f) => `${f.amount} ${f.name}`)
                .join(", or ")}
              .
            </p>
          </div>
        </>
      )}
    </ToolPageLayout>
  );
}
