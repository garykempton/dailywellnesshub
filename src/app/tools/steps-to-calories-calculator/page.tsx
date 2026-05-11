"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("steps-to-calories-calculator")!;

type Sex = "male" | "female";
type Unit = "metric" | "imperial";

const DEFAULT_STRIDE: Record<Sex, number> = {
  male: 0.762,
  female: 0.671,
};

const REFERENCE_STEPS = [2000, 5000, 7500, 10000, 12500, 15000];

interface Result {
  calories: number;
  distanceKm: number;
  distanceMiles: number;
  equivalentMinutes: number;
}

function computeResult(
  steps: number,
  weightKg: number,
  strideM: number
): Result {
  const distanceKm = (steps * strideM) / 1000;
  const calories = distanceKm * weightKg * 0.57;
  const distanceMiles = distanceKm * 0.621371;
  // Average walking speed ~5 km/h -> MET ~3.5, equivalent minutes of moderate exercise
  const equivalentMinutes = Math.round(calories / 5);
  return {
    calories: Math.round(calories),
    distanceKm: Math.round(distanceKm * 100) / 100,
    distanceMiles: Math.round(distanceMiles * 100) / 100,
    equivalentMinutes,
  };
}

export default function StepsToCaloriesCalculatorPage() {
  const [steps, setSteps] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<Unit>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [customStride, setCustomStride] = useState("");
  const [strideUnit, setStrideUnit] = useState<"m" | "ft">("m");
  const [result, setResult] = useState<Result | null>(null);
  const [refTable, setRefTable] = useState<
    { steps: number; calories: number }[] | null
  >(null);

  function calculate() {
    const s = parseInt(steps);
    const w = parseFloat(weight);
    if (!s || !w || s <= 0 || w <= 0) return;

    const weightKg = unit === "imperial" ? w * 0.453592 : w;

    let strideM = DEFAULT_STRIDE[sex];
    if (customStride) {
      const cs = parseFloat(customStride);
      if (cs > 0) {
        strideM = strideUnit === "ft" ? cs * 0.3048 : cs;
      }
    }

    setResult(computeResult(s, weightKg, strideM));

    // Build reference table at this weight and stride
    setRefTable(
      REFERENCE_STEPS.map((refSteps) => ({
        steps: refSteps,
        calories: computeResult(refSteps, weightKg, strideM).calories,
      }))
    );
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
                setRefTable(null);
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

        {/* Sex toggle (for default stride) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Sex (sets default stride length)
          </label>
          <div className="flex gap-2">
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSex(s);
                  setResult(null);
                  setRefTable(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  sex === s
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {s === "male" ? "Male" : "Female"}
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium mb-1">Steps</label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="10000"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "70" : "154"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Custom stride length (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Custom stride length (optional)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={customStride}
              onChange={(e) => setCustomStride(e.target.value)}
              placeholder={
                strideUnit === "m"
                  ? DEFAULT_STRIDE[sex].toFixed(3)
                  : (DEFAULT_STRIDE[sex] / 0.3048).toFixed(2)
              }
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex gap-1">
              {(["m", "ft"] as const).map((su) => (
                <button
                  key={su}
                  onClick={() => {
                    setStrideUnit(su);
                    setCustomStride("");
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                    strideUnit === su
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 hover:border-stone-500"
                  }`}
                >
                  {su}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Default: {DEFAULT_STRIDE[sex]}m ({sex === "male" ? "male" : "female"} average)
          </p>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Calories
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-primary/30 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Calories Burned</p>
              <p className="text-3xl font-bold text-primary">
                {result.calories.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400">kcal</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Distance Walked</p>
              <p className="text-3xl font-bold">{result.distanceKm}</p>
              <p className="text-xs text-stone-400">
                km ({result.distanceMiles} miles)
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Equivalent Exercise</p>
              <p className="text-3xl font-bold">{result.equivalentMinutes}</p>
              <p className="text-xs text-stone-400">minutes of moderate activity</p>
            </div>
          </div>

          {/* Reference table */}
          {refTable && (
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <h3 className="text-sm font-medium text-stone-600 mb-3">
                Steps to Calories Reference (at your weight)
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-medium text-stone-600 border-b border-stone-200 pb-1">
                  <span>Steps</span>
                  <span>Calories Burned</span>
                </div>
                {refTable.map((row) => (
                  <div
                    key={row.steps}
                    className={`flex justify-between py-1 px-2 rounded ${
                      parseInt(steps) === row.steps
                        ? "bg-primary/10 font-medium"
                        : ""
                    }`}
                  >
                    <span>{row.steps.toLocaleString()}</span>
                    <span className="text-stone-500">
                      {row.calories.toLocaleString()} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About this calculator</p>
        <p>
          This calculator estimates calories burned from walking using the formula:
          distance (km) x body weight (kg) x 0.57. Actual calorie burn varies based
          on walking speed, terrain, incline, and individual metabolism. Results are
          estimates and should be used as a general guide. Consult a healthcare
          professional for personalised advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
