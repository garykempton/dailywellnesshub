"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("one-rep-max-calculator")!;

type Unit = "kg" | "lbs";

const PERCENTAGE_TABLE = [
  { pct: 100, reps: 1 },
  { pct: 95, reps: 2 },
  { pct: 90, reps: 4 },
  { pct: 85, reps: 6 },
  { pct: 80, reps: 8 },
  { pct: 75, reps: 10 },
  { pct: 70, reps: 12 },
  { pct: 65, reps: 15 },
  { pct: 60, reps: 18 },
  { pct: 55, reps: 22 },
  { pct: 50, reps: 25 },
];

interface Result {
  epley: number;
  brzycki: number;
  lombardi: number;
  average: number;
}

export default function OneRepMaxCalculatorPage() {
  const [weightLifted, setWeightLifted] = useState("");
  const [reps, setReps] = useState("");
  const [unit, setUnit] = useState<Unit>("kg");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const w = parseFloat(weightLifted);
    const r = parseInt(reps);
    if (!w || !r || w <= 0 || r < 1 || r > 15) return;

    if (r === 1) {
      setResult({ epley: w, brzycki: w, lombardi: w, average: w });
      return;
    }

    const epley = w * (1 + r / 30);
    const brzycki = w * (36 / (37 - r));
    const lombardi = w * Math.pow(r, 0.1);
    const average = (epley + brzycki + lombardi) / 3;

    setResult({
      epley: Math.round(epley * 10) / 10,
      brzycki: Math.round(brzycki * 10) / 10,
      lombardi: Math.round(lombardi * 10) / 10,
      average: Math.round(average * 10) / 10,
    });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Unit toggle */}
        <div className="flex gap-2">
          {(["kg", "lbs"] as const).map((u) => (
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
              {u}
            </button>
          ))}
        </div>

        {/* Weight lifted */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Weight lifted ({unit})
          </label>
          <input
            type="number"
            value={weightLifted}
            onChange={(e) => setWeightLifted(e.target.value)}
            placeholder={unit === "kg" ? "100" : "225"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Reps */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Reps completed (1-15)
          </label>
          <input
            type="number"
            min={1}
            max={15}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="5"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate 1RM
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Average highlight */}
          <div className="bg-white border border-primary/30 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">Estimated 1RM (Average)</p>
            <p className="text-3xl font-bold text-primary">
              {result.average} {unit}
            </p>
          </div>

          {/* Individual formulas */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Epley</p>
              <p className="text-3xl font-bold">
                {result.epley}
              </p>
              <p className="text-xs text-stone-400">{unit}</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Brzycki</p>
              <p className="text-3xl font-bold">
                {result.brzycki}
              </p>
              <p className="text-xs text-stone-400">{unit}</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Lombardi</p>
              <p className="text-3xl font-bold">
                {result.lombardi}
              </p>
              <p className="text-xs text-stone-400">{unit}</p>
            </div>
          </div>

          {/* Percentage chart */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              Percentage Chart (based on {result.average} {unit} 1RM)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-medium text-stone-600 border-b border-stone-200 pb-1">
                <span>%</span>
                <span>Weight</span>
                <span>Approx. Reps</span>
              </div>
              {PERCENTAGE_TABLE.map((row) => {
                const pctWeight =
                  Math.round((result.average * row.pct) / 100 * 10) / 10;
                return (
                  <div
                    key={row.pct}
                    className={`flex justify-between py-1 px-2 rounded ${
                      row.pct === 100 ? "bg-primary/10 font-medium" : ""
                    }`}
                  >
                    <span>{row.pct}%</span>
                    <span>
                      {pctWeight} {unit}
                    </span>
                    <span className="text-stone-500">
                      ~{row.reps} {row.reps === 1 ? "rep" : "reps"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About this calculator</p>
        <p>
          This calculator uses three well-known formulas (Epley, Brzycki, and
          Lombardi) to estimate your one-rep max. These formulas are most accurate
          when using sets of 2-6 reps. Accuracy decreases with higher rep counts.
          Never attempt a true 1RM without a spotter and proper warm-up. Results are
          estimates and should be used as a training guide, not a guarantee.
        </p>
      </div>
    </ToolPageLayout>
  );
}
