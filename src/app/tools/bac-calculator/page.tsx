"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("bac-calculator")!;

const DRINK_TYPES = [
  { name: "Beer (pint 568ml, 5%)", ml: 568, abv: 5 },
  { name: "Beer (330ml, 5%)", ml: 330, abv: 5 },
  { name: "Wine (175ml, 13%)", ml: 175, abv: 13 },
  { name: "Spirit (25ml single, 40%)", ml: 25, abv: 40 },
  { name: "Spirit (50ml double, 40%)", ml: 50, abv: 40 },
  { name: "Cocktail (200ml, 15%)", ml: 200, abv: 15 },
  { name: "Cider (568ml, 5%)", ml: 568, abv: 5 },
  { name: "Custom", ml: 330, abv: 5 },
] as const;

interface DrinkEntry {
  typeIndex: number;
  volumeMl: string;
  abv: string;
  quantity: string;
}

interface DrinkBreakdown {
  name: string;
  alcoholGrams: number;
  quantity: number;
}

interface BacResults {
  bac: number;
  bacBeforeMetabolism: number;
  label: string;
  colorClass: string;
  effects: string;
  timeToSober: number | null;
  timeToLegal: number | null;
  drinks: DrinkBreakdown[];
  totalAlcoholGrams: number;
  timeline: { hour: number; bac: number }[];
}

function getBacLevel(bac: number): { label: string; colorClass: string; effects: string } {
  if (bac <= 0)
    return {
      label: "Sober",
      colorClass: "bg-green-50 border-green-200 text-green-700",
      effects: "No measurable effects. You have no alcohol in your system.",
    };
  if (bac <= 0.03)
    return {
      label: "Minimal effects",
      colorClass: "bg-green-50 border-green-200 text-green-700",
      effects:
        "Slight mood elevation, mild relaxation. Most people feel normal. Subtle impairment of judgment may already be present.",
    };
  if (bac <= 0.06)
    return {
      label: "Mild impairment",
      colorClass: "bg-yellow-50 border-yellow-200 text-yellow-700",
      effects:
        "Lowered inhibitions, warmth and relaxation, minor impairment of reasoning and memory. Feelings of well-being and talkativeness.",
    };
  if (bac <= 0.09)
    return {
      label: "Significant impairment",
      colorClass: "bg-amber-50 border-amber-200 text-amber-700",
      effects:
        "Reduced coordination, balance, and reaction time. Impaired judgment, self-control, and reasoning. Speech may become slurred. Above the legal driving limit in most jurisdictions.",
    };
  if (bac <= 0.15)
    return {
      label: "Severe impairment",
      colorClass: "bg-orange-50 border-orange-200 text-orange-700",
      effects:
        "Significant loss of motor control. Blurred vision, major loss of balance. Judgment and perception severely impaired. Euphoria may give way to dysphoria.",
    };
  if (bac <= 0.29)
    return {
      label: "Very severe impairment",
      colorClass: "bg-red-50 border-red-200 text-red-700",
      effects:
        "Severe motor impairment, loss of consciousness possible, risk of choking on vomit, blackouts likely. Memory formation severely disrupted.",
    };
  return {
    label: "Life-threatening - seek medical help",
    colorClass: "bg-red-100 border-red-300 text-red-800",
    effects:
      "Risk of alcohol poisoning, loss of consciousness, respiratory depression, and death. Call emergency services immediately if someone reaches this level.",
  };
}

function formatTime(hours: number): string {
  if (hours <= 0) return "Now";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export default function BacCalculatorPage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [entries, setEntries] = useState<DrinkEntry[]>([
    { typeIndex: 0, volumeMl: String(DRINK_TYPES[0].ml), abv: String(DRINK_TYPES[0].abv), quantity: "1" },
  ]);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [results, setResults] = useState<BacResults | null>(null);

  function updateEntry(index: number, updates: Partial<DrinkEntry>) {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...updates } : e)));
  }

  function changeDrinkType(index: number, typeIndex: number) {
    const dt = DRINK_TYPES[typeIndex];
    updateEntry(index, { typeIndex, volumeMl: String(dt.ml), abv: String(dt.abv) });
  }

  function addEntry() {
    setEntries((prev) => [
      ...prev,
      { typeIndex: 0, volumeMl: String(DRINK_TYPES[0].ml), abv: String(DRINK_TYPES[0].abv), quantity: "1" },
    ]);
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function calculate() {
    const weightKg = weightUnit === "lbs" ? (Number(weight) || 0) * 0.453592 : Number(weight) || 0;
    if (weightKg <= 0) return;

    const totalHours = (Number(hours) || 0) + (Number(minutes) || 0) / 60;
    const r = sex === "male" ? 0.68 : 0.55;

    const drinkBreakdowns: DrinkBreakdown[] = entries.map((entry) => {
      const vol = Number(entry.volumeMl) || 0;
      const abv = Number(entry.abv) || 0;
      const qty = Number(entry.quantity) || 1;
      const alcoholGrams = vol * (abv / 100) * 0.789 * qty;
      return {
        name: DRINK_TYPES[entry.typeIndex].name,
        alcoholGrams: Math.round(alcoholGrams * 100) / 100,
        quantity: qty,
      };
    });

    const totalAlcoholGrams = drinkBreakdowns.reduce((s, d) => s + d.alcoholGrams, 0);
    const bacBeforeMetabolism = (totalAlcoholGrams / (weightKg * 1000 * r)) * 100;
    const bac = Math.max(0, bacBeforeMetabolism - 0.015 * totalHours);

    const timeToSober = bac > 0 ? bac / 0.015 : null;
    const timeToLegal =
      bac > 0.08 ? (bac - 0.08) / 0.015 : null;

    const level = getBacLevel(bac);

    // Build timeline
    const timeline: { hour: number; bac: number }[] = [];
    const maxHours = Math.ceil((bacBeforeMetabolism / 0.015) - totalHours) + 1;
    const steps = Math.min(Math.max(maxHours, 1), 24);
    for (let h = 0; h <= steps; h++) {
      const projectedBac = Math.max(0, bacBeforeMetabolism - 0.015 * (totalHours + h));
      timeline.push({ hour: h, bac: Math.round(projectedBac * 1000) / 1000 });
      if (projectedBac <= 0) break;
    }

    setResults({
      bac: Math.round(bac * 1000) / 1000,
      bacBeforeMetabolism: Math.round(bacBeforeMetabolism * 1000) / 1000,
      label: level.label,
      colorClass: level.colorClass,
      effects: level.effects,
      timeToSober,
      timeToLegal,
      drinks: drinkBreakdowns,
      totalAlcoholGrams: Math.round(totalAlcoholGrams * 10) / 10,
      timeline,
    });
  }

  const maxTimelineBac = results ? Math.max(...results.timeline.map((t) => t.bac), 0.01) : 0;

  return (
    <ToolPageLayout tool={tool}>
      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-red-700">
          This is an estimate only. Never use this to decide if you are safe to drive. The only safe
          BAC for driving is 0.00%.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
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

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium mb-1">Body weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={weightUnit === "kg" ? "70" : "154"}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex border border-stone-300 rounded-lg overflow-hidden shrink-0">
              {(["kg", "lbs"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setWeightUnit(u)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    weightUnit === u ? "bg-primary text-white" : "bg-white text-stone-600"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drinks */}
        <p className="text-sm font-medium text-stone-700">Your drinks:</p>

        {entries.map((entry, i) => {
          const isCustom = entry.typeIndex === DRINK_TYPES.length - 1;
          return (
            <div key={i} className="border border-stone-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">Drink {i + 1}</span>
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
                <label className="block text-sm font-medium mb-1">Drink type</label>
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
              {isCustom && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Volume (ml)</label>
                    <input
                      type="number"
                      min="0"
                      value={entry.volumeMl}
                      onChange={(e) => updateEntry(i, { volumeMl: e.target.value })}
                      className="w-full border border-stone-300 rounded-lg px-3 py-2"
                    />
                  </div>
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
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={entry.quantity}
                  onChange={(e) => updateEntry(i, { quantity: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          );
        })}

        <button
          onClick={addEntry}
          className="w-full border border-dashed border-stone-300 rounded-lg py-2 text-sm text-stone-500 hover:border-stone-500 hover:text-stone-700 transition-colors"
        >
          + Add another drink
        </button>

        {/* Time since first drink */}
        <div>
          <label className="block text-sm font-medium mb-1">Time since first drink</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Hours</label>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate BAC
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* BAC big card */}
          <div className={`border rounded-xl p-5 text-center ${results.colorClass}`}>
            <p className="text-sm font-medium mb-1">Estimated Blood Alcohol Concentration</p>
            <p className="text-5xl font-bold">{results.bac.toFixed(3)}%</p>
            <p className="text-sm font-semibold mt-2">{results.label}</p>
          </div>

          {/* Effects */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">Effects at this level</p>
            <p className="text-sm text-stone-600">{results.effects}</p>
          </div>

          {/* Time stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Time until sober (0.00%)</p>
              <p className="text-2xl font-bold">
                {results.timeToSober !== null ? formatTime(results.timeToSober) : "Now"}
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <p className="text-xs text-stone-500">Time until legal limit (0.08%)</p>
              <p className="text-2xl font-bold">
                {results.timeToLegal !== null ? formatTime(results.timeToLegal) : "Already below"}
              </p>
            </div>
          </div>

          {/* Per-drink breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Drink breakdown ({results.totalAlcoholGrams}g total alcohol)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 pr-4 text-stone-500 font-medium">Drink</th>
                    <th className="text-right py-2 px-2 text-stone-500 font-medium">Qty</th>
                    <th className="text-right py-2 pl-2 text-stone-500 font-medium">Alcohol (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.drinks.map((d, i) => (
                    <tr key={i} className="border-b border-stone-100">
                      <td className="py-2 pr-4 text-stone-600">{d.name}</td>
                      <td className="py-2 px-2 text-right font-medium">{d.quantity}</td>
                      <td className="py-2 pl-2 text-right font-medium">{d.alcoholGrams.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BAC Timeline */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-4">
              Projected BAC decline from now
            </p>
            <div className="space-y-2">
              {results.timeline.map((point) => {
                const pct = maxTimelineBac > 0 ? (point.bac / maxTimelineBac) * 100 : 0;
                const isAboveLimit = point.bac >= 0.08;
                return (
                  <div key={point.hour} className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 w-14 text-right shrink-0">
                      {point.hour === 0 ? "Now" : `+${point.hour}h`}
                    </span>
                    <div className="flex-1 bg-stone-100 rounded-full h-5 overflow-hidden relative">
                      <div
                        className={`h-5 rounded-full transition-all ${
                          isAboveLimit ? "bg-red-400" : point.bac > 0 ? "bg-amber-400" : "bg-green-400"
                        }`}
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-14 shrink-0">{point.bac.toFixed(3)}%</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Above 0.08%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Below 0.08%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Sober
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About this calculator</p>
        <p className="mb-2">
          This tool uses the Widmark formula to estimate BAC: total alcohol in grams is calculated as
          volume (ml) x ABV x 0.789 (ethanol density). BAC = (alcohol grams / (body weight in grams
          x Widmark r factor)) x 100 minus 0.015% per hour of metabolism. The r factor is 0.68 for
          males and 0.55 for females.
        </p>
        <p className="mb-2">
          Individual BAC varies based on genetics, food intake, hydration, medications, liver
          health, and many other factors. This estimate can be significantly different from your
          actual BAC. The only way to know your true BAC is with a calibrated breathalyser or blood
          test.
        </p>
        <p>
          Never rely on any calculator to determine if you are safe to drive or operate machinery.
          Impairment can occur at any BAC level. If you have been drinking, arrange alternative
          transport.
        </p>
      </div>
    </ToolPageLayout>
  );
}
