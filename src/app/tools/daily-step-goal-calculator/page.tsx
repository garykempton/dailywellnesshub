"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("daily-step-goal-calculator")!;

type ActivityLevel = "sedentary" | "low" | "somewhat" | "active" | "very-active";
type Goal = "general" | "weight-loss" | "heart" | "longevity" | "fitness";
type Limitation = "none" | "joints" | "injury" | "mobility";

const ACTIVITY_STEPS: Record<ActivityLevel, number> = {
  sedentary: 2500,
  low: 4000,
  somewhat: 6250,
  active: 8750,
  "very-active": 11000,
};

const STEP_BENEFITS: { threshold: number; label: string; benefit: string }[] = [
  { threshold: 3000, label: "3,000 steps", benefit: "Reduces risk of depression and improves mood through light daily movement." },
  { threshold: 5000, label: "5,000 steps", benefit: "Lowers risk of metabolic syndrome and supports basic cardiovascular health." },
  { threshold: 7500, label: "7,500 steps", benefit: "Significant reduction in all-cause mortality, especially in adults over 60. Often cited as the optimal minimum." },
  { threshold: 10000, label: "10,000 steps", benefit: "Associated with lower risk of heart disease, Type 2 diabetes, and some cancers. Supports weight management." },
];

interface Results {
  goalSteps: number;
  currentSteps: number;
  weeklyPlan: { week: number; steps: number }[];
  calories: number;
  distanceKm: number;
  timeMinutes: number;
}

export default function DailyStepGoalCalculatorPage() {
  const [age, setAge] = useState<string>("");
  const [activity, setActivity] = useState<ActivityLevel>("sedentary");
  const [goal, setGoal] = useState<Goal>("general");
  const [limitations, setLimitations] = useState<Limitation[]>(["none"]);
  const [results, setResults] = useState<Results | null>(null);

  function toggleLimitation(lim: Limitation) {
    if (lim === "none") {
      setLimitations(["none"]);
      return;
    }
    setLimitations((prev) => {
      const without = prev.filter((l) => l !== "none" && l !== lim);
      if (prev.includes(lim)) {
        return without.length === 0 ? ["none"] : without;
      }
      return [...without, lim];
    });
  }

  function calculate() {
    const ageNum = Number(age);
    if (!ageNum || ageNum < 10 || ageNum > 120) return;

    // Base recommendation by age
    let minSteps: number;
    let maxSteps: number;
    if (ageNum < 30) {
      minSteps = 8000;
      maxSteps = 10000;
    } else if (ageNum < 50) {
      minSteps = 7500;
      maxSteps = 10000;
    } else if (ageNum < 65) {
      minSteps = 7000;
      maxSteps = 8500;
    } else {
      minSteps = 6000;
      maxSteps = 8000;
    }

    let targetSteps = Math.round((minSteps + maxSteps) / 2);

    // Goal adjustments
    switch (goal) {
      case "weight-loss":
        targetSteps += 2000;
        break;
      case "heart":
        targetSteps = Math.max(targetSteps, 7500);
        break;
      case "longevity":
        targetSteps = Math.max(targetSteps, 7500);
        break;
      case "fitness":
        targetSteps += 2500;
        break;
    }

    // Limitation adjustments
    const hasLimitation = !limitations.includes("none");
    if (hasLimitation) {
      const reductionFactor = limitations.length >= 2 ? 0.7 : 0.75;
      targetSteps = Math.round(targetSteps * reductionFactor);
    }

    // Ensure target is at least 3000
    targetSteps = Math.max(targetSteps, 3000);

    const currentSteps = ACTIVITY_STEPS[activity];

    // Progressive 4-week ramp-up
    const weeklyPlan: { week: number; steps: number }[] = [];
    const stepGap = targetSteps - currentSteps;

    if (stepGap <= 1000) {
      // Already close to goal
      for (let w = 1; w <= 4; w++) {
        weeklyPlan.push({ week: w, steps: targetSteps });
      }
    } else {
      const increment = Math.round(stepGap / 4);
      for (let w = 1; w <= 4; w++) {
        const weekSteps = Math.min(currentSteps + increment * w, targetSteps);
        weeklyPlan.push({ week: w, steps: weekSteps });
      }
    }

    const calories = Math.round(targetSteps * 0.04);
    const distanceKm = Math.round((targetSteps / 1300) * 10) / 10;
    const timeMinutes = Math.round(targetSteps / 100);

    setResults({
      goalSteps: targetSteps,
      currentSteps,
      weeklyPlan,
      calories,
      distanceKm,
      timeMinutes,
    });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Inputs */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Your Information</h2>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
            <input
              type="number"
              min={10}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Current Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              <option value="sedentary">Sedentary (under 3,000 steps/day)</option>
              <option value="low">Low Active (3,000-5,000 steps/day)</option>
              <option value="somewhat">Somewhat Active (5,000-7,500 steps/day)</option>
              <option value="active">Active (7,500-10,000 steps/day)</option>
              <option value="very-active">Very Active (10,000+ steps/day)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Primary Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              <option value="general">General Health</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="heart">Heart Health</option>
              <option value="longevity">Longevity / Mortality Reduction</option>
              <option value="fitness">Fitness Improvement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Physical Limitations
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: "none", label: "None" },
                  { key: "joints", label: "Joint Issues" },
                  { key: "injury", label: "Recovering from Injury" },
                  { key: "mobility", label: "Mobility Challenges" },
                ] as { key: Limitation; label: string }[]
              ).map((lim) => (
                <button
                  key={lim.key}
                  onClick={() => toggleLimitation(lim.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    limitations.includes(lim.key)
                      ? "bg-primary text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {lim.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!age || Number(age) < 10}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Step Goal
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Main Goal Card */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 text-center space-y-2">
              <p className="text-sm text-stone-500">Your Recommended Daily Step Goal</p>
              <p className="text-5xl font-bold text-primary">
                {results.goalSteps.toLocaleString()}
              </p>
              <p className="text-sm text-stone-500">steps per day</p>
            </div>

            {/* Current vs Goal */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Current vs Goal</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-stone-600">
                    {results.currentSteps.toLocaleString()}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Estimated Current</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {results.goalSteps.toLocaleString()}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Daily Goal</p>
                </div>
              </div>
              {results.goalSteps > results.currentSteps && (
                <div className="w-full bg-stone-100 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((results.currentSteps / results.goalSteps) * 100))}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* 4-Week Ramp-Up */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">4-Week Progressive Plan</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.weeklyPlan.map((w) => (
                  <div key={w.week} className="bg-stone-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-stone-500 mb-1">Week {w.week}</p>
                    <p className="text-lg font-bold text-stone-800">
                      {w.steps.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-400">steps/day</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-stone-500">
                Increase gradually by roughly 1,000 steps per week to avoid overuse injuries and
                build a sustainable habit.
              </p>
            </div>

            {/* Equivalents */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">What Your Goal Looks Like</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-primary">~{results.calories}</p>
                  <p className="text-xs text-stone-500">Calories Burned</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-primary">~{results.distanceKm} km</p>
                  <p className="text-xs text-stone-500">Distance</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xl font-bold text-primary">~{results.timeMinutes} min</p>
                  <p className="text-xs text-stone-500">Walking Time</p>
                </div>
              </div>
            </div>

            {/* Health Benefits by Threshold */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">
                Research-Backed Benefits by Step Count
              </h2>
              {STEP_BENEFITS.map((b) => (
                <div
                  key={b.threshold}
                  className={`rounded-lg p-4 border ${
                    results.goalSteps >= b.threshold
                      ? "bg-green-50 border-green-200"
                      : "bg-stone-50 border-stone-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-semibold ${
                        results.goalSteps >= b.threshold
                          ? "text-green-700"
                          : "text-stone-500"
                      }`}
                    >
                      {b.label}
                    </span>
                    {results.goalSteps >= b.threshold && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Included in your goal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-600">{b.benefit}</p>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Tips to Increase Your Steps</h2>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  Take a 10-minute walk after each meal. Three walks add roughly 3,000 steps.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Park further from your destination or get off the bus one stop early.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Take phone calls while walking, whether at home or in the office.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  Set hourly movement reminders to break up long periods of sitting.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">5.</span>
                  Use stairs instead of lifts. Climbing stairs also adds intensity.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">6.</span>
                  Walk with a friend or listen to podcasts to make walking more enjoyable.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
