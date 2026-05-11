"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("bmr-calculator")!;

type Sex = "male" | "female";
type HeightUnit = "cm" | "ft";
type WeightUnit = "kg" | "lbs";

const ACTIVITY_LEVELS = [
  { label: "Sedentary (little or no exercise)", multiplier: 1.2 },
  { label: "Lightly Active (1-3 days/wk)", multiplier: 1.375 },
  { label: "Moderately Active (3-5 days/wk)", multiplier: 1.55 },
  { label: "Very Active (6-7 days/wk)", multiplier: 1.725 },
  { label: "Extremely Active (athlete)", multiplier: 1.9 },
];

interface BMRResult {
  mifflin: number;
  harris: number;
  katchMcArdle: number | null;
  average: number;
}

export default function BMRCalculatorPage() {
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [result, setResult] = useState<BMRResult | null>(null);

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
    const mifflin =
      sex === "male"
        ? 10 * kg + 6.25 * cm - 5 * a + 5
        : 10 * kg + 6.25 * cm - 5 * a - 161;

    // Harris-Benedict (revised)
    const harris =
      sex === "male"
        ? 13.397 * kg + 4.799 * cm - 5.677 * a + 88.362
        : 9.247 * kg + 3.098 * cm - 4.33 * a + 447.593;

    // Katch-McArdle (if BF% provided)
    const bf = parseFloat(bodyFat);
    let katchMcArdle: number | null = null;
    if (bf && bf > 0 && bf < 100) {
      const leanMass = kg * (1 - bf / 100);
      katchMcArdle = 370 + 21.6 * leanMass;
    }

    const values = [mifflin, harris];
    if (katchMcArdle !== null) values.push(katchMcArdle);
    const average = values.reduce((s, v) => s + v, 0) / values.length;

    setResult({
      mifflin: Math.round(mifflin),
      harris: Math.round(harris),
      katchMcArdle: katchMcArdle !== null ? Math.round(katchMcArdle) : null,
      average: Math.round(average),
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
            Enables the Katch-McArdle formula for a more accurate estimate
          </p>
        </div>

        {/* Calculate */}
        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate BMR
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Formula Comparison Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm text-blue-600 font-medium mb-1">
                Mifflin-St Jeor
              </p>
              <p className="text-3xl font-bold text-blue-700">
                {result.mifflin.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400 mt-1">kcal/day</p>
              <p className="text-xs text-stone-500 mt-2">
                Most widely recommended
              </p>
            </div>
            <div className="bg-white border-2 border-amber-200 rounded-xl p-5 text-center">
              <p className="text-sm text-amber-600 font-medium mb-1">
                Harris-Benedict
              </p>
              <p className="text-3xl font-bold text-amber-700">
                {result.harris.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400 mt-1">kcal/day</p>
              <p className="text-xs text-stone-500 mt-2">
                Revised 1984 equation
              </p>
            </div>
            <div
              className={`bg-white border-2 rounded-xl p-5 text-center ${
                result.katchMcArdle !== null
                  ? "border-green-200"
                  : "border-stone-200"
              }`}
            >
              <p
                className={`text-sm font-medium mb-1 ${
                  result.katchMcArdle !== null
                    ? "text-green-600"
                    : "text-stone-400"
                }`}
              >
                Katch-McArdle
              </p>
              {result.katchMcArdle !== null ? (
                <>
                  <p className="text-3xl font-bold text-green-700">
                    {result.katchMcArdle.toLocaleString()}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">kcal/day</p>
                  <p className="text-xs text-stone-500 mt-2">
                    Uses lean body mass
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-stone-300 mt-1">--</p>
                  <p className="text-xs text-stone-400 mt-2">
                    Enter body fat % to enable
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Average BMR */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Average BMR Estimate
            </p>
            <p className="text-4xl font-bold text-primary">
              {result.average.toLocaleString()}
            </p>
            <p className="text-sm text-stone-400 mt-1">kcal/day at rest</p>
          </div>

          {/* TDEE Estimates Table */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              TDEE Estimates by Activity Level
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 pr-4 text-stone-600 font-medium">
                      Activity Level
                    </th>
                    <th className="text-right py-2 pl-4 text-stone-600 font-medium">
                      Multiplier
                    </th>
                    <th className="text-right py-2 pl-4 text-stone-600 font-medium">
                      Daily Calories
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY_LEVELS.map((level) => (
                    <tr
                      key={level.label}
                      className="border-b border-stone-100"
                    >
                      <td className="py-2 pr-4 text-stone-700">
                        {level.label}
                      </td>
                      <td className="text-right py-2 pl-4 text-stone-500">
                        x{level.multiplier}
                      </td>
                      <td className="text-right py-2 pl-4 font-medium text-stone-800">
                        {Math.round(
                          result.average * level.multiplier
                        ).toLocaleString()}{" "}
                        kcal
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* What is BMR */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">What is BMR?</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Basal Metabolic Rate (BMR) is the number of calories your body
              burns at complete rest just to maintain basic life-sustaining
              functions such as breathing, circulation, cell production, and
              nutrient processing. It represents roughly 60-75% of your total
              daily energy expenditure.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Your Total Daily Energy Expenditure (TDEE) adds physical activity
              on top of your BMR. To lose weight, eat below your TDEE; to gain
              weight, eat above it.
            </p>
          </div>

          {/* Factors Affecting BMR */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-stone-800">
              Factors That Affect BMR
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  factor: "Age",
                  detail:
                    "BMR decreases roughly 1-2% per decade after age 20 due to muscle loss.",
                },
                {
                  factor: "Muscle Mass",
                  detail:
                    "More muscle means a higher BMR because muscle tissue burns more calories at rest than fat.",
                },
                {
                  factor: "Body Size",
                  detail:
                    "Larger bodies require more energy to maintain, resulting in a higher BMR.",
                },
                {
                  factor: "Sex",
                  detail:
                    "Males typically have higher BMR due to greater muscle mass and lower body fat percentage.",
                },
                {
                  factor: "Hormones",
                  detail:
                    "Thyroid hormones have a significant impact. Conditions like hypothyroidism lower BMR.",
                },
                {
                  factor: "Temperature",
                  detail:
                    "Exposure to cold increases BMR as the body works harder to maintain core temperature.",
                },
              ].map((item) => (
                <div key={item.factor} className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {item.factor}
                    </p>
                    <p className="text-xs text-stone-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-stone-700 text-sm">
              About These Formulas
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              <strong>Mifflin-St Jeor (1990)</strong> is considered the most
              accurate for most people and is recommended by the Academy of
              Nutrition and Dietetics.
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              <strong>Harris-Benedict (revised 1984)</strong> was one of the
              earliest BMR equations and tends to slightly overestimate in
              overweight individuals.
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              <strong>Katch-McArdle</strong> is the most accurate for lean or
              athletic individuals because it factors in lean body mass rather
              than total weight.
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              All formulas provide estimates. Individual metabolism can vary by
              5-10% due to genetics, hormones, and other factors. For precise
              measurements, consider indirect calorimetry testing.
            </p>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
