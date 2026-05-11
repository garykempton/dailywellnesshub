"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("keto-calculator")!;

type Sex = "male" | "female";
type HeightUnit = "cm" | "ft";
type WeightUnit = "kg" | "lbs";
type Activity = "sedentary" | "light" | "moderate" | "very" | "extreme";
type Goal = "lose" | "maintain" | "gain";
type CarbLimit = 20 | 30 | 50;

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

const GOAL_LABELS: Record<Goal, string> = {
  lose: "Lose Weight",
  maintain: "Maintain Weight",
  gain: "Gain Muscle",
};

interface KetoResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  netCarbs: number;
  carbCals: number;
  proteinGrams: number;
  proteinCals: number;
  fatGrams: number;
  fatCals: number;
  carbPct: number;
  proteinPct: number;
  fatPct: number;
  goal: Goal;
}

export default function KetoCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [activity, setActivity] = useState<Activity>("sedentary");
  const [goal, setGoal] = useState<Goal>("lose");
  const [carbLimit, setCarbLimit] = useState<CarbLimit>(20);
  const [result, setResult] = useState<KetoResult | null>(null);

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

    // Goal adjustment
    let targetCalories: number;
    if (goal === "lose") targetCalories = tdee * 0.8;
    else if (goal === "gain") targetCalories = tdee * 1.1;
    else targetCalories = tdee;
    targetCalories = Math.round(targetCalories);

    // Net carbs
    const netCarbs = carbLimit;
    const carbCals = netCarbs * 4;

    // Protein: 1.6-2.0 g/kg lean mass
    const bf = parseFloat(bodyFat);
    let leanMass: number;
    if (bf && bf > 0 && bf < 100) {
      leanMass = kg * (1 - bf / 100);
    } else {
      // Estimate body fat: rough formula
      leanMass = sex === "male" ? kg * 0.8 : kg * 0.72;
    }
    const proteinPerKg = goal === "gain" ? 2.0 : 1.8;
    const proteinGrams = Math.round(leanMass * proteinPerKg);
    const proteinCals = proteinGrams * 4;

    // Fat = remaining calories
    const fatCals = Math.max(targetCalories - carbCals - proteinCals, 0);
    const fatGrams = Math.round(fatCals / 9);

    const total = carbCals + proteinCals + fatGrams * 9;
    const carbPct = Math.round((carbCals / total) * 100);
    const proteinPct = Math.round((proteinCals / total) * 100);
    const fatPct = 100 - carbPct - proteinPct;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories,
      netCarbs,
      carbCals,
      proteinGrams,
      proteinCals,
      fatGrams,
      fatCals: fatGrams * 9,
      carbPct,
      proteinPct,
      fatPct,
      goal,
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
            placeholder="30"
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
              placeholder="175"
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
            placeholder={weightUnit === "kg" ? "80" : "176"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Body Fat % (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Body Fat % <span className="text-stone-400">(optional)</span>
          </label>
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="20"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-stone-400 mt-1">
            Providing body fat gives more accurate protein targets
          </p>
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

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium mb-2">Goal</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  goal === g
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Carb Limit */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Daily Net Carb Limit
          </label>
          <select
            value={carbLimit}
            onChange={(e) => setCarbLimit(parseInt(e.target.value) as CarbLimit)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            <option value={20}>20g - Strict Keto</option>
            <option value={30}>30g - Moderate Keto</option>
            <option value={50}>50g - Liberal Keto</option>
          </select>
        </div>

        {/* Calculate */}
        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Keto Macros
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Calorie Summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800 text-lg">
              Daily Calorie Target
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-stone-500">BMR</p>
                <p className="text-2xl font-bold text-stone-700">
                  {result.bmr.toLocaleString()}
                </p>
                <p className="text-xs text-stone-400">kcal/day</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">TDEE</p>
                <p className="text-2xl font-bold text-stone-700">
                  {result.tdee.toLocaleString()}
                </p>
                <p className="text-xs text-stone-400">kcal/day</p>
              </div>
              <div>
                <p className="text-sm text-primary font-medium">Target</p>
                <p className="text-2xl font-bold text-primary">
                  {result.targetCalories.toLocaleString()}
                </p>
                <p className="text-xs text-stone-400">
                  kcal/day (
                  {result.goal === "lose"
                    ? "20% deficit"
                    : result.goal === "gain"
                    ? "10% surplus"
                    : "maintenance"}
                  )
                </p>
              </div>
            </div>
          </div>

          {/* Macro Breakdown Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-amber-200 rounded-xl p-5 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-600 font-bold text-lg">C</span>
              </div>
              <p className="text-sm text-amber-600 font-medium">Net Carbs</p>
              <p className="text-3xl font-bold text-amber-700 mt-1">
                {result.netCarbs}g
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {result.carbPct}% &middot; {result.carbCals} kcal
              </p>
            </div>
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

          {/* CSS Pie Chart */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">Macro Ratio</h3>
            <div className="flex items-center justify-center">
              <div
                className="w-40 h-40 rounded-full"
                style={{
                  background: `conic-gradient(
                    #f59e0b 0% ${result.carbPct}%,
                    #3b82f6 ${result.carbPct}% ${result.carbPct + result.proteinPct}%,
                    #8b5cf6 ${result.carbPct + result.proteinPct}% 100%
                  )`,
                }}
              />
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-500 rounded-full inline-block" />
                Carbs {result.carbPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-blue-500 rounded-full inline-block" />
                Protein {result.proteinPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-purple-500 rounded-full inline-block" />
                Fat {result.fatPct}%
              </span>
            </div>
          </div>

          {/* Macro Ratios Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-medium text-stone-600 mb-3">
              Macro Distribution
            </h3>
            <div className="w-full h-8 rounded-full overflow-hidden flex">
              <div
                className="bg-amber-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.carbPct}%` }}
              >
                {result.carbPct}%
              </div>
              <div
                className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.proteinPct}%` }}
              >
                {result.proteinPct}%
              </div>
              <div
                className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${result.fatPct}%` }}
              >
                {result.fatPct}%
              </div>
            </div>
          </div>

          {/* Meal Planning Tips */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Keto Meal Planning Tips
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                Divide your {result.fatGrams}g of fat across 2-3 meals to stay
                satiated throughout the day.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                Track net carbs carefully - fibre does not count toward your{" "}
                {result.netCarbs}g limit.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                Hit your protein target of {result.proteinGrams}g daily to
                preserve muscle mass.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                Supplement electrolytes (sodium, potassium, magnesium) especially
                during the first 2 weeks.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">5.</span>
                Prepare keto-friendly snacks (cheese, nuts, boiled eggs) to
                avoid carb cravings.
              </li>
            </ul>
          </div>

          {/* Keto-Friendly Food List */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Keto-Friendly Foods by Category
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-purple-700 mb-2">
                  Healthy Fats
                </h4>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Avocado &amp; avocado oil</li>
                  <li>Olive oil &amp; coconut oil</li>
                  <li>Butter &amp; ghee</li>
                  <li>Nuts &amp; seeds</li>
                  <li>MCT oil</li>
                  <li>Full-fat cheese</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-2">
                  Protein Sources
                </h4>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Beef, pork &amp; lamb</li>
                  <li>Chicken &amp; turkey thighs</li>
                  <li>Fatty fish (salmon, sardines)</li>
                  <li>Eggs</li>
                  <li>Bacon &amp; sausage</li>
                  <li>Greek yoghurt (full fat)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-700 mb-2">
                  Low-Carb Vegetables
                </h4>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Spinach &amp; kale</li>
                  <li>Broccoli &amp; cauliflower</li>
                  <li>Zucchini &amp; cucumber</li>
                  <li>Bell peppers</li>
                  <li>Asparagus</li>
                  <li>Mushrooms</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ketosis Timeline */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Ketosis Timeline Expectations
            </h3>
            <div className="space-y-3">
              {[
                {
                  period: "Days 1-3",
                  title: "Glycogen Depletion",
                  desc: "Your body uses up stored glycogen. You may lose water weight rapidly and feel low energy.",
                },
                {
                  period: "Days 3-7",
                  title: "Keto Flu Phase",
                  desc: "Headaches, fatigue, and irritability are common as your body transitions. Stay hydrated and supplement electrolytes.",
                },
                {
                  period: "Week 2-3",
                  title: "Early Ketosis",
                  desc: "Energy begins to stabilise. Mental clarity often improves. Cravings start to diminish.",
                },
                {
                  period: "Week 4-6",
                  title: "Fat Adaptation",
                  desc: "Your body becomes efficient at burning fat for fuel. Sustained energy and reduced hunger become noticeable.",
                },
                {
                  period: "Month 2+",
                  title: "Full Keto Adaptation",
                  desc: "Peak performance on keto. Exercise tolerance improves. Consistent fat loss if in a caloric deficit.",
                },
              ].map((phase) => (
                <div key={phase.period} className="flex gap-4">
                  <div className="w-20 shrink-0 text-sm font-medium text-primary">
                    {phase.period}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {phase.title}
                    </p>
                    <p className="text-sm text-stone-500">{phase.desc}</p>
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
