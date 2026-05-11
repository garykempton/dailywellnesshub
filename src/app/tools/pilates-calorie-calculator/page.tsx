"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("pilates-calorie-calculator")!;

type PilatesType =
  | "mat-beginner"
  | "mat-intermediate"
  | "mat-advanced"
  | "reformer-beginner"
  | "reformer-advanced"
  | "clinical";

const PILATES_OPTIONS: { value: PilatesType; label: string; met: number }[] = [
  { value: "mat-beginner", label: "Mat Pilates - Beginner", met: 3.0 },
  { value: "mat-intermediate", label: "Mat Pilates - Intermediate", met: 3.5 },
  { value: "mat-advanced", label: "Mat Pilates - Advanced", met: 4.0 },
  { value: "reformer-beginner", label: "Reformer Pilates - Beginner", met: 3.5 },
  { value: "reformer-advanced", label: "Reformer Pilates - Intermediate/Advanced", met: 4.5 },
  { value: "clinical", label: "Clinical / Rehabilitation Pilates", met: 2.5 },
];

const COMPARISON_ACTIVITIES: { name: string; met: number }[] = [
  { name: "Walking (moderate)", met: 3.5 },
  { name: "Jogging (light)", met: 7.0 },
  { name: "Yoga (vinyasa)", met: 4.0 },
];

interface Result {
  totalCalories: number;
  calPerMin: number;
  typeComparison: { label: string; calories: number; met: number }[];
  equivalents: { name: string; minutes: number }[];
  weeklyProjection: { sessions: number; calories: number }[];
}

export default function PilatesCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [duration, setDuration] = useState("50");
  const [pilatesType, setPilatesType] = useState<PilatesType>("mat-intermediate");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || w <= 0 || !d || d <= 0) return;

    const kg = weightUnit === "lbs" ? w * 0.453592 : w;
    const hours = d / 60;

    const type = PILATES_OPTIONS.find((t) => t.value === pilatesType)!;
    const totalCalories = Math.round(type.met * kg * hours);
    const calPerMin = Math.round((totalCalories / d) * 10) / 10;

    const typeComparison = PILATES_OPTIONS.map((t) => ({
      label: t.label,
      calories: Math.round(t.met * kg * hours),
      met: t.met,
    }));

    const equivalents = COMPARISON_ACTIVITIES.map((a) => ({
      name: a.name,
      minutes: Math.round(totalCalories / (a.met * kg / 60)),
    }));

    const weeklyProjection = [2, 3].map((sessions) => ({
      sessions,
      calories: totalCalories * sessions,
    }));

    setResult({
      totalCalories,
      calPerMin,
      typeComparison,
      equivalents,
      weeklyProjection,
    });
  }

  const maxCal = result
    ? Math.max(...result.typeComparison.map((t) => t.calories))
    : 0;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">Body Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={weightUnit === "kg" ? "65" : "143"}
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex gap-1">
              {(["kg", "lbs"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setWeightUnit(u);
                    setResult(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    weightUnit === u
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

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Session Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="50"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Pilates Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Pilates Type</label>
          <select
            value={pilatesType}
            onChange={(e) => setPilatesType(e.target.value as PilatesType)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {PILATES_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label} (MET {t.met})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Calories
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Big calorie card - teal theme */}
          <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-6 text-center">
            <p className="text-sm text-teal-600 mb-1">Total Calories Burned</p>
            <p className="text-4xl font-bold text-teal-700">
              {result.totalCalories.toLocaleString()}
            </p>
            <p className="text-xs text-teal-400">kcal</p>
          </div>

          {/* Cal/min */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500">Calories per Minute</p>
            <p className="text-3xl font-bold">{result.calPerMin}</p>
            <p className="text-xs text-stone-400">kcal/min</p>
          </div>

          {/* Type comparison chart */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Calorie Comparison by Pilates Type
            </h3>
            <div className="space-y-3">
              {result.typeComparison.map((t) => (
                <div key={t.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">{t.label}</span>
                    <span className="font-medium text-stone-800">
                      {t.calories} kcal
                    </span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((t.calories / maxCal) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equivalence */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">Activity Equivalence</h3>
            <p className="text-sm text-stone-600">
              To burn the same {result.totalCalories} kcal, you would need
              approximately:
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {result.equivalents.map((e) => (
                <div
                  key={e.name}
                  className="bg-stone-50 rounded-lg p-3 text-center"
                >
                  <p className="text-2xl font-bold text-stone-800">{e.minutes}</p>
                  <p className="text-xs text-stone-500">
                    minutes of {e.name.toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly projection */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">Weekly Projection</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.weeklyProjection.map((p) => (
                <div
                  key={p.sessions}
                  className="bg-teal-50 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-teal-500">
                    {p.sessions}x per week
                  </p>
                  <p className="text-xl font-bold text-teal-700">
                    {p.calories.toLocaleString()}
                  </p>
                  <p className="text-xs text-teal-400">kcal/week</p>
                </div>
              ))}
            </div>
          </div>

          {/* What affects calorie burn */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              What Affects Calorie Burn in Pilates
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Movement Tempo",
                  desc: "Faster transitions between exercises and shorter rest periods increase overall calorie expenditure. Controlled, continuous movement keeps your heart rate elevated.",
                },
                {
                  title: "Spring Resistance",
                  desc: "On a reformer, heavier spring settings require more muscular effort, increasing energy expenditure. However, lighter springs can also be challenging as they demand more stabilization.",
                },
                {
                  title: "Experience Level",
                  desc: "Advanced practitioners engage more muscle groups simultaneously, use greater range of motion, and maintain higher intensity throughout the session.",
                },
                {
                  title: "Body Weight",
                  desc: "Heavier individuals burn more calories performing the same exercises because more energy is required to move a larger body mass against gravity.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-stone-50 rounded-lg p-4">
                  <p className="font-medium text-stone-800 text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pilates benefits */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Pilates Benefits Beyond Calories
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Core Strength",
                  desc: "Pilates systematically strengthens the deep stabilizing muscles of the trunk, including the transverse abdominis, pelvic floor, and multifidus.",
                },
                {
                  title: "Posture",
                  desc: "By strengthening postural muscles and increasing body awareness, Pilates helps correct imbalances from prolonged sitting and poor alignment habits.",
                },
                {
                  title: "Flexibility",
                  desc: "Dynamic stretching within Pilates movements improves flexibility without compromising stability, promoting functional range of motion.",
                },
                {
                  title: "Injury Prevention",
                  desc: "Pilates is widely used in rehabilitation. It builds balanced strength around joints, improves movement patterns, and reduces the risk of overuse injuries.",
                },
              ].map((b) => (
                <div key={b.title} className="bg-stone-50 rounded-lg p-4">
                  <p className="font-medium text-stone-800 text-sm mb-1">
                    {b.title}
                  </p>
                  <p className="text-xs text-stone-600">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info section */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-stone-800">About This Calculator</h3>
            <p className="text-sm text-stone-600">
              Calorie estimates use the MET (Metabolic Equivalent of Task) formula:{" "}
              <strong>Calories = MET x weight (kg) x duration (hours)</strong>. MET
              values are based on published research from the Compendium of Physical
              Activities.
            </p>
            <p className="text-sm text-stone-600">
              Actual calorie expenditure varies based on individual fitness level,
              muscle mass, exercise intensity, instructor pacing, and environmental
              conditions. Reformer Pilates tends to burn more calories than mat work
              at equivalent skill levels due to the added resistance from springs.
              These figures should be used as general estimates.
            </p>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
