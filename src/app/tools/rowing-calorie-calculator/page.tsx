"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("rowing-calorie-calculator")!;

type RowingType = "indoor" | "outdoor";

interface IntensityOption {
  value: string;
  label: string;
  met: number;
  splitSeconds: number; // seconds per 500m
}

const INDOOR_OPTIONS: IntensityOption[] = [
  { value: "light", label: "Light (50W)", met: 4.8, splitSeconds: 150 },
  { value: "moderate", label: "Moderate (100W)", met: 7.0, splitSeconds: 130 },
  { value: "vigorous", label: "Vigorous (150W)", met: 8.5, splitSeconds: 115 },
  { value: "very-vigorous", label: "Very Vigorous (200W+)", met: 12.0, splitSeconds: 105 },
];

const OUTDOOR_OPTIONS: IntensityOption[] = [
  { value: "recreational", label: "Recreational", met: 5.3, splitSeconds: 150 },
  { value: "moderate", label: "Moderate", met: 7.0, splitSeconds: 130 },
  { value: "competitive", label: "Competitive", met: 12.0, splitSeconds: 105 },
];

const COMPARISON_ACTIVITIES = [
  { name: "Running", met: 9.8 },
  { name: "Cycling", met: 7.5 },
  { name: "Swimming", met: 6.0 },
  { name: "Walking", met: 3.5 },
];

function formatSplit(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RowingCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [duration, setDuration] = useState("");
  const [rowingType, setRowingType] = useState<RowingType>("indoor");
  const [indoorIntensity, setIndoorIntensity] = useState("moderate");
  const [outdoorIntensity, setOutdoorIntensity] = useState("moderate");

  const [result, setResult] = useState<{
    calories: number;
    caloriesPerMinute: number;
    distance: number;
    splitSeconds: number;
    comparisons: { name: string; calories: number }[];
    weeklyCalories: number;
    weeklyDistance: number;
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || w <= 0 || !d || d <= 0) return;

    const kg = weightUnit === "lbs" ? w * 0.453592 : w;
    const hours = d / 60;

    const options = rowingType === "indoor" ? INDOOR_OPTIONS : OUTDOOR_OPTIONS;
    const intensityValue = rowingType === "indoor" ? indoorIntensity : outdoorIntensity;
    const option = options.find((o) => o.value === intensityValue)!;

    const calories = Math.round(option.met * kg * hours);
    const caloriesPerMinute = Math.round((calories / d) * 10) / 10;

    // Distance: (duration_seconds / split_per_500m) * 500
    const durationSeconds = d * 60;
    const distance = Math.round((durationSeconds / option.splitSeconds) * 500);

    const comparisons = COMPARISON_ACTIVITIES.map((a) => ({
      name: a.name,
      calories: Math.round(a.met * kg * hours),
    }));

    // Weekly projection (3 sessions)
    const weeklyCalories = calories * 3;
    const weeklyDistance = distance * 3;

    setResult({
      calories,
      caloriesPerMinute,
      distance,
      splitSeconds: option.splitSeconds,
      comparisons,
      weeklyCalories,
      weeklyDistance,
    });
  }

  const currentOptions = rowingType === "indoor" ? INDOOR_OPTIONS : OUTDOOR_OPTIONS;
  const currentIntensity = rowingType === "indoor" ? indoorIntensity : outdoorIntensity;

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

        {/* Rowing Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Rowing Type</label>
          <select
            value={rowingType}
            onChange={(e) => {
              setRowingType(e.target.value as RowingType);
              setResult(null);
            }}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            <option value="indoor">Indoor Rowing Machine</option>
            <option value="outdoor">Outdoor / On-Water Rowing</option>
          </select>
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm font-medium mb-1">Intensity</label>
          <select
            value={currentIntensity}
            onChange={(e) => {
              if (rowingType === "indoor") {
                setIndoorIntensity(e.target.value);
              } else {
                setOutdoorIntensity(e.target.value);
              }
              setResult(null);
            }}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {currentOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} (MET {o.met})
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
          {/* Big calorie number */}
          <div className="mt-6 bg-white border border-blue-300 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500">Total Calories Burned</p>
            <p className="text-4xl font-bold text-blue-600">
              {result.calories.toLocaleString()}
            </p>
            <p className="text-xs text-stone-400">kcal</p>
          </div>

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Estimated Distance</p>
              <p className="text-2xl font-bold">
                {(result.distance / 1000).toFixed(1)}
              </p>
              <p className="text-xs text-stone-400">km ({result.distance.toLocaleString()}m)</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Avg 500m Split</p>
              <p className="text-2xl font-bold">
                {formatSplit(result.splitSeconds)}
              </p>
              <p className="text-xs text-stone-400">min/500m</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Calories per Minute</p>
              <p className="text-2xl font-bold">{result.caloriesPerMinute}</p>
              <p className="text-xs text-stone-400">kcal/min</p>
            </div>
          </div>

          {/* Comparison grid */}
          <div className="mt-4 bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-700">
              Calories vs Other Cardio ({duration} min)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {result.comparisons.map((c) => (
                <div
                  key={c.name}
                  className="bg-stone-50 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-stone-500">{c.name}</p>
                  <p className="text-xl font-bold">{c.calories}</p>
                  <p className="text-xs text-stone-400">kcal</p>
                </div>
              ))}
            </div>
          </div>

          {/* Muscles worked */}
          <div className="mt-4 bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-700">Muscles Worked</p>
            <div className="space-y-3">
              {[
                { group: "Legs (quads, hamstrings, calves)", pct: 60 },
                { group: "Back & Core (lats, erectors, abs)", pct: 20 },
                { group: "Arms (biceps, forearms, shoulders)", pct: 20 },
              ].map((m) => (
                <div key={m.group}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">{m.group}</span>
                    <span className="font-semibold text-stone-700">{m.pct}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-500">
              Rowing is one of the few exercises that engages roughly 86% of all
              muscles in the body, making it an exceptionally efficient full-body
              workout.
            </p>
          </div>

          {/* Weekly projection */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-stone-600">
            <p className="font-semibold text-blue-700 mb-1">
              Weekly Projection (3 sessions)
            </p>
            <p>
              Rowing {duration} minutes three times per week would burn
              approximately{" "}
              <span className="font-semibold">
                {result.weeklyCalories.toLocaleString()} calories
              </span>{" "}
              and cover about{" "}
              <span className="font-semibold">
                {(result.weeklyDistance / 1000).toFixed(1)} km
              </span>{" "}
              of rowing distance.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-4 bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-700">Why Rowing Is Efficient</p>
            <p className="text-sm text-stone-600">
              Rowing delivers a low-impact, full-body workout that simultaneously
              builds cardiovascular endurance and muscular strength. Unlike running,
              it places minimal stress on joints while engaging the legs, core, and
              upper body in a smooth, continuous motion. Indoor rowing machines
              provide precise, repeatable metrics, and outdoor rowing adds balance
              and coordination demands. Whether training for fitness or competition,
              rowing burns calories at rates comparable to running while being far
              gentler on the body.
            </p>
          </div>
        </>
      )}
    </ToolPageLayout>
  );
}
