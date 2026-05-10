"use client";

import { useState } from "react";
import Link from "next/link";

function classify(bmi: number): { label: string; color: string; info: string } {
  if (bmi < 18.5)
    return {
      label: "Underweight",
      color: "text-blue-600",
      info: "A BMI below 18.5 may indicate underweight. Consider speaking with a healthcare professional.",
    };
  if (bmi < 25)
    return {
      label: "Normal weight",
      color: "text-green-600",
      info: "A BMI between 18.5 and 24.9 is generally considered within the normal range.",
    };
  if (bmi < 30)
    return {
      label: "Overweight",
      color: "text-amber-600",
      info: "A BMI between 25 and 29.9 may indicate overweight. Lifestyle changes may help.",
    };
  return {
    label: "Obese",
    color: "text-red-600",
    info: "A BMI of 30 or above may indicate obesity. Please consult a healthcare professional for personalised guidance.",
  };
}

export default function BMICalculatorPage() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    let h: number;
    if (unit === "metric") {
      h = parseFloat(height) / 100; // cm to m
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inches;
      h = totalInches * 0.0254;
      // convert lbs to kg
    }
    if (!w || !h || h <= 0) return;
    const weightKg = unit === "imperial" ? w * 0.453592 : w;
    const bmi = weightKg / (h * h);
    setResult(Math.round(bmi * 10) / 10);
  }

  const info = result ? classify(result) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/tools"
        className="text-sm text-primary hover:underline mb-4 inline-block"
      >
        &larr; All Tools
      </Link>
      <h1 className="text-3xl font-bold mb-2">BMI Calculator</h1>
      <p className="text-stone-500 mb-6">
        Calculate your Body Mass Index. BMI is a rough screening measure and
        does not account for muscle mass, age, or body composition. Always
        consult a professional.
      </p>

      {/* Unit toggle */}
      <div className="flex gap-2 mb-6">
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
            {u === "metric" ? "Metric (cm/kg)" : "Imperial (ft-in/lbs)"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {unit === "metric" ? (
          <div>
            <label className="block text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Height (ft)
              </label>
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Height (in)
              </label>
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="10"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

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

      {result !== null && info && (
        <div className="mt-6 bg-white border border-stone-200 rounded-xl p-6 text-center">
          <p className="text-sm text-stone-500 mb-1">Your BMI</p>
          <p className="text-5xl font-bold">{result}</p>
          <p className={`text-lg font-semibold mt-2 ${info.color}`}>
            {info.label}
          </p>
          <p className="text-sm text-stone-500 mt-3 max-w-md mx-auto">
            {info.info}
          </p>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">Disclaimer</p>
        <p>
          BMI is a simple screening tool and is not diagnostic. It does not
          distinguish between lean mass and body fat, and may not be accurate for
          athletes, pregnant women, or older adults. This tool is for
          informational purposes only. Please consult a healthcare professional
          for personalised health advice.
        </p>
      </div>
    </div>
  );
}
