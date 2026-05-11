"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("electrolyte-calculator")!;

type WeightUnit = "kg" | "lbs";
type Activity = "sedentary" | "light" | "moderate" | "intense" | "endurance";
type Climate = "temperate" | "warm" | "hot";
type Diet = "standard" | "keto" | "fasting" | "vegan";
type Sweat = "light" | "average" | "heavy";
type Sex = "male" | "female";

interface ElectrolyteTarget {
  label: string;
  base: number;
  total: number;
  unit: string;
}

interface ExerciseTiming {
  pre: string;
  during: string;
  post: string;
}

interface Results {
  sodium: ElectrolyteTarget;
  potassium: ElectrolyteTarget;
  magnesium: ElectrolyteTarget;
  isActive: boolean;
  timing: ExerciseTiming;
  isKeto: boolean;
  waterLiters: number;
}

const activityLabels: Record<Activity, string> = {
  sedentary: "Sedentary",
  light: "Light Exercise",
  moderate: "Moderate (30-60 min/day)",
  intense: "Intense (60+ min/day)",
  endurance: "Endurance Athlete (2+ hrs)",
};

const climateLabels: Record<Climate, string> = {
  temperate: "Temperate",
  warm: "Warm / Humid",
  hot: "Hot",
};

const dietLabels: Record<Diet, string> = {
  standard: "Standard",
  keto: "Low-Carb / Keto",
  fasting: "Fasting",
  vegan: "Vegan",
};

const sweatLabels: Record<Sweat, string> = {
  light: "Light Sweater",
  average: "Average",
  heavy: "Heavy Sweater",
};

export default function ElectrolyteCalculatorPage() {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [climate, setClimate] = useState<Climate>("temperate");
  const [diet, setDiet] = useState<Diet>("standard");
  const [sweat, setSweat] = useState<Sweat>("average");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const w = Number(weight);
    if (!w || w <= 0) return;

    const weightKg = weightUnit === "lbs" ? w * 0.4536 : w;

    // --- Sodium ---
    let sodiumBase = 2300;
    let sodiumTotal = sodiumBase;
    const activitySodiumAdd: Record<Activity, number> = {
      sedentary: 0,
      light: 500,
      moderate: 1000,
      intense: 1500,
      endurance: 2000,
    };
    sodiumTotal += activitySodiumAdd[activity];
    if (climate === "warm") sodiumTotal += 500;
    if (climate === "hot") sodiumTotal += 1000;
    if (diet === "keto") sodiumTotal += 1500;
    if (sweat === "heavy") sodiumTotal += 500;

    // --- Potassium ---
    let potassiumBase = sex === "female" ? 2600 : 3400;
    let potassiumTotal = potassiumBase;
    const activityPotassiumAdd: Record<Activity, number> = {
      sedentary: 0,
      light: 200,
      moderate: 400,
      intense: 600,
      endurance: 800,
    };
    potassiumTotal += activityPotassiumAdd[activity];
    if (climate === "warm") potassiumTotal += 200;
    if (climate === "hot") potassiumTotal += 400;

    // --- Magnesium ---
    let magnesiumBase = sex === "female" ? 310 : 400;
    let magnesiumTotal = magnesiumBase;
    const activityMagAdd: Record<Activity, number> = {
      sedentary: 0,
      light: 50,
      moderate: 100,
      intense: 150,
      endurance: 200,
    };
    magnesiumTotal += activityMagAdd[activity];
    if (diet === "keto") magnesiumTotal += 100;

    const isActive = activity !== "sedentary";

    const timing: ExerciseTiming = {
      pre: "Consume 300-500 mg sodium and 200 ml water 30 minutes before exercise to pre-hydrate.",
      during: "Drink 400-800 ml of water with 300-600 mg sodium per hour during exercise. If exercising over 60 minutes, add 100-200 mg potassium per hour.",
      post: "Replenish with 500-700 ml water per 0.5 kg body weight lost. Include sodium and potassium-rich foods or drinks within 2 hours.",
    };

    // Water estimate: ~35ml per kg, plus activity/climate additions
    let waterMl = weightKg * 35;
    if (activity === "light") waterMl += 500;
    if (activity === "moderate") waterMl += 1000;
    if (activity === "intense") waterMl += 1500;
    if (activity === "endurance") waterMl += 2000;
    if (climate === "warm") waterMl += 500;
    if (climate === "hot") waterMl += 1000;

    setResults({
      sodium: { label: "Sodium", base: sodiumBase, total: Math.round(sodiumTotal), unit: "mg" },
      potassium: { label: "Potassium", base: potassiumBase, total: Math.round(potassiumTotal), unit: "mg" },
      magnesium: { label: "Magnesium", base: magnesiumBase, total: Math.round(magnesiumTotal), unit: "mg" },
      isActive,
      timing,
      isKeto: diet === "keto",
      waterLiters: Math.round(waterMl / 100) / 10,
    });
  }

  const sodiumFoods = [
    { food: "Salt (1 tsp)", mg: 2300 },
    { food: "Pickles (1 large)", mg: 785 },
    { food: "Miso soup (1 cup)", mg: 900 },
    { food: "Olives, canned (10 large)", mg: 735 },
    { food: "Sauerkraut (1/2 cup)", mg: 470 },
  ];

  const potassiumFoods = [
    { food: "Baked potato with skin (1 medium)", mg: 926 },
    { food: "Banana (1 large)", mg: 487 },
    { food: "Spinach, cooked (1 cup)", mg: 839 },
    { food: "Sweet potato (1 medium)", mg: 541 },
    { food: "Avocado (1/2)", mg: 487 },
  ];

  const magnesiumFoods = [
    { food: "Pumpkin seeds (1 oz / 28g)", mg: 156 },
    { food: "Almonds (1 oz / 28g)", mg: 80 },
    { food: "Spinach, cooked (1 cup)", mg: 157 },
    { food: "Dark chocolate 70%+ (1 oz)", mg: 65 },
    { food: "Black beans (1/2 cup)", mg: 60 },
  ];

  const deficiencySigns: Record<string, string[]> = {
    Sodium: [
      "Headache, nausea, and fatigue",
      "Muscle cramps and weakness",
      "Confusion or difficulty concentrating",
      "Dizziness or fainting",
    ],
    Potassium: [
      "Muscle cramps and spasms",
      "Heart palpitations or irregular heartbeat",
      "Fatigue and weakness",
      "Constipation and bloating",
    ],
    Magnesium: [
      "Muscle twitches, tremors, and cramps",
      "Anxiety, irritability, or difficulty sleeping",
      "Fatigue and low energy",
      "Migraines and headaches",
    ],
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Sex */}
        <div>
          <label className="block text-sm font-medium mb-2">Sex</label>
          <div className="flex gap-4">
            {(["male", "female"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  value={s}
                  checked={sex === s}
                  onChange={() => setSex(s)}
                  className="accent-primary"
                />
                {s === "male" ? "Male" : "Female"}
              </label>
            ))}
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              placeholder={weightUnit === "kg" ? "e.g. 75" : "e.g. 165"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex shrink-0">
              <button
                onClick={() => setWeightUnit("kg")}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  weightUnit === "kg" ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                kg
              </button>
              <button
                onClick={() => setWeightUnit("lbs")}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  weightUnit === "lbs" ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                lbs
              </button>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as Activity)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(activityLabels) as Activity[]).map((a) => (
              <option key={a} value={a}>{activityLabels[a]}</option>
            ))}
          </select>
        </div>

        {/* Climate */}
        <div>
          <label className="block text-sm font-medium mb-1">Climate</label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as Climate)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(climateLabels) as Climate[]).map((c) => (
              <option key={c} value={c}>{climateLabels[c]}</option>
            ))}
          </select>
        </div>

        {/* Diet */}
        <div>
          <label className="block text-sm font-medium mb-1">Diet Type</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value as Diet)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(dietLabels) as Diet[]).map((d) => (
              <option key={d} value={d}>{dietLabels[d]}</option>
            ))}
          </select>
        </div>

        {/* Sweat rate */}
        <div>
          <label className="block text-sm font-medium mb-1">Sweat Rate</label>
          <select
            value={sweat}
            onChange={(e) => setSweat(e.target.value as Sweat)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(sweatLabels) as Sweat[]).map((s) => (
              <option key={s} value={s}>{sweatLabels[s]}</option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Electrolyte Needs
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Big number cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[results.sodium, results.potassium, results.magnesium].map((el, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 text-center">
                <p className="text-sm font-medium text-stone-500 mb-1">{el.label}</p>
                <p className="text-3xl font-bold text-stone-800">
                  {el.total.toLocaleString()}
                </p>
                <p className="text-sm text-stone-400">{el.unit} / day</p>
                <p className="text-xs text-stone-400 mt-2">Base DRI: {el.base.toLocaleString()} {el.unit}</p>
              </div>
            ))}
          </div>

          {/* Hydration pairing */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-stone-500 mb-1">Recommended Daily Water Intake</p>
            <p className="text-3xl font-bold text-stone-800">{results.waterLiters} L</p>
            <p className="text-xs text-stone-400 mt-2">
              Electrolytes work hand-in-hand with hydration. Drinking water without electrolytes can dilute blood sodium levels.
            </p>
          </div>

          {/* Exercise timing (if active) */}
          {results.isActive && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-medium text-stone-700">
                Exercise Electrolyte Timing
              </p>
              <div className="space-y-3">
                {([
                  { label: "Pre-Exercise (30 min before)", text: results.timing.pre },
                  { label: "During Exercise", text: results.timing.during },
                  { label: "Post-Exercise (within 2 hrs)", text: results.timing.post },
                ]).map((phase, i) => (
                  <div key={i} className="bg-stone-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-stone-700 mb-1">{phase.label}</p>
                    <p className="text-sm text-stone-600">{phase.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keto-specific guidance */}
          {results.isKeto && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <p className="text-sm font-medium text-purple-800 mb-2">
                Keto / Low-Carb Electrolyte Guidance
              </p>
              <div className="text-sm text-purple-700 space-y-2">
                <p>
                  Low-carb and ketogenic diets cause the kidneys to excrete more sodium, potassium, and magnesium. This is the primary cause of the &ldquo;keto flu&rdquo; that many people experience during the first few weeks.
                </p>
                <p>
                  Supplement sodium by adding salt to meals, drinking bone broth, or using electrolyte packets. Aim for an additional 1,000 to 2,000 mg of sodium above the standard recommendation.
                </p>
                <p>
                  Eat potassium-rich low-carb foods such as avocados, spinach, and salmon. Consider magnesium glycinate or citrate supplements if you experience cramps or poor sleep.
                </p>
              </div>
            </div>
          )}

          {/* Food sources tables */}
          {[
            { label: "Sodium", foods: sodiumFoods },
            { label: "Potassium", foods: potassiumFoods },
            { label: "Magnesium", foods: magnesiumFoods },
          ].map((group, gi) => (
            <div key={gi} className="bg-white border border-stone-200 rounded-xl p-5">
              <p className="text-sm font-medium text-stone-700 mb-3">
                Top {group.label} Food Sources
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left text-stone-500">
                    <th className="pb-2 font-medium">Food</th>
                    <th className="pb-2 font-medium text-right">mg per serving</th>
                  </tr>
                </thead>
                <tbody className="text-stone-700">
                  {group.foods.map((item, fi) => (
                    <tr key={fi} className="border-b border-stone-100">
                      <td className="py-2">{item.food}</td>
                      <td className="py-2 text-right font-medium">{item.mg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Supplement guidance */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              When to Consider Supplements
            </p>
            <div className="text-sm text-stone-600 space-y-2">
              <p>
                Most people can meet their electrolyte needs through a balanced diet. However, supplementation may be helpful in these situations:
              </p>
              <ul className="space-y-1">
                {[
                  "You exercise intensely for more than 60 minutes, especially in heat.",
                  "You follow a low-carb or ketogenic diet and experience muscle cramps, fatigue, or headaches.",
                  "You are a heavy sweater and notice salt residue on your skin or clothing after exercise.",
                  "You are fasting for extended periods (over 24 hours).",
                  "You have chronic diarrhoea, vomiting, or take diuretic medication.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-stone-400 shrink-0">&#8226;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-500 mt-2">
                Choose supplements that list individual electrolyte amounts. Avoid products with excessive added sugars. Magnesium glycinate and citrate are generally better absorbed than magnesium oxide.
              </p>
            </div>
          </div>

          {/* Warning signs of deficiency */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Warning Signs of Electrolyte Deficiency
            </p>
            {Object.entries(deficiencySigns).map(([electrolyte, signs]) => (
              <div key={electrolyte}>
                <p className="text-sm font-semibold text-stone-700 mb-1">{electrolyte}</p>
                <ul className="space-y-1">
                  {signs.map((sign, si) => (
                    <li key={si} className="flex gap-2 text-sm text-stone-600">
                      <span className="text-stone-400 shrink-0">&#8226;</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-xs text-stone-500">
              If you experience persistent symptoms of electrolyte imbalance, consult a healthcare professional. Severe imbalances can affect heart rhythm and require medical treatment.
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">Medical Disclaimer</p>
        <p>
          This tool provides general estimates for informational purposes only. Individual electrolyte needs vary based on health conditions, medications, and other factors. People with kidney disease, heart conditions, or those taking diuretics or blood pressure medication should consult their doctor before adjusting electrolyte intake. This tool does not constitute medical advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
