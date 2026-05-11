"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("pace-converter")!;

const RACE_DISTANCES = [
  { name: "5K", km: 5 },
  { name: "10K", km: 10 },
  { name: "Half Marathon", km: 21.0975 },
  { name: "Marathon", km: 42.195 },
];

const PACE_BENCHMARKS = [
  { label: "Walking", pacePerKm: 600 },
  { label: "Jogging", pacePerKm: 420 },
  { label: "Recreational", pacePerKm: 330 },
  { label: "Competitive", pacePerKm: 270 },
  { label: "Elite", pacePerKm: 180 },
];

function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0 || !isFinite(totalSeconds)) return "0:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  const sPad = s.toString().padStart(2, "0");
  const mPad = m.toString().padStart(2, "0");
  if (h > 0) return `${h}:${mPad}:${sPad}`;
  return `${m}:${sPad}`;
}

function formatPace(seconds: number): string {
  if (seconds <= 0 || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PaceConverterPage() {
  const [direction, setDirection] = useState<"kmToMile" | "mileToKm">("kmToMile");
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(30);

  const inputTotalSeconds = minutes * 60 + seconds;
  const isValid = inputTotalSeconds > 0 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;

  // Compute paces in both units (seconds per km / seconds per mile)
  let pacePerKm: number;
  let pacePerMile: number;
  if (direction === "kmToMile") {
    pacePerKm = inputTotalSeconds;
    pacePerMile = inputTotalSeconds * 1.60934;
  } else {
    pacePerMile = inputTotalSeconds;
    pacePerKm = inputTotalSeconds / 1.60934;
  }

  const speedKmh = isValid ? 60 / (pacePerKm / 60) : 0;
  const speedMph = isValid ? 60 / (pacePerMile / 60) : 0;

  const convertedLabel = direction === "kmToMile" ? "min/mile" : "min/km";
  const convertedValue = direction === "kmToMile" ? pacePerMile : pacePerKm;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Direction Toggle */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Conversion Direction</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setDirection("kmToMile")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                direction === "kmToMile"
                  ? "bg-primary text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              min/km &rarr; min/mile
            </button>
            <button
              onClick={() => setDirection("mileToKm")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                direction === "mileToKm"
                  ? "bg-primary text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              min/mile &rarr; min/km
            </button>
          </div>
        </div>

        {/* Pace Input */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">
            Enter Pace ({direction === "kmToMile" ? "min/km" : "min/mile"})
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm text-stone-600 mb-1">Minutes</label>
              <input
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
            <span className="text-2xl font-bold text-stone-400 mt-5">:</span>
            <div className="flex-1">
              <label className="block text-sm text-stone-600 mb-1">Seconds</label>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {isValid && (
          <>
            {/* Converted Result */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Converted Pace</h2>
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">
                  {formatPace(convertedValue)}
                </span>
                <span className="text-lg text-stone-500 ml-2">{convertedLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold text-stone-800">{speedKmh.toFixed(1)}</div>
                  <div className="text-sm text-stone-500">km/h</div>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold text-stone-800">{speedMph.toFixed(1)}</div>
                  <div className="text-sm text-stone-500">mph</div>
                </div>
              </div>
            </div>

            {/* Race Finish Time Estimates */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Race Finish Time Estimates</h2>
              <div className="grid grid-cols-2 gap-4">
                {RACE_DISTANCES.map((race) => {
                  const finishSeconds = pacePerKm * race.km;
                  const distMiles = race.km / 1.60934;
                  return (
                    <div key={race.name} className="p-4 bg-stone-50 rounded-lg text-center">
                      <div className="text-sm font-medium text-stone-500 mb-1">{race.name}</div>
                      <div className="text-xl font-bold text-stone-800">
                        {formatTime(finishSeconds)}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {formatPace(pacePerKm)}/km &middot; {formatPace(pacePerMile)}/mi
                      </div>
                      <div className="text-xs text-stone-400">
                        {race.km} km / {distMiles.toFixed(2)} mi
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pace Comparison Chart */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Pace Comparison</h2>
              <div className="space-y-3">
                {PACE_BENCHMARKS.map((benchmark) => {
                  const maxPace = 660; // 11:00/km for chart scale
                  const benchmarkWidth = Math.min((benchmark.pacePerKm / maxPace) * 100, 100);
                  const userWidth = Math.min((pacePerKm / maxPace) * 100, 100);
                  return (
                    <div key={benchmark.label} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">{benchmark.label}</span>
                        <span className="text-stone-400">{formatPace(benchmark.pacePerKm)}/km</span>
                      </div>
                      <div className="relative h-5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-stone-300 rounded-full"
                          style={{ width: `${benchmarkWidth}%` }}
                        />
                        <div
                          className="absolute top-0 h-full w-1 bg-primary rounded-full"
                          style={{ left: `${userWidth}%` }}
                          title={`Your pace: ${formatPace(pacePerKm)}/km`}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="text-xs text-stone-400 text-center pt-1">
                  The vertical bar shows your current pace. Shorter bars = faster pace.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
