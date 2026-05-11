"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("lean-body-mass-calculator")!;

type Sex = "male" | "female";
type Unit = "metric" | "imperial";

interface LBMResult {
  boer: number;
  james: number;
  hume: number;
  average: number;
  bodyFatPct: number;
  weightKg: number;
}

function calcLBM(sex: Sex, weightKg: number, heightCm: number): LBMResult {
  let boer: number;
  let james: number;
  let hume: number;

  if (sex === "male") {
    boer = 0.407 * weightKg + 0.267 * heightCm - 19.2;
    james =
      1.1 * weightKg - 128 * Math.pow(weightKg / heightCm, 2);
    hume = 0.3281 * weightKg + 0.3393 * heightCm - 29.5336;
  } else {
    boer = 0.252 * weightKg + 0.473 * heightCm - 48.3;
    james =
      1.07 * weightKg - 148 * Math.pow(weightKg / heightCm, 2);
    hume = 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
  }

  const average = (boer + james + hume) / 3;
  const bodyFatPct = ((weightKg - average) / weightKg) * 100;

  return {
    boer: Math.round(boer * 10) / 10,
    james: Math.round(james * 10) / 10,
    hume: Math.round(hume * 10) / 10,
    average: Math.round(average * 10) / 10,
    bodyFatPct: Math.round(bodyFatPct * 10) / 10,
    weightKg,
  };
}

function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export default function LeanBodyMassCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<LBMResult | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    let weightKg: number;
    let heightCm: number;

    if (unit === "metric") {
      const h = parseFloat(height);
      if (!h || h <= 0) return;
      weightKg = w;
      heightCm = h;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inches;
      if (totalInches <= 0) return;
      weightKg = w * 0.453592;
      heightCm = totalInches * 2.54;
    }

    setResult(calcLBM(sex, weightKg, heightCm));
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Sex Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Sex</label>
          <div className="flex gap-2">
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
        </div>

        {/* Unit Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Units</label>
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
                {u === "metric" ? "Metric (cm/kg)" : "Imperial (ft-in/lbs)"}
              </button>
            ))}
          </div>
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

        {/* Height */}
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

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Lean Body Mass
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Average LBM */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Average Lean Body Mass
            </p>
            <p className="text-4xl font-bold">
              {result.average} kg
            </p>
            <p className="text-lg text-stone-500 mt-1">
              {kgToLbs(result.average)} lbs
            </p>
            <p className="text-sm text-stone-500 mt-2">
              Estimated body fat:{" "}
              <span className="font-semibold text-stone-700">
                {result.bodyFatPct}%
              </span>
            </p>
          </div>

          {/* Individual Formula Results */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Boer Formula</p>
              <p className="text-2xl font-bold">{result.boer} kg</p>
              <p className="text-sm text-stone-400">{kgToLbs(result.boer)} lbs</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">James Formula</p>
              <p className="text-2xl font-bold">{result.james} kg</p>
              <p className="text-sm text-stone-400">{kgToLbs(result.james)} lbs</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Hume Formula</p>
              <p className="text-2xl font-bold">{result.hume} kg</p>
              <p className="text-sm text-stone-400">{kgToLbs(result.hume)} lbs</p>
            </div>
          </div>

          {/* Body Composition Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              Body Composition Estimate
            </h3>
            <div className="w-full h-8 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{
                  width: `${Math.max(0, Math.min(100, 100 - result.bodyFatPct))}%`,
                }}
              >
                {Math.round(100 - result.bodyFatPct)}% Lean
              </div>
              <div
                className="bg-amber-400 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{
                  width: `${Math.max(0, Math.min(100, result.bodyFatPct))}%`,
                }}
              >
                {result.bodyFatPct}% Fat
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" />
                Lean Mass: {result.average} kg ({kgToLbs(result.average)} lbs)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block" />
                Fat Mass:{" "}
                {Math.round((result.weightKg - result.average) * 10) / 10} kg (
                {kgToLbs(result.weightKg - result.average)} lbs)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About This Calculator</p>
        <p>
          Lean body mass (LBM) is your total weight minus body fat. This
          calculator uses three validated estimation formulas: Boer (1984), James
          (1976), and Hume (1966). The average of all three provides a more
          reliable estimate. For the most accurate measurement, consider DEXA
          scanning or hydrostatic weighing. These formulas are intended for
          adults and may not be accurate for children or adolescents.
        </p>
      </div>
    </ToolPageLayout>
  );
}
