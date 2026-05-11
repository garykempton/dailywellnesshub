"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("waist-hip-ratio-calculator")!;

type Sex = "male" | "female";
type Unit = "cm" | "inches";

interface WHRResult {
  ratio: number;
  risk: string;
  color: string;
  bgColor: string;
}

function classifyWHR(ratio: number, sex: Sex): WHRResult {
  if (sex === "male") {
    if (ratio < 0.9)
      return { ratio, risk: "Low Risk", color: "text-green-700", bgColor: "bg-green-50 border-green-200" };
    if (ratio <= 0.99)
      return { ratio, risk: "Moderate Risk", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" };
    return { ratio, risk: "High Risk", color: "text-red-700", bgColor: "bg-red-50 border-red-200" };
  } else {
    if (ratio < 0.8)
      return { ratio, risk: "Low Risk", color: "text-green-700", bgColor: "bg-green-50 border-green-200" };
    if (ratio <= 0.85)
      return { ratio, risk: "Moderate Risk", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" };
    return { ratio, risk: "High Risk", color: "text-red-700", bgColor: "bg-red-50 border-red-200" };
  }
}

export default function WaistHipRatioCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("cm");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<WHRResult | null>(null);

  function calculate() {
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (!w || !h || w <= 0 || h <= 0) return;

    const ratio = Math.round((w / h) * 100) / 100;
    setResult(classifyWHR(ratio, sex));
  }

  return (
    <ToolPageLayout tool={tool}>
      {/* Sex toggle */}
      <div className="flex gap-2 mb-4">
        {(["male", "female"] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSex(s);
              setResult(null);
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

      {/* Unit toggle */}
      <div className="flex gap-2 mb-6">
        {(["cm", "inches"] as const).map((u) => (
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
            {u === "cm" ? "Centimetres" : "Inches"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Waist Circumference ({unit})
          </label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder={unit === "cm" ? "85" : "33"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Hip Circumference ({unit})
          </label>
          <input
            type="number"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
            placeholder={unit === "cm" ? "100" : "39"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate WHR
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className={`border rounded-xl p-5 text-center ${result.bgColor}`}>
            <p className="text-sm text-stone-500 mb-1">
              Your Waist-to-Hip Ratio
            </p>
            <p className="text-5xl font-bold">{result.ratio.toFixed(2)}</p>
            <p className={`text-lg font-semibold mt-2 ${result.color}`}>
              {result.risk}
            </p>
          </div>

          {/* Risk classification table */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              WHO Health Risk Classification ({sex === "male" ? "Men" : "Women"})
            </h3>
            <div className="space-y-2 text-sm">
              {(sex === "male"
                ? [
                    { label: "Low Risk", range: "< 0.90", color: "text-green-600" },
                    { label: "Moderate Risk", range: "0.90 - 0.99", color: "text-amber-600" },
                    { label: "High Risk", range: "1.00 +", color: "text-red-600" },
                  ]
                : [
                    { label: "Low Risk", range: "< 0.80", color: "text-green-600" },
                    { label: "Moderate Risk", range: "0.80 - 0.85", color: "text-amber-600" },
                    { label: "High Risk", range: "> 0.85", color: "text-red-600" },
                  ]
              ).map((row) => (
                <div
                  key={row.label}
                  className={`flex justify-between py-1 px-2 rounded ${
                    result.risk === row.label ? "bg-primary/10 font-medium" : ""
                  }`}
                >
                  <span className={row.color}>{row.label}</span>
                  <span className="text-stone-500">{row.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          What does waist-to-hip ratio indicate?
        </p>
        <p>
          Waist-to-hip ratio (WHR) is a measure of how body fat is distributed.
          A higher WHR indicates more fat stored around the waist (apple shape),
          which is associated with a greater risk of cardiovascular disease, type
          2 diabetes, and other metabolic conditions. The World Health
          Organization uses WHR as one indicator of health risk. Unlike BMI, WHR
          specifically reflects central adiposity. For the most accurate
          measurements, measure your waist at the narrowest point and your hips
          at the widest point. This tool is for informational purposes only.
          Consult a healthcare professional for personalised advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
