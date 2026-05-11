"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("race-time-predictor")!;

const DISTANCES: { name: string; km: number }[] = [
  { name: "1 Mile", km: 1.60934 },
  { name: "5K", km: 5 },
  { name: "10K", km: 10 },
  { name: "Half Marathon", km: 21.0975 },
  { name: "Marathon", km: 42.195 },
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

function formatPace(secondsPerUnit: number): string {
  if (secondsPerUnit <= 0 || !isFinite(secondsPerUnit)) return "0:00";
  const m = Math.floor(secondsPerUnit / 60);
  const s = Math.round(secondsPerUnit % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface PredictionResult {
  predictedSeconds: number;
  pacePerKm: number;
  pacePerMile: number;
  targetDistKm: number;
  targetDistName: string;
  knownDistKm: number;
  knownTimeSec: number;
  allPredictions: { name: string; km: number; seconds: number }[];
}

function getTrainingTips(targetKm: number): string[] {
  if (targetKm <= 1.7) {
    return [
      "Focus on speed work: intervals of 200-400m at goal pace",
      "Include tempo runs at slightly slower than race pace",
      "Practice race-pace efforts to dial in your effort level",
    ];
  }
  if (targetKm <= 5.5) {
    return [
      "Build a base of 25-40 km per week with easy runs",
      "Include one tempo run and one interval session per week",
      "Practice negative splitting in training runs",
    ];
  }
  if (targetKm <= 11) {
    return [
      "Build weekly mileage to 35-55 km over 8-10 weeks",
      "Include a weekly long run of 12-16 km",
      "Add tempo runs at target 10K pace for race-specific fitness",
    ];
  }
  if (targetKm <= 22) {
    return [
      "Build to 40-65 km per week with gradual increases",
      "Long runs of 18-22 km are essential for half marathon preparation",
      "Practice race-day nutrition during long runs",
      "Include marathon-pace tempo runs of 10-15 km",
    ];
  }
  return [
    "Build to 55-90 km per week over 12-16 weeks minimum",
    "Long runs of 28-35 km are the cornerstone of marathon training",
    "Practice fuelling every 30-45 minutes during long runs",
    "Include marathon-pace tempo runs of 15-25 km",
    "Taper for 2-3 weeks before race day to arrive fresh",
  ];
}

export default function RaceTimePredictorPage() {
  const [knownDist, setKnownDist] = useState("5K");
  const [customKnownKm, setCustomKnownKm] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [targetDist, setTargetDist] = useState("Half Marathon");
  const [customTargetKm, setCustomTargetKm] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);

  function getDistKm(name: string, customKm: string): number | null {
    if (name === "Custom") {
      const v = parseFloat(customKm);
      return v > 0 ? v : null;
    }
    const found = DISTANCES.find((d) => d.name === name);
    return found ? found.km : null;
  }

  function calculate() {
    const d1 = getDistKm(knownDist, customKnownKm);
    const d2 = getDistKm(targetDist, customTargetKm);
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    const s = parseFloat(seconds) || 0;
    const t1 = h * 3600 + m * 60 + s;

    if (!d1 || !d2 || t1 <= 0) return;

    const predictedSeconds = t1 * Math.pow(d2 / d1, 1.06);
    const pacePerKm = predictedSeconds / d2;
    const pacePerMile = pacePerKm * 1.60934;

    const allPredictions = DISTANCES.map((dist) => ({
      name: dist.name,
      km: dist.km,
      seconds: t1 * Math.pow(dist.km / d1, 1.06),
    }));

    setResult({
      predictedSeconds,
      pacePerKm,
      pacePerMile,
      targetDistKm: d2,
      targetDistName: targetDist === "Custom" ? `${customTargetKm} km` : targetDist,
      knownDistKm: d1,
      knownTimeSec: t1,
      allPredictions,
    });
  }

  const distOptions = [...DISTANCES.map((d) => d.name), "Custom"];

  const distJumpRatio = result
    ? Math.max(result.targetDistKm, result.knownDistKm) /
      Math.min(result.targetDistKm, result.knownDistKm)
    : 1;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Known Race Distance */}
        <div>
          <label className="block text-sm font-medium mb-1">Known Race Distance</label>
          <select
            value={knownDist}
            onChange={(e) => setKnownDist(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {distOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {knownDist === "Custom" && (
            <input
              type="number"
              value={customKnownKm}
              onChange={(e) => setCustomKnownKm(e.target.value)}
              placeholder="Distance in km"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 mt-2"
            />
          )}
        </div>

        {/* Known Race Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Known Race Time</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Hrs"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
              <span className="text-xs text-stone-400">Hours</span>
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="Min"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
              <span className="text-xs text-stone-400">Minutes</span>
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="Sec"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
              <span className="text-xs text-stone-400">Seconds</span>
            </div>
          </div>
        </div>

        {/* Target Race Distance */}
        <div>
          <label className="block text-sm font-medium mb-1">Target Race Distance</label>
          <select
            value={targetDist}
            onChange={(e) => setTargetDist(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {distOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {targetDist === "Custom" && (
            <input
              type="number"
              value={customTargetKm}
              onChange={(e) => setCustomTargetKm(e.target.value)}
              placeholder="Distance in km"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 mt-2"
            />
          )}
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Predict Race Time
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Primary Prediction */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-sm text-amber-700 mb-1 font-medium">
              Predicted {result.targetDistName} Finish Time
            </p>
            <p className="text-4xl font-bold text-amber-900">
              {formatTime(result.predictedSeconds)}
            </p>
            <p className="text-sm text-amber-600 mt-2">
              Based on {knownDist === "Custom" ? `${customKnownKm} km` : knownDist} in{" "}
              {formatTime(result.knownTimeSec)}
            </p>
          </div>

          {/* Pace */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Required Pace</p>
              <p className="text-2xl font-bold">{formatPace(result.pacePerKm)}</p>
              <p className="text-sm text-stone-400">min/km</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Required Pace</p>
              <p className="text-2xl font-bold">{formatPace(result.pacePerMile)}</p>
              <p className="text-sm text-stone-400">min/mile</p>
            </div>
          </div>

          {/* Mile Splits Table */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-700 mb-3">
              Pace Per Mile Splits
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 px-2 text-stone-500">Mile</th>
                    <th className="text-right py-2 px-2 text-stone-500">Split</th>
                    <th className="text-right py-2 px-2 text-stone-500">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    { length: Math.ceil(result.targetDistKm / 1.60934) },
                    (_, i) => {
                      const mileNum = i + 1;
                      const totalMiles = result.targetDistKm / 1.60934;
                      const isPartial = mileNum > Math.floor(totalMiles);
                      const fraction = isPartial ? totalMiles - Math.floor(totalMiles) : 1;
                      const splitSec = result.pacePerMile * fraction;
                      const cumSec = result.pacePerMile * Math.min(mileNum, totalMiles);
                      return (
                        <tr key={mileNum} className="border-b border-stone-100">
                          <td className="py-2 px-2 text-stone-600">
                            {isPartial ? `${totalMiles.toFixed(2)}` : mileNum}
                          </td>
                          <td className="py-2 px-2 text-right font-mono">
                            {formatPace(splitSec)}
                          </td>
                          <td className="py-2 px-2 text-right font-mono">
                            {formatTime(cumSec)}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* All Standard Distance Predictions */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-700 mb-3">
              Predictions for All Standard Distances
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {result.allPredictions.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between border border-stone-100 rounded-lg px-4 py-3"
                >
                  <span className="text-sm font-medium text-stone-600">{p.name}</span>
                  <span className="text-sm font-bold">{formatTime(p.seconds)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Note */}
          <div
            className={`rounded-xl p-4 text-sm ${
              distJumpRatio > 6
                ? "bg-red-50 border border-red-200 text-red-700"
                : distJumpRatio > 3
                ? "bg-amber-50 border border-amber-200 text-amber-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            <p className="font-medium mb-1">Prediction Confidence</p>
            {distJumpRatio > 6 ? (
              <p>
                Large distance jump detected (ratio {distJumpRatio.toFixed(1)}x).
                Predictions between very different distances are less reliable. Use this
                as a rough guide and consider intermediate races for more accurate data.
              </p>
            ) : distJumpRatio > 3 ? (
              <p>
                Moderate distance jump (ratio {distJumpRatio.toFixed(1)}x). Prediction is
                reasonable but actual time will depend heavily on distance-specific
                training, race-day nutrition, and pacing strategy.
              </p>
            ) : (
              <p>
                Adjacent distance prediction (ratio {distJumpRatio.toFixed(1)}x). This is
                the most reliable type of prediction. With proper training, your actual
                time should be close to this estimate.
              </p>
            )}
          </div>

          {/* Negative Split Strategy */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-medium text-stone-700">
              Negative Split Strategy
            </h3>
            <p className="text-sm text-stone-600">
              Running the second half faster than the first is a proven race strategy.
              Consider starting 5-10 seconds per mile slower than goal pace, then
              gradually increasing to 5-10 seconds faster in the second half.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border border-stone-100 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-500">First Half Pace</p>
                <p className="text-sm font-bold">
                  {formatPace(result.pacePerMile + 8)} /mi
                </p>
              </div>
              <div className="border border-stone-100 rounded-lg px-4 py-3">
                <p className="text-xs text-stone-500">Second Half Pace</p>
                <p className="text-sm font-bold">
                  {formatPace(result.pacePerMile - 8)} /mi
                </p>
              </div>
            </div>
          </div>

          {/* Training Considerations */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-medium text-stone-700">
              Training Considerations for {result.targetDistName}
            </h3>
            <ul className="space-y-2">
              {getTrainingTips(result.targetDistKm).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="text-primary mt-0.5">&#8226;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About This Calculator</p>
        <p>
          This tool uses the Riegel formula (T2 = T1 x (D2/D1)^1.06) to predict race
          times. The formula is widely used by running coaches and is most accurate when
          predicting between adjacent distances. Use a recent race result (within 2-3
          months) run at full effort for the best accuracy. Predictions assume proper
          training for the target distance.
        </p>
      </div>
    </ToolPageLayout>
  );
}
