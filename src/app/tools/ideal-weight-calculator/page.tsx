"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("ideal-weight-calculator")!;

type Sex = "male" | "female";
type Unit = "metric" | "imperial";

interface FormulaResult {
  name: string;
  year: string;
  kg: number;
  lbs: number;
}

interface IdealWeightResult {
  formulas: FormulaResult[];
  averageKg: number;
  averageLbs: number;
  minKg: number;
  maxKg: number;
  minLbs: number;
  maxLbs: number;
}

function computeIdealWeight(heightInches: number, sex: Sex): IdealWeightResult {
  const diff = heightInches - 60;

  const formulas: FormulaResult[] = [
    {
      name: "Devine",
      year: "1974",
      kg: sex === "male" ? 50 + 2.3 * diff : 45.5 + 2.3 * diff,
      lbs: 0,
    },
    {
      name: "Robinson",
      year: "1983",
      kg: sex === "male" ? 52 + 1.9 * diff : 49 + 1.7 * diff,
      lbs: 0,
    },
    {
      name: "Miller",
      year: "1983",
      kg: sex === "male" ? 56.2 + 1.41 * diff : 53.1 + 1.36 * diff,
      lbs: 0,
    },
    {
      name: "Hamwi",
      year: "1964",
      kg: sex === "male" ? 48 + 2.7 * diff : 45.5 + 2.2 * diff,
      lbs: 0,
    },
  ];

  formulas.forEach((f) => {
    f.kg = Math.round(f.kg * 10) / 10;
    f.lbs = Math.round(f.kg * 2.20462 * 10) / 10;
  });

  const kgs = formulas.map((f) => f.kg);
  const averageKg = Math.round((kgs.reduce((a, b) => a + b, 0) / kgs.length) * 10) / 10;
  const minKg = Math.min(...kgs);
  const maxKg = Math.max(...kgs);

  return {
    formulas,
    averageKg,
    averageLbs: Math.round(averageKg * 2.20462 * 10) / 10,
    minKg,
    maxKg,
    minLbs: Math.round(minKg * 2.20462 * 10) / 10,
    maxLbs: Math.round(maxKg * 2.20462 * 10) / 10,
  };
}

export default function IdealWeightCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<IdealWeightResult | null>(null);

  function calculate() {
    let totalInches: number;
    if (unit === "metric") {
      const cm = parseFloat(heightCm);
      if (!cm || cm <= 0) return;
      totalInches = cm / 2.54;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      totalInches = ft * 12 + inches;
    }
    if (totalInches <= 0) return;

    setResult(computeIdealWeight(totalInches, sex));
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
            {u === "metric" ? "Metric (cm)" : "Imperial (ft/in)"}
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
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
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
          Calculate Ideal Weight
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Average & Range summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">Average Ideal Weight</p>
            <p className="text-5xl font-bold">{result.averageKg} kg</p>
            <p className="text-lg text-stone-500 mt-1">
              {result.averageLbs} lbs
            </p>
            <p className="text-sm text-stone-400 mt-2">
              Range: {result.minKg} &ndash; {result.maxKg} kg ({result.minLbs}{" "}
              &ndash; {result.maxLbs} lbs)
            </p>
          </div>

          {/* Formula grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {result.formulas.map((f) => (
              <div
                key={f.name}
                className="bg-white border border-stone-200 rounded-xl p-5 text-center"
              >
                <p className="text-sm text-stone-500 mb-1">
                  {f.name} ({f.year})
                </p>
                <p className="text-3xl font-bold">{f.kg} kg</p>
                <p className="text-sm text-stone-400 mt-1">{f.lbs} lbs</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About this calculator</p>
        <p>
          This calculator shows ideal body weight estimates from four
          well-known medical formulas: Devine (1974), Robinson (1983), Miller
          (1983), and Hamwi (1964). These formulas were originally developed for
          pharmaceutical dosing calculations and provide a rough guide only.
          Ideal weight varies based on body composition, muscle mass, and
          individual health factors. Consult a healthcare professional for
          personalised advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
