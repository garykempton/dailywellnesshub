"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("alcohol-unit-calculator")!;

interface DrinkType {
  name: string;
  defaultAbv: number;
  defaultMl: number;
}

const DRINK_TYPES: DrinkType[] = [
  { name: "Beer/Lager (pint 568ml)", defaultAbv: 4.5, defaultMl: 568 },
  { name: "Beer/Lager (330ml bottle)", defaultAbv: 4.5, defaultMl: 330 },
  { name: "Wine (small 125ml)", defaultAbv: 13, defaultMl: 125 },
  { name: "Wine (medium 175ml)", defaultAbv: 13, defaultMl: 175 },
  { name: "Wine (large 250ml)", defaultAbv: 13, defaultMl: 250 },
  { name: "Spirit (single 25ml)", defaultAbv: 40, defaultMl: 25 },
  { name: "Spirit (double 50ml)", defaultAbv: 40, defaultMl: 50 },
  { name: "Cocktail (average)", defaultAbv: 15, defaultMl: 200 },
  { name: "Cider (pint 568ml)", defaultAbv: 5, defaultMl: 568 },
  { name: "Custom", defaultAbv: 5, defaultMl: 330 },
];

interface DrinkEntry {
  typeIndex: number;
  abv: string;
  volumeMl: string;
  quantity: string;
}

interface DrinkResult {
  name: string;
  units: number;
  calories: number;
}

interface Results {
  totalUnits: number;
  totalCalories: number;
  metabolismHours: number;
  weeklyPercentage: number;
  drinks: DrinkResult[];
  trafficLight: "green" | "amber" | "red";
  bingeWarning: boolean;
}

function calcUnits(volumeMl: number, abv: number): number {
  return (volumeMl * abv) / 1000;
}

function calcCalories(units: number): number {
  return Math.round(units * 80);
}

export default function AlcoholUnitCalculatorPage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [entries, setEntries] = useState<DrinkEntry[]>([
    {
      typeIndex: 0,
      abv: String(DRINK_TYPES[0].defaultAbv),
      volumeMl: String(DRINK_TYPES[0].defaultMl),
      quantity: "1",
    },
  ]);
  const [results, setResults] = useState<Results | null>(null);

  function updateEntry(index: number, updates: Partial<DrinkEntry>) {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...updates } : e))
    );
  }

  function changeDrinkType(index: number, typeIndex: number) {
    const dt = DRINK_TYPES[typeIndex];
    updateEntry(index, {
      typeIndex,
      abv: String(dt.defaultAbv),
      volumeMl: String(dt.defaultMl),
    });
  }

  function addEntry() {
    setEntries((prev) => [
      ...prev,
      {
        typeIndex: 0,
        abv: String(DRINK_TYPES[0].defaultAbv),
        volumeMl: String(DRINK_TYPES[0].defaultMl),
        quantity: "1",
      },
    ]);
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function calculate() {
    const drinkResults: DrinkResult[] = entries.map((entry) => {
      const abv = Number(entry.abv) || 0;
      const vol = Number(entry.volumeMl) || 0;
      const qty = Number(entry.quantity) || 1;
      const units = calcUnits(vol, abv) * qty;
      const calories = calcCalories(units);
      return {
        name: DRINK_TYPES[entry.typeIndex].name,
        units: Math.round(units * 100) / 100,
        calories,
      };
    });

    const totalUnits =
      Math.round(drinkResults.reduce((s, d) => s + d.units, 0) * 100) / 100;
    const totalCalories = drinkResults.reduce((s, d) => s + d.calories, 0);
    const metabolismHours = Math.round(totalUnits * 10) / 10;
    const weeklyPercentage = Math.round((totalUnits / 14) * 100);

    let trafficLight: "green" | "amber" | "red";
    if (totalUnits <= 4) {
      trafficLight = "green";
    } else if (totalUnits <= 8) {
      trafficLight = "amber";
    } else {
      trafficLight = "red";
    }

    const bingeThreshold = sex === "male" ? 8 : 6;
    const bingeWarning = totalUnits > bingeThreshold;

    setResults({
      totalUnits,
      totalCalories,
      metabolismHours,
      weeklyPercentage,
      drinks: drinkResults,
      trafficLight,
      bingeWarning,
    });
  }

  const trafficColors = {
    green: "bg-green-50 border-green-200 text-green-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  const trafficLabels = {
    green: "Lower risk",
    amber: "Increasing risk",
    red: "Higher risk",
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Sex for binge threshold */}
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

        <p className="text-sm font-medium text-stone-700">
          Add your drinks:
        </p>

        {entries.map((entry, i) => (
          <div
            key={i}
            className="border border-stone-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-600">
                Drink {i + 1}
              </span>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(i)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Drink type
              </label>
              <select
                value={entry.typeIndex}
                onChange={(e) => changeDrinkType(i, Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                {DRINK_TYPES.map((d, di) => (
                  <option key={di} value={di}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">ABV %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={entry.abv}
                  onChange={(e) => updateEntry(i, { abv: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  min="0"
                  value={entry.volumeMl}
                  onChange={(e) => updateEntry(i, { volumeMl: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={entry.quantity}
                  onChange={(e) => updateEntry(i, { quantity: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addEntry}
          className="w-full border border-dashed border-stone-300 rounded-lg py-2 text-sm text-stone-500 hover:border-stone-500 hover:text-stone-700 transition-colors"
        >
          + Add another drink
        </button>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Total units - big card */}
          <div
            className={`border rounded-xl p-5 text-center ${
              trafficColors[results.trafficLight]
            }`}
          >
            <p className="text-sm font-medium mb-1">Total units this session</p>
            <p className="text-4xl font-bold">{results.totalUnits}</p>
            <p className="text-sm font-medium mt-1">
              {trafficLabels[results.trafficLight]}
            </p>
          </div>

          {results.bingeWarning && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-red-700">
                Binge drinking warning: More than{" "}
                {sex === "male" ? "8" : "6"} units in a single session is
                classified as binge drinking and significantly increases health
                risks.
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Total calories</p>
              <p className="text-2xl font-bold">{results.totalCalories}</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Time to metabolise</p>
              <p className="text-2xl font-bold">{results.metabolismHours} hrs</p>
            </div>
          </div>

          {/* Weekly limit progress */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-2">
              Weekly 14-unit guideline
            </p>
            <div className="flex items-end justify-between mb-1">
              <span className="text-lg font-bold">
                {results.totalUnits} / 14 units
              </span>
              <span className="text-sm text-stone-500">
                {results.weeklyPercentage}%
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${
                  results.weeklyPercentage > 100
                    ? "bg-red-500"
                    : results.weeklyPercentage > 70
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(results.weeklyPercentage, 100)}%`,
                }}
              />
            </div>
            {results.weeklyPercentage > 100 && (
              <p className="text-sm text-red-600 mt-1 font-medium">
                This single session already exceeds the recommended weekly limit.
              </p>
            )}
          </div>

          {/* Per-drink breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Breakdown by drink
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 pr-4 text-stone-500 font-medium">
                      Drink
                    </th>
                    <th className="text-right py-2 px-2 text-stone-500 font-medium">
                      Units
                    </th>
                    <th className="text-right py-2 pl-2 text-stone-500 font-medium">
                      Calories
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.drinks.map((d, i) => (
                    <tr key={i} className="border-b border-stone-100">
                      <td className="py-2 pr-4 text-stone-600">{d.name}</td>
                      <td className="py-2 px-2 text-right font-medium">
                        {d.units}
                      </td>
                      <td className="py-2 pl-2 text-right font-medium">
                        {d.calories}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          About alcohol units
        </p>
        <p className="mb-2">
          One UK alcohol unit equals 10 ml (8 g) of pure ethanol. The formula is
          simple: multiply the volume in millilitres by the ABV percentage, then
          divide by 1,000. For example, a pint (568 ml) of 4.5% beer contains
          2.56 units.
        </p>
        <p className="mb-2">
          The UK Chief Medical Officers recommend no more than 14 units per week
          for both men and women, spread across three or more days. Regularly
          drinking above this level increases the risk of liver disease, certain
          cancers, heart disease, and mental health problems.
        </p>
        <p>
          Your body processes roughly one unit of alcohol per hour, though this
          varies with weight, sex, metabolism, and food intake. Calorie estimates
          are approximate. This tool is for informational purposes only and is
          not a substitute for medical advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
