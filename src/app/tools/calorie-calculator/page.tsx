"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("calorie-calculator")!;

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

export default function CalorieCalculatorPage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    lose: number;
    gain: number;
  } | null>(null);

  function calculate() {
    const a = parseInt(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w) return;

    // Convert to metric if needed
    const cm = unit === "imperial" ? h * 2.54 : h;
    const kg = unit === "imperial" ? w * 0.453592 : w;

    // Mifflin-St Jeor equation
    let bmr: number;
    if (sex === "male") {
      bmr = 10 * kg + 6.25 * cm - 5 * a + 5;
    } else {
      bmr = 10 * kg + 6.25 * cm - 5 * a - 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      lose: Math.round(tdee - 500),
      gain: Math.round(tdee + 500),
    });
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
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                unit === u
                  ? "bg-primary text-white border-primary"
                  : "border-stone-300 hover:border-stone-500"
              }`}
            >
              {u === "metric" ? "Metric" : "Imperial"}
            </button>
          ))}
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Biological sex (for BMR formula)
          </label>
          <div className="flex gap-2">
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  sex === s
                    ? "bg-stone-800 text-white border-stone-800"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Height ({unit === "metric" ? "cm" : "inches"})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "170" : "67"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as ActivityLevel)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            <option value="sedentary">Sedentary (office job, little exercise)</option>
            <option value="light">Lightly Active (1-2 days/week)</option>
            <option value="moderate">Moderately Active (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="very-active">Very Active (athlete / physical job)</option>
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
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500">BMR</p>
            <p className="text-3xl font-bold">{result.bmr.toLocaleString()}</p>
            <p className="text-xs text-stone-400">kcal/day at rest</p>
          </div>
          <div className="bg-white border border-primary/30 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500">TDEE (Maintenance)</p>
            <p className="text-3xl font-bold text-primary">{result.tdee.toLocaleString()}</p>
            <p className="text-xs text-stone-400">kcal/day to maintain weight</p>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500">Weight Loss</p>
            <p className="text-3xl font-bold text-green-600">{result.lose.toLocaleString()}</p>
            <p className="text-xs text-stone-400">kcal/day (-500 deficit)</p>
          </div>
          <div className="bg-white border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500">Weight Gain</p>
            <p className="text-3xl font-bold text-blue-600">{result.gain.toLocaleString()}</p>
            <p className="text-xs text-stone-400">kcal/day (+500 surplus)</p>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
