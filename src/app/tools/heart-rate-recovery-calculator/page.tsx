"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("heart-rate-recovery-calculator")!;

type ExerciseType = "running" | "cycling" | "rowing" | "stair-climber" | "elliptical" | "other";

const EXERCISE_OPTIONS: { value: ExerciseType; label: string }[] = [
  { value: "running", label: "Running" },
  { value: "cycling", label: "Cycling" },
  { value: "rowing", label: "Rowing" },
  { value: "stair-climber", label: "Stair Climber" },
  { value: "elliptical", label: "Elliptical" },
  { value: "other", label: "Other" },
];

function rateHRR1(drop: number): { label: string; color: string; level: number } {
  if (drop > 50) return { label: "Excellent", color: "text-emerald-600", level: 6 };
  if (drop >= 41) return { label: "Very Good", color: "text-green-600", level: 5 };
  if (drop >= 31) return { label: "Good", color: "text-lime-600", level: 4 };
  if (drop >= 21) return { label: "Average", color: "text-yellow-600", level: 3 };
  if (drop >= 12) return { label: "Below Average", color: "text-orange-600", level: 2 };
  return { label: "Abnormal / Poor", color: "text-red-600", level: 1 };
}

function rateHRR2(drop: number): { label: string; color: string; level: number } {
  if (drop > 60) return { label: "Excellent", color: "text-emerald-600", level: 5 };
  if (drop >= 51) return { label: "Good", color: "text-green-600", level: 4 };
  if (drop >= 41) return { label: "Average", color: "text-yellow-600", level: 3 };
  if (drop >= 22) return { label: "Below Average", color: "text-orange-600", level: 2 };
  return { label: "Poor", color: "text-red-600", level: 1 };
}

function estimateFitnessAge(age: number, hrr1Level: number): number {
  const offset = (hrr1Level - 3) * 3;
  return Math.max(18, Math.min(80, age - offset));
}

function getGaugePercent(level: number, maxLevel: number): number {
  return Math.round((level / maxLevel) * 100);
}

interface Result {
  hrr1: number;
  hrr1Rating: { label: string; color: string; level: number };
  hrr2: number | null;
  hrr2Rating: { label: string; color: string; level: number } | null;
  fitnessAge: number;
  age: number;
  isAbnormal: boolean;
}

export default function HeartRateRecoveryCalculatorPage() {
  const [peakHR, setPeakHR] = useState("");
  const [hr1Min, setHr1Min] = useState("");
  const [hr2Min, setHr2Min] = useState("");
  const [age, setAge] = useState("");
  const [exerciseType, setExerciseType] = useState<ExerciseType>("running");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const peak = parseFloat(peakHR);
    const after1 = parseFloat(hr1Min);
    const a = parseFloat(age);
    if (!peak || !after1 || !a || peak <= 0 || after1 <= 0 || a <= 0) return;
    if (after1 >= peak) return;

    const hrr1 = peak - after1;
    const hrr1Rating = rateHRR1(hrr1);

    let hrr2: number | null = null;
    let hrr2Rating: { label: string; color: string; level: number } | null = null;
    const after2 = parseFloat(hr2Min);
    if (after2 && after2 > 0 && after2 < peak) {
      hrr2 = peak - after2;
      hrr2Rating = rateHRR2(hrr2);
    }

    const fitnessAge = estimateFitnessAge(a, hrr1Rating.level);

    setResult({
      hrr1,
      hrr1Rating,
      hrr2,
      hrr2Rating,
      fitnessAge,
      age: a,
      isAbnormal: hrr1 < 12,
    });
  }

  const ageNorms: { group: string; average: string }[] = [
    { group: "20-29", average: "25-35 bpm" },
    { group: "30-39", average: "22-32 bpm" },
    { group: "40-49", average: "20-28 bpm" },
    { group: "50-59", average: "18-25 bpm" },
    { group: "60+", average: "15-22 bpm" },
  ];

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Peak HR */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Peak Exercise Heart Rate (bpm)
          </label>
          <input
            type="number"
            value={peakHR}
            onChange={(e) => setPeakHR(e.target.value)}
            placeholder="170"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* HR after 1 min */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Heart Rate After 1 Minute (bpm)
          </label>
          <input
            type="number"
            value={hr1Min}
            onChange={(e) => setHr1Min(e.target.value)}
            placeholder="140"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* HR after 2 min (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Heart Rate After 2 Minutes (bpm){" "}
            <span className="text-stone-400 font-normal">- optional</span>
          </label>
          <input
            type="number"
            value={hr2Min}
            onChange={(e) => setHr2Min(e.target.value)}
            placeholder="120"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="35"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Exercise Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Exercise Type Performed
          </label>
          <select
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {EXERCISE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Recovery Score
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* HRR1 Big Card */}
          <div className="bg-white border-2 border-primary/40 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500 mb-1">
              1-Minute Heart Rate Recovery (HRR1)
            </p>
            <p className={`text-4xl font-bold ${result.hrr1Rating.color}`}>
              {result.hrr1} bpm
            </p>
            <p className={`text-lg font-semibold mt-1 ${result.hrr1Rating.color}`}>
              {result.hrr1Rating.label}
            </p>
            {/* Visual gauge */}
            <div className="mt-4 mx-auto max-w-xs">
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${getGaugePercent(result.hrr1Rating.level, 6)}%`,
                    background:
                      result.hrr1Rating.level <= 2
                        ? "#dc2626"
                        : result.hrr1Rating.level <= 3
                        ? "#ca8a04"
                        : "#16a34a",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Poor</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* HRR2 Card */}
          {result.hrr2 !== null && result.hrr2Rating && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-500 mb-1">
                2-Minute Heart Rate Recovery (HRR2)
              </p>
              <p className={`text-3xl font-bold ${result.hrr2Rating.color}`}>
                {result.hrr2} bpm
              </p>
              <p className={`text-base font-semibold mt-1 ${result.hrr2Rating.color}`}>
                {result.hrr2Rating.label}
              </p>
              <div className="mt-3 mx-auto max-w-xs">
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${getGaugePercent(result.hrr2Rating.level, 5)}%`,
                      background:
                        result.hrr2Rating.level <= 2
                          ? "#dc2626"
                          : result.hrr2Rating.level <= 3
                          ? "#ca8a04"
                          : "#16a34a",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          )}

          {/* Fitness Age */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-500">Estimated Fitness Age</p>
              <p className="text-3xl font-bold text-primary">{result.fitnessAge}</p>
              <p className="text-xs text-stone-400">
                {result.fitnessAge < result.age
                  ? `${result.age - result.fitnessAge} years younger than actual age`
                  : result.fitnessAge > result.age
                  ? `${result.fitnessAge - result.age} years older than actual age`
                  : "Matches your actual age"}
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
              <p className="text-sm text-stone-500">Cardiovascular Fitness</p>
              <p className={`text-2xl font-bold ${result.hrr1Rating.color}`}>
                {result.hrr1Rating.label}
              </p>
              <p className="text-xs text-stone-400 mt-1">Based on 1-minute recovery</p>
            </div>
          </div>

          {/* Age norms comparison */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Average 1-Min HRR by Age Group
            </h3>
            <div className="space-y-2">
              {ageNorms.map((n) => (
                <div
                  key={n.group}
                  className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0"
                >
                  <span className="text-stone-600">Age {n.group}</span>
                  <span className="font-medium text-stone-800">{n.average}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400">
              Your result: {result.hrr1} bpm drop in 1 minute
            </p>
          </div>

          {/* What this means */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">What This Means</h3>
            <p className="text-sm text-stone-600">
              Heart rate recovery measures how quickly your heart rate drops after
              intense exercise. A faster recovery indicates better cardiovascular fitness
              and autonomic nervous system function. Your heart dropped{" "}
              <strong>{result.hrr1} bpm</strong> in the first minute, placing you in the{" "}
              <strong>{result.hrr1Rating.label.toLowerCase()}</strong> category.
            </p>
            {result.hrr2 !== null && (
              <p className="text-sm text-stone-600">
                Your 2-minute recovery of <strong>{result.hrr2} bpm</strong> is rated{" "}
                <strong>{result.hrr2Rating?.label.toLowerCase()}</strong>. The second
                minute of recovery provides additional insight into parasympathetic
                reactivation.
              </p>
            )}
          </div>

          {/* Warning if abnormal */}
          {result.isAbnormal && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-red-800">When to See a Doctor</h3>
              <p className="text-sm text-red-700">
                A heart rate recovery of less than 12 bpm after 1 minute is considered
                abnormal and has been associated with increased cardiovascular risk.
                This does not mean you have a heart condition, but it is worth discussing
                with your healthcare provider, especially if you experience dizziness,
                chest pain, or shortness of breath during exercise.
              </p>
            </div>
          )}

          {/* Improvement tips */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">How to Improve Your HRR</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>
                  <strong>Consistent aerobic exercise</strong> -- aim for 150+ minutes
                  of moderate-intensity cardio per week.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>
                  <strong>Interval training</strong> -- alternating high and low
                  intensity trains your heart to recover faster.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>
                  <strong>Proper cool-downs</strong> -- always include 5-10 minutes of
                  gradually decreasing intensity after exercise.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>
                  <strong>Sleep and recovery</strong> -- 7-9 hours of quality sleep
                  supports autonomic nervous system health.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">5.</span>
                <span>
                  <strong>Stress management</strong> -- chronic stress impairs
                  parasympathetic function; try meditation or breathing exercises.
                </span>
              </li>
            </ul>
          </div>

          {/* Test protocol */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Test Protocol for Next Time
            </h3>
            <ol className="space-y-2 text-sm text-stone-600 list-decimal list-inside">
              <li>
                Warm up for 5-10 minutes, then exercise at high intensity until you
                reach your target peak heart rate (roughly 85-95% of max).
              </li>
              <li>
                Note your peak heart rate immediately when you stop exercising.
              </li>
              <li>
                Begin a cool-down walk (do not sit or lie down). Record your heart rate
                at exactly 1 minute and optionally at 2 minutes.
              </li>
              <li>
                For consistency, use the same exercise type and intensity each time you
                test. Retest every 4-8 weeks to track progress.
              </li>
            </ol>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
