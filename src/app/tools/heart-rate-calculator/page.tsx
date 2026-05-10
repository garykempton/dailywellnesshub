"use client";

import { useState } from "react";
import Link from "next/link";

const ZONES = [
  { name: "Zone 1 — Recovery", low: 0.5, high: 0.6, color: "bg-blue-100 text-blue-700 border-blue-200", desc: "Light activity, warm-up, recovery" },
  { name: "Zone 2 — Fat Burn", low: 0.6, high: 0.7, color: "bg-green-100 text-green-700 border-green-200", desc: "Easy endurance, fat oxidation" },
  { name: "Zone 3 — Aerobic", low: 0.7, high: 0.8, color: "bg-amber-100 text-amber-700 border-amber-200", desc: "Moderate intensity, improves fitness" },
  { name: "Zone 4 — Threshold", low: 0.8, high: 0.9, color: "bg-orange-100 text-orange-700 border-orange-200", desc: "Hard effort, builds speed and power" },
  { name: "Zone 5 — Maximum", low: 0.9, high: 1.0, color: "bg-red-100 text-red-700 border-red-200", desc: "Maximum effort, short bursts only" },
];

export default function HeartRateCalculatorPage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [method, setMethod] = useState<"simple" | "karvonen">("karvonen");
  const [results, setResults] = useState<{ name: string; low: number; high: number; color: string; desc: string }[] | null>(null);
  const [maxHR, setMaxHR] = useState<number | null>(null);

  function calculate() {
    const a = parseInt(age);
    if (!a || a < 10 || a > 120) return;

    const mhr = 220 - a;
    setMaxHR(mhr);

    const rhr = parseInt(restingHR) || 0;

    if (method === "karvonen" && rhr > 0) {
      // Karvonen: Target = ((MHR - RHR) * intensity) + RHR
      const hrr = mhr - rhr;
      setResults(
        ZONES.map((z) => ({
          ...z,
          low: Math.round(hrr * z.low + rhr),
          high: Math.round(hrr * z.high + rhr),
        }))
      );
    } else {
      // Simple percentage of MHR
      setResults(
        ZONES.map((z) => ({
          ...z,
          low: Math.round(mhr * z.low),
          high: Math.round(mhr * z.high),
        }))
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/tools" className="text-sm text-primary hover:underline mb-4 inline-block">
        &larr; All Tools
      </Link>
      <h1 className="text-3xl font-bold mb-2">Heart Rate Zones Calculator</h1>
      <p className="text-stone-500 mb-6">
        Calculate your target heart rate training zones based on age and
        resting heart rate. Useful for planning cardio workouts.
      </p>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex gap-2">
          {(["karvonen", "simple"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMethod(m);
                setResults(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                method === m
                  ? "bg-primary text-white border-primary"
                  : "border-stone-300 hover:border-stone-500"
              }`}
            >
              {m === "karvonen" ? "Karvonen (more accurate)" : "Simple (% of max)"}
            </button>
          ))}
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

        {method === "karvonen" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Resting Heart Rate (bpm)
            </label>
            <input
              type="number"
              value={restingHR}
              onChange={(e) => setRestingHR(e.target.value)}
              placeholder="65"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">
              Measure first thing in the morning before getting out of bed.
            </p>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Zones
        </button>
      </div>

      {results && maxHR && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-stone-500">
            Estimated max heart rate: <span className="font-bold text-stone-700">{maxHR} bpm</span>
            {method === "karvonen" && restingHR && (
              <> &middot; Heart rate reserve: <span className="font-bold text-stone-700">{maxHR - parseInt(restingHR)} bpm</span></>
            )}
          </p>
          {results.map((zone) => (
            <div
              key={zone.name}
              className={`border rounded-xl p-4 flex items-center justify-between ${zone.color}`}
            >
              <div>
                <p className="font-semibold text-sm">{zone.name}</p>
                <p className="text-xs opacity-80">{zone.desc}</p>
              </div>
              <p className="text-xl font-bold whitespace-nowrap ml-4">
                {zone.low}-{zone.high} <span className="text-sm font-normal">bpm</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">Disclaimer</p>
        <p>
          Heart rate zones are estimates based on the 220-minus-age formula. This
          formula has known limitations and may not be accurate for everyone. If
          you have a heart condition or take medications that affect heart rate,
          consult your doctor before using heart rate-based training. This tool is
          for informational purposes only.
        </p>
      </div>
    </div>
  );
}
