"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("running-pace-calculator")!;

type Mode = "pace" | "time" | "distance";
type DistUnit = "km" | "mi";
type PaceUnit = "min/km" | "min/mi";

const RACE_DISTANCES = [
  { name: "5K", km: 5 },
  { name: "10K", km: 10 },
  { name: "Half Marathon", km: 21.0975 },
  { name: "Marathon", km: 42.195 },
];

function parseTime(input: string): number | null {
  const parts = input.split(":").map((p) => parseFloat(p));
  if (parts.some((p) => isNaN(p) || p < 0)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0] * 60;
  return null;
}

function formatTime(totalSeconds: number): string {
  if (totalSeconds < 0) return "0:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  const sPad = s.toString().padStart(2, "0");
  const mPad = m.toString().padStart(2, "0");
  if (h > 0) return `${h}:${mPad}:${sPad}`;
  return `${m}:${sPad}`;
}

function formatPace(secondsPerUnit: number): string {
  if (secondsPerUnit < 0 || !isFinite(secondsPerUnit)) return "0:00";
  const m = Math.floor(secondsPerUnit / 60);
  const s = Math.round(secondsPerUnit % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface CalcResult {
  paceSecPerKm: number;
  paceSecPerMi: number;
  totalSeconds: number;
  distanceKm: number;
}

export default function RunningPaceCalculatorPage() {
  const [mode, setMode] = useState<Mode>("pace");
  const [distValue, setDistValue] = useState("");
  const [distUnit, setDistUnit] = useState<DistUnit>("km");
  const [timeStr, setTimeStr] = useState("");
  const [paceStr, setPaceStr] = useState("");
  const [paceUnit, setPaceUnit] = useState<PaceUnit>("min/km");
  const [result, setResult] = useState<CalcResult | null>(null);

  function calculate() {
    if (mode === "pace") {
      const dist = parseFloat(distValue);
      const timeSec = parseTime(timeStr);
      if (!dist || dist <= 0 || timeSec === null || timeSec <= 0) return;
      const distKm = distUnit === "mi" ? dist * 1.60934 : dist;
      const paceSecPerKm = timeSec / distKm;
      const paceSecPerMi = paceSecPerKm * 1.60934;
      setResult({ paceSecPerKm, paceSecPerMi, totalSeconds: timeSec, distanceKm: distKm });
    } else if (mode === "time") {
      const dist = parseFloat(distValue);
      const paceSec = parseTime(paceStr);
      if (!dist || dist <= 0 || paceSec === null || paceSec <= 0) return;
      const distKm = distUnit === "mi" ? dist * 1.60934 : dist;
      const paceSecPerKm = paceUnit === "min/mi" ? paceSec / 1.60934 : paceSec;
      const paceSecPerMi = paceSecPerKm * 1.60934;
      const totalSeconds = paceSecPerKm * distKm;
      setResult({ paceSecPerKm, paceSecPerMi, totalSeconds, distanceKm: distKm });
    } else {
      const timeSec = parseTime(timeStr);
      const paceSec = parseTime(paceStr);
      if (timeSec === null || timeSec <= 0 || paceSec === null || paceSec <= 0)
        return;
      const paceSecPerKm = paceUnit === "min/mi" ? paceSec / 1.60934 : paceSec;
      const paceSecPerMi = paceSecPerKm * 1.60934;
      const distKm = timeSec / paceSecPerKm;
      setResult({ paceSecPerKm, paceSecPerMi, totalSeconds: timeSec, distanceKm: distKm });
    }
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Mode Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Calculate</label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "pace", label: "Pace" },
                { key: "time", label: "Time" },
                { key: "distance", label: "Distance" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setMode(key);
                  setResult(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  mode === key
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                Calculate {label}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Input (for pace & time modes) */}
        {(mode === "pace" || mode === "time") && (
          <div>
            <label className="block text-sm font-medium mb-1">Distance</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={distValue}
                onChange={(e) => setDistValue(e.target.value)}
                placeholder="5"
                className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
              />
              <div className="flex gap-1">
                {(["km", "mi"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setDistUnit(u)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                      distUnit === u
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Time Input (for pace & distance modes) */}
        {(mode === "pace" || mode === "distance") && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Time (HH:MM:SS or MM:SS)
            </label>
            <input
              type="text"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              placeholder="25:00"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        )}

        {/* Pace Input (for time & distance modes) */}
        {(mode === "time" || mode === "distance") && (
          <div>
            <label className="block text-sm font-medium mb-1">Pace</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={paceStr}
                onChange={(e) => setPaceStr(e.target.value)}
                placeholder="5:00"
                className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
              />
              <div className="flex gap-1">
                {(["min/km", "min/mi"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setPaceUnit(u)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border whitespace-nowrap ${
                      paceUnit === u
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate{" "}
          {mode === "pace" ? "Pace" : mode === "time" ? "Time" : "Distance"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Primary Result */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Pace</p>
              <p className="text-2xl font-bold">
                {formatPace(result.paceSecPerKm)}
              </p>
              <p className="text-sm text-stone-400">min/km</p>
              <p className="text-lg font-semibold mt-1">
                {formatPace(result.paceSecPerMi)}
              </p>
              <p className="text-sm text-stone-400">min/mi</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Time</p>
              <p className="text-2xl font-bold">
                {formatTime(result.totalSeconds)}
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Distance</p>
              <p className="text-2xl font-bold">
                {(Math.round(result.distanceKm * 100) / 100).toFixed(2)} km
              </p>
              <p className="text-sm text-stone-400">
                {(
                  Math.round((result.distanceKm / 1.60934) * 100) / 100
                ).toFixed(2)}{" "}
                mi
              </p>
            </div>
          </div>

          {/* Speed */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">Speed</p>
            <p className="text-xl font-bold">
              {(
                Math.round(
                  (result.distanceKm / (result.totalSeconds / 3600)) * 10
                ) / 10
              ).toFixed(1)}{" "}
              km/h
              <span className="text-stone-400 font-normal mx-2">|</span>
              {(
                Math.round(
                  (result.distanceKm /
                    1.60934 /
                    (result.totalSeconds / 3600)) *
                    10
                ) / 10
              ).toFixed(1)}{" "}
              mph
            </p>
          </div>

          {/* Race Projections */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-700 mb-3">
              Race Projections
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {RACE_DISTANCES.map((race) => {
                const projectedSec = result.paceSecPerKm * race.km;
                return (
                  <div
                    key={race.name}
                    className="flex items-center justify-between border border-stone-100 rounded-lg px-4 py-3"
                  >
                    <span className="text-sm font-medium text-stone-600">
                      {race.name}
                    </span>
                    <span className="text-sm font-bold">
                      {formatTime(projectedSec)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-stone-400 mt-3">
              Projections assume even pacing (linear scaling). Actual race times
              depend on fitness, terrain, weather, and pacing strategy.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">How to Use</p>
        <p>
          Select what you want to calculate, then enter the other two values.
          For time, use HH:MM:SS or MM:SS format. For pace, use MM:SS format.
          Race projections are based on linear scaling from your entered pace and
          are best used as rough guides for training planning.
        </p>
      </div>
    </ToolPageLayout>
  );
}
