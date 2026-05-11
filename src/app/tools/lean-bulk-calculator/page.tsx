"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("lean-bulk-calculator")!;

type Sex = "male" | "female";
type HeightUnit = "cm" | "ft";
type WeightUnit = "kg" | "lbs";
type Activity = "sedentary" | "light" | "moderate" | "very" | "extreme";
type Experience = "beginner" | "intermediate" | "advanced";

const ACTIVITY_LABELS: Record<Activity, string> = {
  sedentary: "Sedentary (desk job)",
  light: "Lightly Active (1-3 days/wk)",
  moderate: "Moderately Active (3-5 days/wk)",
  very: "Very Active (6-7 days/wk)",
  extreme: "Extremely Active (athlete)",
};

const ACTIVITY_MULTIPLIER: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};

const EXPERIENCE_LABELS: Record<Experience, string> = {
  beginner: "Beginner (<1 year)",
  intermediate: "Intermediate (1-3 years)",
  advanced: "Advanced (3+ years)",
};

const SURPLUS: Record<Experience, number> = {
  beginner: 400,
  intermediate: 300,
  advanced: 200,
};

const MONTHLY_GAIN_KG: Record<Experience, number> = {
  beginner: 1.0,
  intermediate: 0.5,
  advanced: 0.25,
};

interface BulkResult {
  bmr: number;
  tdee: number;
  surplus: number;
  bulkCalories: number;
  proteinGrams: number;
  proteinCals: number;
  proteinPct: number;
  fatGrams: number;
  fatCals: number;
  fatPct: number;
  carbGrams: number;
  carbCals: number;
  carbPct: number;
  weeklyGain: number;
  monthlyGain: number;
  experience: Experience;
  currentBf: number | null;
}

export default function LeanBulkCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [experience, setExperience] = useState<Experience>("beginner");
  const [bodyFat, setBodyFat] = useState("");
  const [result, setResult] = useState<BulkResult | null>(null);

  function calculate() {
    const a = parseInt(age);
    if (!a || a <= 0) return;

    const cm =
      heightUnit === "cm"
        ? parseFloat(heightCm)
        : parseFloat(heightFt) * 30.48 + parseFloat(heightIn || "0") * 2.54;
    if (!cm || cm <= 0) return;

    const kg =
      weightUnit === "kg"
        ? parseFloat(weight)
        : parseFloat(weight) * 0.453592;
    if (!kg || kg <= 0) return;

    // Mifflin-St Jeor
    const bmr =
      sex === "male"
        ? 10 * kg + 6.25 * cm - 5 * a + 5
        : 10 * kg + 6.25 * cm - 5 * a - 161;

    const tdee = bmr * ACTIVITY_MULTIPLIER[activity];
    const surplus = SURPLUS[experience];
    const bulkCalories = Math.round(tdee + surplus);

    // Protein: 2.0 g/kg
    const proteinGrams = Math.round(kg * 2.0);
    const proteinCals = proteinGrams * 4;

    // Fat: 25% of total calories
    const fatCals = Math.round(bulkCalories * 0.25);
    const fatGrams = Math.round(fatCals / 9);

    // Carbs: remainder
    const carbCals = Math.max(bulkCalories - proteinCals - fatGrams * 9, 0);
    const carbGrams = Math.round(carbCals / 4);

    const total = proteinCals + fatGrams * 9 + carbGrams * 4;
    const proteinPct = Math.round((proteinCals / total) * 100);
    const fatPct = Math.round(((fatGrams * 9) / total) * 100);
    const carbPct = 100 - proteinPct - fatPct;

    const monthlyGain = MONTHLY_GAIN_KG[experience];
    const weeklyGain = monthlyGain / 4.33;

    const bf = parseFloat(bodyFat);
    const currentBf = bf && bf > 0 && bf < 100 ? bf : null;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      surplus,
      bulkCalories,
      proteinGrams,
      proteinCals,
      proteinPct,
      fatGrams,
      fatCals: fatGrams * 9,
      fatPct,
      carbGrams,
      carbCals: carbGrams * 4,
      carbPct,
      weeklyGain: Math.round(weeklyGain * 100) / 100,
      monthlyGain,
      experience,
      currentBf,
    });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        {/* Sex */}
        <div>
          <label className="block text-sm font-medium mb-2">Sex</label>
          <div className="flex gap-4">
            {(["male", "female"] as Sex[]).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  checked={sex === s}
                  onChange={() => setSex(s)}
                  className="accent-primary"
                />
                <span className="capitalize">{s}</span>
              </label>
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
            placeholder="25"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Height</label>
            <button
              onClick={() => setHeightUnit(heightUnit === "cm" ? "ft" : "cm")}
              className="text-xs text-primary font-medium hover:underline"
            >
              Switch to {heightUnit === "cm" ? "ft/in" : "cm"}
            </button>
          </div>
          {heightUnit === "cm" ? (
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="178"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                className="w-1/2 border border-stone-300 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="10"
                className="w-1/2 border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Weight</label>
            <button
              onClick={() => setWeightUnit(weightUnit === "kg" ? "lbs" : "kg")}
              className="text-xs text-primary font-medium hover:underline"
            >
              Switch to {weightUnit === "kg" ? "lbs" : "kg"}
            </button>
          </div>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={weightUnit === "kg" ? "75" : "165"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Activity Level
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as Activity)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(ACTIVITY_LABELS) as Activity[]).map((a) => (
              <option key={a} value={a}>
                {ACTIVITY_LABELS[a]}
              </option>
            ))}
          </select>
        </div>

        {/* Training Experience */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Training Experience
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EXPERIENCE_LABELS) as Experience[]).map((e) => (
              <button
                key={e}
                onClick={() => setExperience(e)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  experience === e
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {EXPERIENCE_LABELS[e]}
              </button>
            ))}
          </div>
        </div>

        {/* Body Fat % (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Body Fat % <span className="text-stone-400">(optional)</span>
          </label>
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="15"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-stone-400 mt-1">
            Used for &quot;when to stop bulking&quot; guidance
          </p>
        </div>

        {/* Calculate */}
        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Lean Bulk Plan
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Maintenance vs Bulk Comparison */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Maintenance (TDEE)</p>
              <p className="text-3xl font-bold text-stone-700">
                {result.tdee.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400 mt-1">kcal/day</p>
            </div>
            <div className="bg-white border-2 border-primary/30 rounded-xl p-5 text-center">
              <p className="text-sm text-primary font-medium mb-1">
                Lean Bulk Target
              </p>
              <p className="text-3xl font-bold text-primary">
                {result.bulkCalories.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400 mt-1">kcal/day</p>
            </div>
          </div>

          {/* Surplus Explanation */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Caloric Surplus: +{result.surplus} kcal/day
            </h3>
            <p className="text-sm text-stone-600">
              As{" "}
              {result.experience === "beginner"
                ? "a beginner"
                : result.experience === "intermediate"
                ? "an intermediate"
                : "an advanced"}{" "}
              lifter, a +{result.surplus} kcal surplus is recommended. This
              provides enough energy for muscle growth while minimising
              unnecessary fat gain.{" "}
              {result.experience === "beginner"
                ? "Beginners can build muscle rapidly, so a slightly larger surplus is effective."
                : result.experience === "intermediate"
                ? "Intermediate lifters gain muscle more slowly, so a moderate surplus reduces fat spillover."
                : "Advanced lifters gain muscle very slowly, so a smaller surplus keeps you lean."}
            </p>
          </div>

          {/* Macro Targets */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-blue-200 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">P</span>
              </div>
              <p className="text-sm text-blue-600 font-medium">Protein</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">
                {result.proteinGrams}g
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {result.proteinPct}% &middot; {result.proteinCals} kcal
              </p>
            </div>
            <div className="bg-white border-2 border-amber-200 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-600 font-bold text-lg">C</span>
              </div>
              <p className="text-sm text-amber-600 font-medium">Carbs</p>
              <p className="text-3xl font-bold text-amber-700 mt-1">
                {result.carbGrams}g
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {result.carbPct}% &middot; {result.carbCals} kcal
              </p>
            </div>
            <div className="bg-white border-2 border-purple-200 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">F</span>
              </div>
              <p className="text-sm text-purple-600 font-medium">Fat</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">
                {result.fatGrams}g
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {result.fatPct}% &middot; {result.fatCals} kcal
              </p>
            </div>
          </div>

          {/* Macro Distribution Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              Macro Distribution
            </h3>
            <div className="w-full h-8 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.proteinPct}%` }}
              >
                {result.proteinPct}% P
              </div>
              <div
                className="bg-amber-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.carbPct}%` }}
              >
                {result.carbPct}% C
              </div>
              <div
                className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.fatPct}%` }}
              >
                {result.fatPct}% F
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" />
                Protein
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" />
                Carbs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full inline-block" />
                Fat
              </span>
            </div>
          </div>

          {/* Expected Rate of Gain */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Expected Rate of Gain
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-lg p-4 text-center">
                <p className="text-sm text-stone-500">Weekly Gain</p>
                <p className="text-2xl font-bold text-stone-700">
                  ~{result.weeklyGain} kg
                </p>
                <p className="text-xs text-stone-400">
                  ({(result.weeklyGain * 2.205).toFixed(2)} lbs)
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4 text-center">
                <p className="text-sm text-stone-500">Monthly Gain</p>
                <p className="text-2xl font-bold text-stone-700">
                  ~{result.monthlyGain} kg
                </p>
                <p className="text-xs text-stone-400">
                  ({(result.monthlyGain * 2.205).toFixed(1)} lbs)
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium text-stone-700">
                Projected Timeline
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-2 text-stone-600 font-medium">
                        Timeframe
                      </th>
                      <th className="text-right py-2 text-stone-600 font-medium">
                        Expected Gain
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 3, 6, 12].map((months) => (
                      <tr
                        key={months}
                        className="border-b border-stone-100"
                      >
                        <td className="py-2 text-stone-700">
                          {months} month{months > 1 ? "s" : ""}
                        </td>
                        <td className="text-right py-2 font-medium text-stone-800">
                          +{(result.monthlyGain * months).toFixed(1)} kg (
                          {(result.monthlyGain * months * 2.205).toFixed(1)}{" "}
                          lbs)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* When to Stop Bulking */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              When to Stop Bulking
            </h3>
            {result.currentBf !== null && (
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="text-sm text-stone-600">
                  Your current body fat:{" "}
                  <span className="font-bold text-stone-800">
                    {result.currentBf}%
                  </span>
                </p>
                <div className="w-full bg-stone-200 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full ${
                      result.currentBf < 15
                        ? "bg-green-500"
                        : result.currentBf < 20
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(result.currentBf * 2.5, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                  <span>40%</span>
                </div>
              </div>
            )}
            <div className="space-y-3 text-sm text-stone-600">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-stone-700">
                    Males: Stop at ~18-20% body fat
                  </p>
                  <p className="text-xs text-stone-500">
                    Transition to a cut to maintain insulin sensitivity and
                    hormonal balance.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-stone-700">
                    Females: Stop at ~28-30% body fat
                  </p>
                  <p className="text-xs text-stone-500">
                    Higher thresholds are normal for females due to essential fat
                    differences.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-stone-700">
                    Ideal starting point: 10-15% (males) / 18-23% (females)
                  </p>
                  <p className="text-xs text-stone-500">
                    Starting a bulk at a lower body fat improves nutrient
                    partitioning and gives you more room to grow.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-stone-700">
                    Bulk/cut cycles: 3-6 months bulking, 2-3 months cutting
                  </p>
                  <p className="text-xs text-stone-500">
                    This cycling approach maximises long-term muscle gain while
                    keeping body fat manageable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Training Tips */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Training Tips for Maximising Muscle Gain
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: "Progressive Overload",
                  tip: "Gradually increase weight, reps, or sets over time. This is the primary driver of muscle growth. Aim to add weight or reps every 1-2 weeks.",
                },
                {
                  title: "Volume & Frequency",
                  tip: "Train each muscle group 2-3 times per week with 10-20 sets per muscle group weekly. Upper/lower or push/pull/legs splits work well.",
                },
                {
                  title: "Compound Movements First",
                  tip: "Prioritise squats, deadlifts, bench press, overhead press, and rows. These recruit the most muscle fibres and allow the heaviest loads.",
                },
                {
                  title: "Rest & Recovery",
                  tip: "Aim for 7-9 hours of sleep. Muscles grow during recovery, not during training. Take rest days when needed.",
                },
                {
                  title: "Protein Timing",
                  tip: `Spread your ${result.proteinGrams}g of protein across 4-5 meals (${Math.round(result.proteinGrams / 4)}-${Math.round(result.proteinGrams / 5)}g per meal) for optimal muscle protein synthesis.`,
                },
                {
                  title: "Track Progress",
                  tip: "Weigh yourself weekly (same time, same conditions) and take progress photos monthly. Adjust calories if weight gain is too fast or too slow.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {item.title}
                    </p>
                    <p className="text-xs text-stone-500">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
