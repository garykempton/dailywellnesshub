"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("stair-climbing-calorie-calculator")!;

type Pace = "slow" | "moderate" | "fast";
type InputMode = "time" | "floors";

const PACE_OPTIONS: { value: Pace; label: string; met: number; secPerFloor: number }[] = [
  { value: "slow", label: "Slow", met: 4.0, secPerFloor: 25 },
  { value: "moderate", label: "Moderate", met: 8.8, secPerFloor: 15 },
  { value: "fast", label: "Fast", met: 14.0, secPerFloor: 10 },
];

const EMPIRE_STATE_FLOORS = 86;
const METRES_PER_FLOOR = 3;
const STEPS_PER_FLOOR = 16;

export default function StairClimbingCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [inputMode, setInputMode] = useState<InputMode>("time");
  const [duration, setDuration] = useState("");
  const [floors, setFloors] = useState("");
  const [pace, setPace] = useState<Pace>("moderate");
  const [result, setResult] = useState<{
    calories: number;
    floors: number;
    steps: number;
    verticalMetres: number;
    durationMinutes: number;
    runningEquiv: number;
    walkingEquiv: number;
    dailyFloors: number;
    weeklyCalories: number;
    yearlyKg: number;
    empirePercent: number;
  } | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    const kg = weightUnit === "lbs" ? w * 0.453592 : w;
    const paceOption = PACE_OPTIONS.find((p) => p.value === pace)!;

    let durationMinutes: number;
    let floorCount: number;

    if (inputMode === "time") {
      const d = parseFloat(duration);
      if (!d || d <= 0) return;
      durationMinutes = d;
      floorCount = Math.round((d * 60) / paceOption.secPerFloor);
    } else {
      const f = parseFloat(floors);
      if (!f || f <= 0) return;
      floorCount = f;
      durationMinutes = (f * paceOption.secPerFloor) / 60;
    }

    const hours = durationMinutes / 60;
    const calories = Math.round(paceOption.met * kg * hours);
    const steps = floorCount * STEPS_PER_FLOOR;
    const verticalMetres = floorCount * METRES_PER_FLOOR;

    // Equivalent activities
    const runningMet = 9.8;
    const walkingMet = 3.5;
    const runningEquiv = Math.round((calories / (runningMet * kg)) * 60);
    const walkingEquiv = Math.round((calories / (walkingMet * kg)) * 60);

    // Daily recommendation: 10 floors/day
    const dailyFloors = 10;
    const dailyCalories = Math.round(
      paceOption.met * kg * ((dailyFloors * paceOption.secPerFloor) / 3600)
    );
    const weeklyCalories = dailyCalories * 7;
    const yearlyKg = Math.round(((weeklyCalories * 52) / 7700) * 10) / 10;

    const empirePercent = Math.round((floorCount / EMPIRE_STATE_FLOORS) * 100);

    setResult({
      calories,
      floors: floorCount,
      steps,
      verticalMetres,
      durationMinutes: Math.round(durationMinutes * 10) / 10,
      runningEquiv,
      walkingEquiv,
      dailyFloors,
      weeklyCalories,
      yearlyKg,
      empirePercent,
    });
  }

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

        {/* Input Mode Toggle */}
        <div>
          <label className="block text-sm font-medium mb-1">Input Mode</label>
          <div className="flex gap-1">
            {([
              { value: "time" as InputMode, label: "By Time" },
              { value: "floors" as InputMode, label: "By Floors / Steps" },
            ]).map((m) => (
              <button
                key={m.value}
                onClick={() => {
                  setInputMode(m.value);
                  setResult(null);
                }}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border ${
                  inputMode === m.value
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional inputs */}
        {inputMode === "time" ? (
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="15"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Floors
            </label>
            <input
              type="number"
              value={floors}
              onChange={(e) => setFloors(e.target.value)}
              placeholder="10"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        )}

        {/* Pace */}
        <div>
          <label className="block text-sm font-medium mb-1">Pace</label>
          <select
            value={pace}
            onChange={(e) => setPace(e.target.value as Pace)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {PACE_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label} (MET {p.met})
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
          <div className="mt-6 bg-white border border-green-300 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500">Total Calories Burned</p>
            <p className="text-4xl font-bold text-green-600">
              {result.calories.toLocaleString()}
            </p>
            <p className="text-xs text-stone-400">kcal</p>
          </div>

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Floors Climbed</p>
              <p className="text-2xl font-bold">{result.floors}</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Total Steps</p>
              <p className="text-2xl font-bold">{result.steps.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Vertical Gain</p>
              <p className="text-2xl font-bold">{result.verticalMetres}m</p>
              <p className="text-xs text-stone-400">
                ({Math.round(result.verticalMetres * 3.281)}ft)
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Duration</p>
              <p className="text-2xl font-bold">{result.durationMinutes}</p>
              <p className="text-xs text-stone-400">minutes</p>
            </div>
          </div>

          {/* Equivalent activities */}
          <div className="mt-4 bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-700">Equivalent Activities</p>
            <p className="text-sm text-stone-600">
              Burning {result.calories} kcal on stairs is equivalent to
              running for approximately{" "}
              <span className="font-semibold">{result.runningEquiv} minutes</span>{" "}
              or walking for approximately{" "}
              <span className="font-semibold">{result.walkingEquiv} minutes</span>.
            </p>
          </div>

          {/* Daily recommendation */}
          <div className="mt-4 bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-700">Daily Stair Recommendation</p>
            <p className="text-sm text-stone-600">
              Climbing{" "}
              <span className="font-semibold">{result.dailyFloors} floors per day</span>{" "}
              burns approximately{" "}
              <span className="font-semibold">
                {result.weeklyCalories} calories per week
              </span>{" "}
              ({result.yearlyKg} kg per year), contributing meaningfully to weight
              management and cardiovascular health.
            </p>
          </div>

          {/* Fun fact */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-stone-600">
            <p className="font-semibold text-green-700 mb-1">Fun Fact</p>
            <p>
              That&apos;s like climbing {result.empirePercent}% of the Empire State
              Building ({EMPIRE_STATE_FLOORS} floors)!
              {result.empirePercent >= 100 &&
                " You conquered the whole building and then some!"}
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-4 bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-700">Benefits of Stair Climbing</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-stone-600">
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="font-semibold text-stone-700">Cardiovascular Health</p>
                <p>
                  Stair climbing elevates your heart rate quickly, strengthening
                  your heart and improving circulation over time.
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="font-semibold text-stone-700">Lower Body Strength</p>
                <p>
                  Engages glutes, quads, hamstrings, and calves with every step,
                  building functional lower body power.
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="font-semibold text-stone-700">Bone Density</p>
                <p>
                  As a weight-bearing exercise, stair climbing helps maintain and
                  improve bone density, reducing osteoporosis risk.
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="font-semibold text-stone-700">Convenience</p>
                <p>
                  Stairs are everywhere. No equipment or gym membership needed,
                  making it one of the most accessible workouts available.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </ToolPageLayout>
  );
}
