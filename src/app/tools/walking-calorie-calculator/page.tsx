"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("walking-calorie-calculator")!;

type Speed = "slow" | "moderate" | "brisk" | "fast" | "very-fast";
type Terrain = "flat" | "slight" | "moderate" | "steep";

const SPEED_OPTIONS: { value: Speed; label: string; kmh: number; met: number }[] = [
  { value: "slow", label: "Slow (3 km/h)", kmh: 3, met: 2.0 },
  { value: "moderate", label: "Moderate (4.8 km/h)", kmh: 4.8, met: 3.5 },
  { value: "brisk", label: "Brisk (5.6 km/h)", kmh: 5.6, met: 4.3 },
  { value: "fast", label: "Fast (6.4 km/h)", kmh: 6.4, met: 5.0 },
  { value: "very-fast", label: "Very Fast (7.2 km/h)", kmh: 7.2, met: 6.3 },
];

const TERRAIN_OPTIONS: { value: Terrain; label: string; multiplier: number }[] = [
  { value: "flat", label: "Flat", multiplier: 1.0 },
  { value: "slight", label: "Slight incline", multiplier: 1.2 },
  { value: "moderate", label: "Moderate incline", multiplier: 1.5 },
  { value: "steep", label: "Steep incline", multiplier: 1.8 },
];

export default function WalkingCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [duration, setDuration] = useState("");
  const [speed, setSpeed] = useState<Speed>("moderate");
  const [terrain, setTerrain] = useState<Terrain>("flat");
  const [result, setResult] = useState<{
    totalCalories: number;
    caloriesPerMinute: number;
    distance: number;
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || w <= 0 || !d || d <= 0) return;

    const kg = weightUnit === "lbs" ? w * 0.453592 : w;
    const hours = d / 60;

    const speedOption = SPEED_OPTIONS.find((s) => s.value === speed)!;
    const terrainOption = TERRAIN_OPTIONS.find((t) => t.value === terrain)!;

    // Calories = MET x weight(kg) x duration(hours) x terrainMultiplier
    const totalCalories = speedOption.met * kg * hours * terrainOption.multiplier;
    const caloriesPerMinute = totalCalories / d;
    const distance = speedOption.kmh * hours;

    setResult({
      totalCalories: Math.round(totalCalories),
      caloriesPerMinute: Math.round(caloriesPerMinute * 10) / 10,
      distance: Math.round(distance * 100) / 100,
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
          <label className="block text-sm font-medium mb-1">Walking Speed</label>
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
            <p className="text-sm text-stone-500">Equivalent Distance</p>
            <p className="text-3xl font-bold">{result.distance}</p>
            <p className="text-xs text-stone-400">km</p>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
