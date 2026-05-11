"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("bmi-calculator")!;

type Unit = "metric" | "imperial";

function classify(bmi: number) {
  if (bmi < 18.5)
    return {
      label: "Underweight",
      color: "text-blue-700",
      bg: "bg-blue-50",
      info: "A BMI below 18.5 may indicate underweight. Consider speaking with a healthcare professional about your nutritional intake.",
    };
  if (bmi < 25)
    return {
      label: "Normal Weight",
      color: "text-green-700",
      bg: "bg-green-50",
      info: "A BMI between 18.5 and 24.9 is generally considered within the healthy range for most adults.",
    };
  if (bmi < 30)
    return {
      label: "Overweight",
      color: "text-amber-700",
      bg: "bg-amber-50",
      info: "A BMI between 25 and 29.9 may indicate overweight. Lifestyle changes such as increased activity and balanced eating may help.",
    };
  return {
    label: "Obese",
    color: "text-red-700",
    bg: "bg-red-50",
    info: "A BMI of 30 or above may indicate obesity. Please consult a healthcare professional for personalised guidance.",
  };
}

export default function BMICalculatorPage() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    let h: number;
    if (unit === "metric") {
      h = parseFloat(height) / 100;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      h = (ft * 12 + inches) * 0.0254;
    }
    if (!w || !h || h <= 0) return;
    const weightKg = unit === "imperial" ? w * 0.453592 : w;
    const bmi = weightKg / (h * h);
    setResult(Math.round(bmi * 10) / 10);
  }

  const info = result ? classify(result) : null;

  // Gauge position (map BMI 12-45 to 0-100%)
  const gaugePercent = result
    ? Math.min(100, Math.max(0, ((result - 12) / 33) * 100))
    : 0;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        {/* Unit toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Unit System</label>
          <div className="flex gap-2">
            {(["metric", "imperial"] as Unit[]).map((u) => (
              <button
                key={u}
                onClick={() => {
                  setUnit(u);
                  setResult(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  unit === u
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft-in / lbs)"}
              </button>
            ))}
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          {unit === "metric" ? (
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5 ft"
                className="w-1/2 border border-stone-300 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="10 in"
                className="w-1/2 border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          )}
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

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate BMI
        </button>
      </div>

      {/* Results */}
      {result !== null && info && (
        <div className="mt-6 space-y-6">
          {/* Score card */}
          <div className={`${info.bg} border border-stone-200 rounded-xl p-6 text-center`}>
            <p className="text-sm text-stone-500 mb-1">Your BMI</p>
            <p className="text-5xl font-bold text-stone-800">{result}</p>
            <p className={`text-xl font-semibold mt-2 ${info.color}`}>{info.label}</p>
            <p className="text-sm text-stone-500 mt-3 max-w-md mx-auto">{info.info}</p>
          </div>

          {/* Visual gauge */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-4">BMI Scale</h3>
            <div className="relative">
              <div className="h-6 rounded-full overflow-hidden flex">
                <div className="bg-blue-300 flex-[18.5]" />
                <div className="bg-green-400 flex-[6.5]" />
                <div className="bg-amber-400 flex-[5]" />
                <div className="bg-red-400 flex-[15]" />
              </div>
              <div
                className="absolute -top-1 transition-all duration-500"
                style={{ left: `${gaugePercent}%` }}
              >
                <div className="relative -left-2">
                  <div className="w-4 h-4 bg-stone-800 rounded-full border-2 border-white shadow-md" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-stone-500">
                <span>12</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>45+</span>
              </div>
              <div className="flex justify-between mt-1 text-xs text-stone-400">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>

          {/* BMI categories table */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-3">BMI Categories</h3>
            <div className="space-y-2">
              {[
                { range: "Below 18.5", label: "Underweight", color: "bg-blue-200" },
                { range: "18.5 - 24.9", label: "Normal Weight", color: "bg-green-200" },
                { range: "25.0 - 29.9", label: "Overweight", color: "bg-amber-200" },
                { range: "30.0+", label: "Obese", color: "bg-red-200" },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-3 text-sm">
                  <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                  <span className="font-medium w-28">{cat.label}</span>
                  <span className="text-stone-500">{cat.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-3">BMI Limitations</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">1.</span>
                BMI does not distinguish between lean muscle mass and body fat. A muscular
                athlete may have a &quot;overweight&quot; BMI with very low body fat.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">2.</span>
                BMI does not account for age, sex, bone density, or body fat distribution.
                Central obesity (belly fat) is a stronger predictor of health risk than BMI alone.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">3.</span>
                For a more complete picture, consider combining BMI with waist-to-height ratio,
                body fat percentage, or a body composition scan (DEXA).
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">4.</span>
                BMI categories were developed from population studies and may not apply equally
                to all ethnic groups. Some guidelines use lower thresholds for Asian populations.
              </li>
            </ul>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
