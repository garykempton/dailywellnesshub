"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("push-up-test")!;

type Sex = "male" | "female";
type AgeGroup = "20-29" | "30-39" | "40-49" | "50-59" | "60+";
type Rating = "Excellent" | "Good" | "Average" | "Below Average" | "Poor";

const AGE_GROUPS: AgeGroup[] = ["20-29", "30-39", "40-49", "50-59", "60+"];

// ACSM-based push-up norms: [Excellent min, Good min, Good max, Average min, Average max, Below min, Below max, Poor below]
const NORMS: Record<Sex, Record<AgeGroup, { excellent: number; good: [number, number]; average: [number, number]; below: [number, number]; poor: number }>> = {
  male: {
    "20-29": { excellent: 36, good: [29, 35], average: [22, 28], below: [17, 21], poor: 17 },
    "30-39": { excellent: 30, good: [22, 29], average: [17, 21], below: [12, 16], poor: 12 },
    "40-49": { excellent: 25, good: [17, 24], average: [13, 16], below: [10, 12], poor: 10 },
    "50-59": { excellent: 21, good: [13, 20], average: [10, 12], below: [7, 9], poor: 7 },
    "60+":   { excellent: 18, good: [11, 17], average: [8, 10], below: [5, 7], poor: 5 },
  },
  female: {
    "20-29": { excellent: 30, good: [21, 29], average: [15, 20], below: [10, 14], poor: 10 },
    "30-39": { excellent: 27, good: [20, 26], average: [13, 19], below: [8, 12], poor: 8 },
    "40-49": { excellent: 24, good: [15, 23], average: [11, 14], below: [5, 10], poor: 5 },
    "50-59": { excellent: 21, good: [11, 20], average: [7, 10], below: [2, 6], poor: 2 },
    "60+":   { excellent: 17, good: [12, 16], average: [5, 11], below: [2, 4], poor: 2 },
  },
};

function getAgeGroup(age: number): AgeGroup {
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  return "60+";
}

function getRating(count: number, sex: Sex, ageGroup: AgeGroup): Rating {
  const n = NORMS[sex][ageGroup];
  if (count >= n.excellent) return "Excellent";
  if (count >= n.good[0]) return "Good";
  if (count >= n.average[0]) return "Average";
  if (count >= n.below[0]) return "Below Average";
  return "Poor";
}

const RATING_COLORS: Record<Rating, string> = {
  Excellent: "bg-green-50 border-green-200 text-green-700",
  Good: "bg-emerald-50 border-emerald-200 text-emerald-700",
  Average: "bg-amber-50 border-amber-200 text-amber-700",
  "Below Average": "bg-orange-50 border-orange-200 text-orange-700",
  Poor: "bg-red-50 border-red-200 text-red-700",
};

const RATING_PERCENTILE: Record<Rating, string> = {
  Excellent: "Top 20%",
  Good: "Top 20-40%",
  Average: "Middle 40-60%",
  "Below Average": "Bottom 20-40%",
  Poor: "Bottom 20%",
};

function getNextGoal(rating: Rating, sex: Sex, ageGroup: AgeGroup): { nextRating: string; target: number } | null {
  const n = NORMS[sex][ageGroup];
  if (rating === "Poor") return { nextRating: "Below Average", target: n.below[0] };
  if (rating === "Below Average") return { nextRating: "Average", target: n.average[0] };
  if (rating === "Average") return { nextRating: "Good", target: n.good[0] };
  if (rating === "Good") return { nextRating: "Excellent", target: n.excellent };
  return null;
}

function getTrainingPlan(rating: Rating): { title: string; plan: string } {
  switch (rating) {
    case "Poor":
      return {
        title: "Beginner Programme",
        plan: "Start with incline push-ups (hands on a bench or wall). Aim for 3 sets of 5 repetitions, 3 times per week. As these become comfortable, lower the incline progressively until you can do standard push-ups.",
      };
    case "Below Average":
      return {
        title: "Building Strength",
        plan: "Perform 3 sets of 8-10 push-ups, 3 times per week. Add 1 rep to each set per session. Focus on full range of motion and controlled tempo. Rest 60-90 seconds between sets.",
      };
    case "Average":
      return {
        title: "Grease the Groove",
        plan: "Try the grease-the-groove method: do 5 sets spread throughout the day at roughly 60% of your max. This high-frequency, sub-maximal approach builds endurance rapidly without excessive fatigue.",
      };
    case "Good":
      return {
        title: "Add Variations",
        plan: "Introduce push-up variations: diamond push-ups, wide-grip, and decline push-ups. Aim for 3 sets of 15 across different variations. This builds strength across multiple angles and prepares you for advanced work.",
      };
    case "Excellent":
      return {
        title: "Advanced Maintenance",
        plan: "Maintain your level with regular push-up work. Add challenge with weighted push-ups (backpack with weight), archer push-ups, plyometric push-ups, or ring push-ups. Consider pursuing one-arm push-up progressions.",
      };
  }
}

interface TestResult {
  rating: Rating;
  ageGroup: AgeGroup;
  percentile: string;
  nextGoal: { nextRating: string; target: number } | null;
  training: { title: string; plan: string };
  norms: typeof NORMS.male["20-29"];
  count: number;
}

export default function PushUpTestPage() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [count, setCount] = useState("");
  const [testType, setTestType] = useState("failure");
  const [result, setResult] = useState<TestResult | null>(null);

  function calculate() {
    const ageNum = Number(age) || 0;
    const countNum = Number(count) || 0;
    if (ageNum < 15 || countNum < 0) return;

    const ageGroup = getAgeGroup(ageNum);
    const rating = getRating(countNum, sex, ageGroup);
    const percentile = RATING_PERCENTILE[rating];
    const nextGoal = getNextGoal(rating, sex, ageGroup);
    const training = getTrainingPlan(rating);
    const norms = NORMS[sex][ageGroup];

    setResult({ rating, ageGroup, percentile, nextGoal, training, norms, count: countNum });
  }

  // Build visual range bar data
  function getRangeSegments() {
    if (!result) return [];
    const n = result.norms;
    return [
      { label: "Poor", min: 0, max: n.poor - 1, color: "bg-red-400" },
      { label: "Below Avg", min: n.below[0], max: n.below[1], color: "bg-orange-400" },
      { label: "Average", min: n.average[0], max: n.average[1], color: "bg-amber-400" },
      { label: "Good", min: n.good[0], max: n.good[1], color: "bg-emerald-400" },
      { label: "Excellent", min: n.excellent, max: n.excellent + 15, color: "bg-green-500" },
    ];
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            min="15"
            max="100"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium mb-2">Sex</label>
          <div className="flex gap-4">
            {(["male", "female"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  checked={sex === s}
                  onChange={() => setSex(s)}
                  className="accent-primary"
                />
                <span className="text-sm capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Test type */}
        <div>
          <label className="block text-sm font-medium mb-1">Test type</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            <option value="failure">Standard (to failure)</option>
            <option value="timed">1-minute timed test</option>
          </select>
        </div>

        {/* Push-up count */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Push-ups completed
          </label>
          <input
            type="number"
            min="0"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="25"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-stone-500 mt-1">
            Max reps in one set without resting on the ground
          </p>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Assess My Fitness
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Rating card */}
          <div className={`border rounded-xl p-5 text-center ${RATING_COLORS[result.rating]}`}>
            <p className="text-sm font-medium mb-1">Your Push-Up Rating</p>
            <p className="text-4xl font-bold">{result.rating}</p>
            <p className="text-sm mt-2">
              You completed {result.count} push-ups — rated{" "}
              <span className="font-semibold">{result.rating}</span> for {sex}s aged{" "}
              {result.ageGroup}
            </p>
          </div>

          {/* Percentile */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-500">Estimated Percentile</p>
            <p className="text-2xl font-bold">{result.percentile}</p>
            <p className="text-xs text-stone-500 mt-1">of {sex}s in the {result.ageGroup} age group</p>
          </div>

          {/* Visual range bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-4">
              Where you fall in your age group
            </p>
            <div className="space-y-2">
              {getRangeSegments().map((seg) => {
                const maxVal = seg.max;
                const fullWidth = (result.norms.excellent + 15);
                const barPct = Math.min(((seg.max - seg.min + 1) / fullWidth) * 100, 100);
                const isInSegment =
                  result.count >= seg.min && result.count <= seg.max;
                return (
                  <div key={seg.label} className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 w-20 text-right shrink-0">
                      {seg.label}
                    </span>
                    <div className="flex-1 relative">
                      <div className="bg-stone-100 rounded-full h-6 overflow-hidden">
                        <div
                          className={`h-6 rounded-full ${seg.color} ${
                            isInSegment ? "ring-2 ring-stone-800 ring-offset-1" : ""
                          }`}
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-stone-400 mt-0.5 block">
                        {seg.min === 0 ? `<${maxVal + 1}` : `${seg.min}-${maxVal}`}
                      </span>
                    </div>
                    {isInSegment && (
                      <span className="text-xs font-bold text-stone-800 shrink-0">You</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next level goal */}
          {result.nextGoal && (
            <div className="bg-white border border-stone-200 rounded-xl p-5">
              <p className="text-sm font-medium text-stone-700 mb-1">Next Level Goal</p>
              <p className="text-sm text-stone-600">
                To reach <span className="font-semibold">{result.nextGoal.nextRating}</span>, aim
                for{" "}
                <span className="font-semibold text-primary">{result.nextGoal.target} push-ups</span>.
                That is {result.nextGoal.target - result.count} more than your current count.
              </p>
            </div>
          )}

          {/* Harvard study reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm font-medium text-blue-700 mb-1">Research Insight</p>
            <p className="text-sm text-blue-600">
              A 2019 Harvard study of over 1,100 firefighters found that men who could complete 40
              or more push-ups had a 96% lower risk of cardiovascular disease events over 10 years
              compared to those who could do fewer than 10. Push-up capacity is a simple, practical
              marker of heart health.
            </p>
          </div>

          {/* Training plan */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Training Plan: {result.training.title}
            </p>
            <p className="text-sm text-stone-600">{result.training.plan}</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About this test</p>
        <p className="mb-2">
          Push-up norms are based on ACSM (American College of Sports Medicine) guidelines. The
          standard test counts the maximum number of push-ups performed consecutively without resting
          on the ground. Maintain proper form: body straight from head to heels, lower your chest to
          within a fist width of the floor, and fully extend your arms at the top.
        </p>
        <p>
          Fitness norms provide a general benchmark. Individual capability depends on body weight,
          limb proportions, training history, and many other factors. Use your score as a baseline
          to track personal improvement over time rather than as an absolute measure of fitness.
        </p>
      </div>
    </ToolPageLayout>
  );
}
