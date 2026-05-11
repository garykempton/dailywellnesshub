"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("body-fat-calculator")!;

type Sex = "male" | "female";
type Unit = "metric" | "imperial";

interface BFResult {
  bodyFatPct: number;
  fatMass: number;
  leanMass: number;
  classification: string;
  color: string;
}

function classify(pct: number, sex: Sex): { label: string; color: string } {
  if (sex === "male") {
    if (pct < 6) return { label: "Essential Fat", color: "text-red-600" };
    if (pct <= 13) return { label: "Athletic", color: "text-blue-600" };
    if (pct <= 17) return { label: "Fitness", color: "text-green-600" };
    if (pct <= 24) return { label: "Average", color: "text-amber-600" };
    return { label: "Above Average", color: "text-red-600" };
  } else {
    if (pct < 14) return { label: "Essential Fat", color: "text-red-600" };
    if (pct <= 20) return { label: "Athletic", color: "text-blue-600" };
    if (pct <= 24) return { label: "Fitness", color: "text-green-600" };
    if (pct <= 31) return { label: "Average", color: "text-amber-600" };
    return { label: "Above Average", color: "text-red-600" };
  }
}

export default function BodyFatCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BFResult | null>(null);

  function calculate() {
    const factor = unit === "imperial" ? 2.54 : 1;
    const heightCm = parseFloat(height) * factor;
    const neckCm = parseFloat(neck) * factor;
    const waistCm = parseFloat(waist) * factor;
    const hipCm = parseFloat(hip) * factor;
    const weightKg =
      unit === "imperial"
        ? parseFloat(weight) * 0.453592
        : parseFloat(weight);

    if (!heightCm || !neckCm || !waistCm || !weightKg || heightCm <= 0) return;
    if (sex === "female" && (!hipCm || hipCm <= 0)) return;

    let bf: number;
    if (sex === "male") {
      if (waistCm - neckCm <= 0) return;
      bf =
        86.01 * Math.log10(waistCm - neckCm) -
        70.041 * Math.log10(heightCm) +
        36.76;
    } else {
      if (waistCm + hipCm - neckCm <= 0) return;
      bf =
        163.205 * Math.log10(waistCm + hipCm - neckCm) -
        97.684 * Math.log10(heightCm) -
        78.387;
    }

    bf = Math.round(bf * 10) / 10;
    if (bf < 0) bf = 0;

    const fatMass = Math.round((weightKg * bf) / 100 * 10) / 10;
    const leanMass = Math.round((weightKg - fatMass) * 10) / 10;
    const cls = classify(bf, sex);

    setResult({
      bodyFatPct: bf,
      fatMass,
      leanMass,
      classification: cls.label,
      color: cls.color,
    });
  }

  const unitLabel = unit === "metric" ? "cm" : "in";

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
            {u === "metric" ? "Metric (cm/kg)" : "Imperial (in/lbs)"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Height ({unitLabel})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "175" : "69"}
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
            placeholder={unit === "metric" ? "80" : "176"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Neck Circumference ({unitLabel})
          </label>
          <input
            type="number"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder={unit === "metric" ? "38" : "15"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Waist Circumference ({unitLabel})
          </label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder={unit === "metric" ? "85" : "33"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {sex === "female" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Hip Circumference ({unitLabel})
            </label>
            <input
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder={unit === "metric" ? "100" : "39"}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Body Fat
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">Estimated Body Fat</p>
            <p className="text-5xl font-bold">{result.bodyFatPct}%</p>
            <p className={`text-lg font-semibold mt-2 ${result.color}`}>
              {result.classification}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Fat Mass</p>
              <p className="text-3xl font-bold">{result.fatMass} kg</p>
              <p className="text-sm text-stone-400">
                {(result.fatMass * 2.20462).toFixed(1)} lbs
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Lean Mass</p>
              <p className="text-3xl font-bold">{result.leanMass} kg</p>
              <p className="text-sm text-stone-400">
                {(result.leanMass * 2.20462).toFixed(1)} lbs
              </p>
            </div>
          </div>

          {/* Classification table */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              Body Fat Classifications ({sex === "male" ? "Men" : "Women"})
            </h3>
            <div className="space-y-2 text-sm">
              {(sex === "male"
                ? [
                    { label: "Essential Fat", range: "< 6%" },
                    { label: "Athletic", range: "6 - 13%" },
                    { label: "Fitness", range: "14 - 17%" },
                    { label: "Average", range: "18 - 24%" },
                    { label: "Above Average", range: "> 24%" },
                  ]
                : [
                    { label: "Essential Fat", range: "< 14%" },
                    { label: "Athletic", range: "14 - 20%" },
                    { label: "Fitness", range: "21 - 24%" },
                    { label: "Average", range: "25 - 31%" },
                    { label: "Above Average", range: "> 31%" },
                  ]
              ).map((row) => (
                <div
                  key={row.label}
                  className={`flex justify-between py-1 px-2 rounded ${
                    result.classification === row.label
                      ? "bg-primary/10 font-medium"
                      : ""
                  }`}
                >
                  <span>{row.label}</span>
                  <span className="text-stone-500">{row.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About this calculator</p>
        <p>
          This calculator uses the U.S. Navy circumference method to estimate body
          fat percentage. While reasonably accurate for most people, it is an
          estimate and may not be as precise as methods like DEXA scans or
          hydrostatic weighing. Results should be used as a general guide, not a
          medical diagnosis. Consult a healthcare professional for personalised
          advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
