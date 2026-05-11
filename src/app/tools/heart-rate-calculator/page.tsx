"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("heart-rate-calculator")!;

type Method = "karvonen" | "simple";

const ZONES = [
  { name: "Zone 1 — Recovery", low: 0.5, high: 0.6, color: "bg-blue-100 text-blue-700 border-blue-200", desc: "Light activity, warm-up, cool-down" },
  { name: "Zone 2 — Fat Burn", low: 0.6, high: 0.7, color: "bg-green-100 text-green-700 border-green-200", desc: "Easy endurance, fat oxidation" },
  { name: "Zone 3 — Aerobic", low: 0.7, high: 0.8, color: "bg-amber-100 text-amber-700 border-amber-200", desc: "Moderate intensity, builds cardiovascular fitness" },
  { name: "Zone 4 — Threshold", low: 0.8, high: 0.9, color: "bg-orange-100 text-orange-700 border-orange-200", desc: "Hard effort, builds speed and lactate tolerance" },
  { name: "Zone 5 — Maximum", low: 0.9, high: 1.0, color: "bg-red-100 text-red-700 border-red-200", desc: "All-out effort, very short intervals only" },
];

interface ZoneResult {
  name: string;
  low: number;
  high: number;
  color: string;
  desc: string;
}

export default function HeartRateCalculatorPage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [method, setMethod] = useState<Method>("karvonen");
  const [results, setResults] = useState<ZoneResult[] | null>(null);
  const [maxHR, setMaxHR] = useState<number | null>(null);

  function calculate() {
    const a = parseInt(age);
    if (!a || a < 10 || a > 120) return;

    const mhr = 220 - a;
    setMaxHR(mhr);

    const rhr = parseInt(restingHR) || 0;

    if (method === "karvonen" && rhr > 0) {
      const hrr = mhr - rhr;
      setResults(
        ZONES.map((z) => ({
          ...z,
          low: Math.round(hrr * z.low + rhr),
          high: Math.round(hrr * z.high + rhr),
        }))
      );
    } else {
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
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        {/* Method toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Calculation Method</label>
          <div className="flex gap-2">
            {(["karvonen", "simple"] as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMethod(m);
                  setResults(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  method === m
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {m === "karvonen" ? "Karvonen (more accurate)" : "Simple (% of max)"}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
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

        {/* Resting HR */}
        {method === "karvonen" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Resting Heart Rate (BPM)
            </label>
            <input
              type="number"
              value={restingHR}
              onChange={(e) => setRestingHR(e.target.value)}
              placeholder="65"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">
              Measure first thing in the morning before getting out of bed for best accuracy.
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

      {/* Results */}
      {results && maxHR && (
        <div className="mt-6 space-y-6">
          {/* Summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <div className="grid sm:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-stone-500">Estimated Max HR</p>
                <p className="text-3xl font-bold text-stone-800">{maxHR} <span className="text-lg">BPM</span></p>
                <p className="text-xs text-stone-400">220 - age formula</p>
              </div>
              {method === "karvonen" && restingHR && (
                <div>
                  <p className="text-sm text-stone-500">Heart Rate Reserve</p>
                  <p className="text-3xl font-bold text-primary">{maxHR - parseInt(restingHR)} <span className="text-lg">BPM</span></p>
                  <p className="text-xs text-stone-400">Max HR - Resting HR</p>
                </div>
              )}
            </div>
          </div>

          {/* Zone cards */}
          <div className="space-y-3">
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
                  {zone.low}-{zone.high} <span className="text-sm font-normal">BPM</span>
                </p>
              </div>
            ))}
          </div>

          {/* Zone training guide */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-3">How to Use Your Zones</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">1.</span>
                Spend 80% of your weekly training time in Zones 1-2. This builds your aerobic
                base and supports recovery between hard sessions.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">2.</span>
                Use Zone 3 for tempo runs and steady-state cardio. Aim for 1-2 sessions per
                week at this intensity.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">3.</span>
                Zone 4-5 work (intervals, sprints) is highly effective but stressful. Limit to
                1-2 sessions per week with adequate recovery between them.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">4.</span>
                The 80/20 rule: roughly 80% easy, 20% hard. This polarised approach is used
                by most elite endurance athletes and is backed by research.
              </li>
            </ul>
          </div>

          {/* Method comparison */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-3">Karvonen vs Simple Method</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="font-medium text-stone-700 mb-2">Karvonen Method</p>
                <p className="text-stone-600">
                  Uses heart rate reserve (HRR = max HR - resting HR) for more personalised zones.
                  Better accounts for individual fitness levels since a lower resting HR shifts
                  zones upward.
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="font-medium text-stone-700 mb-2">Simple Percentage</p>
                <p className="text-stone-600">
                  Calculates zones as a straight percentage of estimated max HR. Easier to use but
                  less personalised. Best when you do not know your resting heart rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
