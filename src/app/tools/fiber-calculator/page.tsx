"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("fiber-calculator")!;

interface FiberFood {
  name: string;
  grams: number;
  category: string;
}

const HIGH_FIBER_FOODS: FiberFood[] = [
  { name: "1 cup lentils (cooked)", grams: 15.6, category: "Legumes" },
  { name: "1 cup black beans (cooked)", grams: 15, category: "Legumes" },
  { name: "1 cup chickpeas (cooked)", grams: 12.5, category: "Legumes" },
  { name: "1 cup split peas (cooked)", grams: 16.3, category: "Legumes" },
  { name: "1 cup kidney beans (cooked)", grams: 13.1, category: "Legumes" },
  { name: "1 cup oatmeal (cooked)", grams: 4, category: "Whole Grains" },
  { name: "1 cup quinoa (cooked)", grams: 5.2, category: "Whole Grains" },
  { name: "1 cup brown rice (cooked)", grams: 3.5, category: "Whole Grains" },
  { name: "2 slices whole wheat bread", grams: 3.8, category: "Whole Grains" },
  { name: "1 cup barley (cooked)", grams: 6, category: "Whole Grains" },
  { name: "1 cup raspberries", grams: 8, category: "Fruits" },
  { name: "1 medium pear", grams: 5.5, category: "Fruits" },
  { name: "1 medium apple (with skin)", grams: 4.4, category: "Fruits" },
  { name: "1 medium banana", grams: 3.1, category: "Fruits" },
  { name: "1 cup strawberries", grams: 3, category: "Fruits" },
  { name: "1 medium avocado", grams: 10, category: "Fruits" },
  { name: "1 cup broccoli (cooked)", grams: 5.1, category: "Vegetables" },
  { name: "1 cup Brussels sprouts (cooked)", grams: 4.1, category: "Vegetables" },
  { name: "1 medium artichoke", grams: 10.3, category: "Vegetables" },
  { name: "1 cup carrots (cooked)", grams: 4.7, category: "Vegetables" },
  { name: "1 cup sweet potato (cooked)", grams: 6.6, category: "Vegetables" },
  { name: "2 tbsp chia seeds", grams: 10, category: "Nuts & Seeds" },
  { name: "2 tbsp ground flaxseed", grams: 3.8, category: "Nuts & Seeds" },
  { name: "1 oz almonds (23 nuts)", grams: 3.5, category: "Nuts & Seeds" },
  { name: "2 tbsp pumpkin seeds", grams: 1.7, category: "Nuts & Seeds" },
];

interface Results {
  recommended: number;
  current: number;
  gap: number;
  percentOfTarget: number;
  status: "green" | "amber" | "red";
  weeklyPlan: { week: number; target: number }[];
  extraWaterMl: number;
  suggestedFoods: FiberFood[];
}

function getRecommended(age: number, sex: string): number {
  if (sex === "male") return age <= 50 ? 38 : 30;
  return age <= 50 ? 25 : 21;
}

export default function FiberCalculatorPage() {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [currentIntake, setCurrentIntake] = useState("15");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const ageNum = parseInt(age) || 30;
    const current = parseFloat(currentIntake) || 0;
    const recommended = getRecommended(ageNum, sex);
    const gap = Math.max(0, recommended - current);
    const pct = recommended > 0 ? Math.round((current / recommended) * 100) : 0;

    let status: "green" | "amber" | "red";
    if (pct >= 100) status = "green";
    else if (pct >= 60) status = "amber";
    else status = "red";

    // Build weekly gradual increase plan
    const weeklyPlan: { week: number; target: number }[] = [];
    if (gap > 0) {
      let accumulated = current;
      let week = 1;
      while (accumulated < recommended) {
        const increase = Math.min(gap <= 10 ? 3 : 5, recommended - accumulated);
        accumulated += increase;
        accumulated = Math.min(accumulated, recommended);
        weeklyPlan.push({ week, target: Math.round(accumulated * 10) / 10 });
        week++;
      }
    }

    // Extra water recommendation
    const extraWaterMl = Math.round((gap / 5) * 250);

    // Suggest foods to close the gap
    const suggestedFoods: FiberFood[] = [];
    let remaining = gap;
    const categories = ["Legumes", "Whole Grains", "Fruits", "Vegetables", "Nuts & Seeds"];
    for (const cat of categories) {
      if (remaining <= 0) break;
      const catFoods = HIGH_FIBER_FOODS.filter((f) => f.category === cat);
      if (catFoods.length > 0) {
        const pick = catFoods[0];
        suggestedFoods.push(pick);
        remaining -= pick.grams;
      }
    }
    // If still short, add more
    if (remaining > 0) {
      for (const food of HIGH_FIBER_FOODS) {
        if (remaining <= 0) break;
        if (!suggestedFoods.includes(food)) {
          suggestedFoods.push(food);
          remaining -= food.grams;
        }
      }
    }

    setResults({
      recommended,
      current,
      gap,
      percentOfTarget: pct,
      status,
      weeklyPlan,
      extraWaterMl,
      suggestedFoods,
    });
  }

  const statusColors = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  const statusBg = {
    green: "bg-green-50 border-green-200",
    amber: "bg-amber-50 border-amber-200",
    red: "bg-red-50 border-red-200",
  };

  const statusText = {
    green: "text-green-700",
    amber: "text-amber-700",
    red: "text-red-700",
  };

  const categories = ["Legumes", "Whole Grains", "Fruits", "Vegetables", "Nuts & Seeds"];

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 30"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Current estimated daily fiber intake (grams)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={currentIntake}
            onChange={(e) => setCurrentIntake(e.target.value)}
            placeholder="e.g. 15"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Recommended daily fiber */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Recommended Daily Fiber
            </p>
            <p className="text-4xl font-bold text-emerald-600">
              {results.recommended}g
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Based on Academy of Nutrition &amp; Dietetics guidelines
            </p>
          </div>

          {/* Progress bar */}
          <div className={`border rounded-xl p-5 ${statusBg[results.status]}`}>
            <div className="flex items-end justify-between mb-2">
              <span className="text-sm font-medium">Current vs Target</span>
              <span className={`text-sm font-bold ${statusText[results.status]}`}>
                {results.percentOfTarget}%
              </span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all ${statusColors[results.status]}`}
                style={{
                  width: `${Math.min(results.percentOfTarget, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>{results.current}g current</span>
              <span>{results.recommended}g target</span>
            </div>
          </div>

          {/* Fiber gap */}
          {results.gap > 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Fiber Gap</p>
              <p className="text-3xl font-bold text-red-500">
                +{results.gap}g needed
              </p>
              <p className="text-sm text-stone-500 mt-1">
                You need {results.gap} more grams per day to reach your target
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-sm text-green-700 font-medium">
                You are meeting or exceeding your daily fiber target. Well done!
              </p>
            </div>
          )}

          {/* Suggested foods to close the gap */}
          {results.gap > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-medium text-stone-700">
                Foods to Close the Gap
              </p>
              <p className="text-sm text-stone-500">
                Add these to your daily diet to reach your {results.recommended}g
                target:
              </p>
              {categories.map((cat) => {
                const foods = results.suggestedFoods.filter(
                  (f) => f.category === cat
                );
                if (foods.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
                      {cat}
                    </p>
                    {foods.map((food, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0"
                      >
                        <span className="text-stone-600">{food.name}</span>
                        <span className="font-medium text-emerald-600">
                          +{food.grams}g
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* All high-fiber foods reference */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              High-Fiber Foods Reference
            </p>
            {categories.map((cat) => {
              const foods = HIGH_FIBER_FOODS.filter((f) => f.category === cat);
              return (
                <div key={cat}>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
                    {cat}
                  </p>
                  <div className="space-y-0.5">
                    {foods.map((food, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm py-0.5"
                      >
                        <span className="text-stone-600">{food.name}</span>
                        <span className="text-stone-500">{food.grams}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradual increase plan */}
          {results.weeklyPlan.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-medium text-stone-700">
                Gradual Increase Plan
              </p>
              <p className="text-sm text-stone-500">
                Increase fiber slowly to avoid bloating and discomfort:
              </p>
              <div className="space-y-2">
                {results.weeklyPlan.map((w) => (
                  <div key={w.week} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-stone-400 w-16 shrink-0">
                      Week {w.week}
                    </span>
                    <div className="flex-1 bg-stone-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full bg-emerald-400 transition-all"
                        style={{
                          width: `${Math.min(
                            (w.target / results.recommended) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {w.target}g
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hydration reminder */}
          {results.gap > 0 && results.extraWaterMl > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-sm font-medium text-blue-700 mb-1">
                Hydration Reminder
              </p>
              <p className="text-sm text-blue-600">
                When increasing fiber, increase your water intake by approximately{" "}
                <strong>{results.extraWaterMl} ml</strong> per day (~
                {Math.round(results.extraWaterMl / 250)} extra glasses). Fiber
                absorbs water, and adequate hydration prevents constipation and
                supports digestion.
              </p>
            </div>
          )}

          {/* Benefits section */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Why Fiber Matters
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">*</span>
                <span>
                  <strong>Digestive health:</strong> Fiber promotes regular bowel
                  movements and feeds beneficial gut bacteria.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">*</span>
                <span>
                  <strong>Heart health:</strong> Soluble fiber lowers LDL
                  cholesterol and reduces cardiovascular disease risk.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">*</span>
                <span>
                  <strong>Blood sugar control:</strong> Fiber slows glucose
                  absorption, preventing blood sugar spikes after meals.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">*</span>
                <span>
                  <strong>Weight management:</strong> High-fiber foods increase
                  satiety, helping you feel full longer on fewer calories.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">*</span>
                <span>
                  <strong>Cancer prevention:</strong> Adequate fiber intake is
                  associated with lower risk of colorectal cancer.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 shrink-0">*</span>
                <span>
                  <strong>Longevity:</strong> Studies consistently link higher
                  fiber intake with reduced all-cause mortality.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About fiber intake</p>
        <p>
          The Academy of Nutrition and Dietetics recommends 14 grams of fiber
          per 1,000 calories consumed. Most adults in Western countries consume
          only about 15 grams per day, roughly half the recommended amount.
          Increasing fiber intake gradually and staying well hydrated is the
          safest approach. This tool provides general estimates and is not a
          substitute for personalised dietary advice from a registered dietitian.
        </p>
      </div>
    </ToolPageLayout>
  );
}
