"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("pregnancy-weight-gain-calculator")!;

type Unit = "metric" | "imperial";
type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

interface GainRange {
  min: number;
  max: number;
}

const IOM_RANGES: Record<BmiCategory, { singleton: GainRange; twins: GainRange | null }> = {
  underweight: { singleton: { min: 12.5, max: 18 }, twins: null },
  normal: { singleton: { min: 11.5, max: 16 }, twins: { min: 16.8, max: 24.5 } },
  overweight: { singleton: { min: 7, max: 11.5 }, twins: { min: 14.1, max: 22.7 } },
  obese: { singleton: { min: 5, max: 9 }, twins: { min: 11.3, max: 19.1 } },
};

const WEEKLY_RATES: Record<BmiCategory, number> = {
  underweight: 0.51,
  normal: 0.42,
  overweight: 0.28,
  obese: 0.22,
};

const FIRST_TRIMESTER_GAIN = { min: 0.5, max: 2, mid: 1.25 };

const MILESTONES = [13, 20, 28, 36, 40];

const WEIGHT_BREAKDOWN = [
  { label: "Baby", kg: 3.4 },
  { label: "Placenta", kg: 0.7 },
  { label: "Amniotic fluid", kg: 0.8 },
  { label: "Uterine growth", kg: 0.9 },
  { label: "Breast tissue", kg: 0.5 },
  { label: "Blood volume", kg: 1.2 },
  { label: "Fat stores", kg: 2.7 },
  { label: "Fluid retention", kg: 1.8 },
];

function classifyBmi(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function bmiLabel(cat: BmiCategory): string {
  return { underweight: "Underweight", normal: "Normal weight", overweight: "Overweight", obese: "Obese" }[cat];
}

function bmiColor(cat: BmiCategory): string {
  return { underweight: "text-blue-600", normal: "text-green-600", overweight: "text-amber-600", obese: "text-red-600" }[cat];
}

function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

function expectedGainAtWeek(week: number, category: BmiCategory): { min: number; max: number } {
  if (week <= 13) {
    const frac = week / 13;
    return { min: FIRST_TRIMESTER_GAIN.min * frac, max: FIRST_TRIMESTER_GAIN.max * frac };
  }
  const weeksPast13 = week - 13;
  const rate = WEEKLY_RATES[category];
  const midFirst = FIRST_TRIMESTER_GAIN.mid;
  const gain = midFirst + rate * weeksPast13;
  const spread = rate * 0.5 * weeksPast13;
  return { min: Math.max(0, gain - spread), max: gain + spread };
}

export default function PregnancyWeightGainPage() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [preWeight, setPreWeight] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [week, setWeek] = useState("");
  const [twins, setTwins] = useState(false);
  const [result, setResult] = useState<{
    bmi: number;
    category: BmiCategory;
    range: GainRange;
    currentGain: number;
    expectedMin: number;
    expectedMax: number;
    status: "below" | "within" | "above";
  } | null>(null);

  function calculate() {
    const pw = parseFloat(preWeight);
    const cw = parseFloat(currentWeight);
    const wk = parseInt(week, 10);
    if (!pw || !cw || !wk || wk < 1 || wk > 42) return;

    let heightM: number;
    if (unit === "metric") {
      heightM = parseFloat(heightCm) / 100;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      heightM = (ft * 12 + inches) * 0.0254;
    }
    if (!heightM || heightM <= 0) return;

    const weightKg = unit === "imperial" ? lbsToKg(pw) : pw;
    const currentKg = unit === "imperial" ? lbsToKg(cw) : cw;
    const bmi = weightKg / (heightM * heightM);
    const category = classifyBmi(bmi);

    const rangeData = IOM_RANGES[category];
    const range = twins && rangeData.twins ? rangeData.twins : rangeData.singleton;

    const currentGain = currentKg - weightKg;
    const expected = expectedGainAtWeek(wk, category);

    let status: "below" | "within" | "above" = "within";
    if (currentGain < expected.min) status = "below";
    else if (currentGain > expected.max) status = "above";

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      range,
      currentGain: Math.round(currentGain * 10) / 10,
      expectedMin: Math.round(expected.min * 10) / 10,
      expectedMax: Math.round(expected.max * 10) / 10,
      status,
    });
  }

  function displayWeight(kg: number): string {
    if (unit === "imperial") return `${Math.round(kgToLbs(kg) * 10) / 10} lbs`;
    return `${Math.round(kg * 10) / 10} kg`;
  }

  const wkNum = parseInt(week, 10) || 0;

  return (
    <ToolPageLayout tool={tool}>
      {/* Unit toggle */}
      <div className="flex gap-2 mb-6">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            onClick={() => {
              setUnit(u);
              setResult(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              unit === u
                ? "bg-primary text-white border-primary"
                : "border-stone-300 text-stone-600 hover:border-stone-500"
            }`}
          >
            {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft-in / lbs)"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Height */}
        {unit === "metric" ? (
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="165"
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Height (ft)</label>
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Height (in)</label>
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="5"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* Pre-pregnancy weight */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Pre-pregnancy Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={preWeight}
            onChange={(e) => setPreWeight(e.target.value)}
            placeholder={unit === "metric" ? "60" : "132"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Current weight */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder={unit === "metric" ? "65" : "143"}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Week of pregnancy */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Week of Pregnancy (1-42)
          </label>
          <input
            type="number"
            min={1}
            max={42}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            placeholder="20"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Twin pregnancy */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={twins}
            onChange={(e) => setTwins(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300"
          />
          <span className="text-sm text-stone-700">Twin pregnancy</span>
        </label>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* BMI Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500 mb-1">Pre-pregnancy BMI</p>
            <p className="text-4xl font-bold">{result.bmi}</p>
            <p className={`text-lg font-semibold mt-1 ${bmiColor(result.category)}`}>
              {bmiLabel(result.category)}
            </p>
          </div>

          {/* Recommended total gain */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-600 mb-1">
              Recommended Total Weight Gain{twins ? " (Twins)" : ""}
            </p>
            <p className="text-3xl font-bold text-green-700">
              {displayWeight(result.range.min)} &ndash; {displayWeight(result.range.max)}
            </p>
            {twins && result.category === "underweight" && (
              <p className="text-xs text-amber-600 mt-2">
                Note: IOM does not provide specific twin guidelines for underweight BMI.
                Showing singleton range.
              </p>
            )}
          </div>

          {/* Current gain vs expected */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <p className="text-sm text-stone-500 mb-3">
              Weight Gain at Week {week}
            </p>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-stone-400">Your gain</p>
                <p className="text-2xl font-bold">{displayWeight(result.currentGain)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400">Expected range</p>
                <p className="text-lg font-semibold text-stone-600">
                  {displayWeight(result.expectedMin)} &ndash; {displayWeight(result.expectedMax)}
                </p>
              </div>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                result.status === "within"
                  ? "bg-green-100 text-green-700"
                  : result.status === "below"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {result.status === "within"
                ? "Within range"
                : result.status === "below"
                ? "Below expected range"
                : "Above expected range"}
            </span>

            {/* Visual bar */}
            <div className="mt-4">
              <div className="relative h-6 bg-stone-100 rounded-full overflow-hidden">
                {/* Expected range highlight */}
                <div
                  className="absolute top-0 h-full bg-green-100 border-l border-r border-green-300"
                  style={{
                    left: `${Math.max(0, (result.expectedMin / result.range.max) * 100)}%`,
                    width: `${Math.min(100, ((result.expectedMax - result.expectedMin) / result.range.max) * 100)}%`,
                  }}
                />
                {/* Current marker */}
                <div
                  className="absolute top-0 h-full w-1 bg-stone-800 rounded"
                  style={{
                    left: `${Math.min(100, Math.max(0, (result.currentGain / result.range.max) * 100))}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-stone-400 mt-1">
                <span>0</span>
                <span>{displayWeight(result.range.max)}</span>
              </div>
            </div>
          </div>

          {/* Milestone table */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-800">
              Expected Gain at Key Milestones
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 text-stone-500 font-medium">Week</th>
                    <th className="text-right py-2 text-stone-500 font-medium">Expected Gain</th>
                  </tr>
                </thead>
                <tbody>
                  {MILESTONES.map((wk) => {
                    const exp = expectedGainAtWeek(wk, result.category);
                    return (
                      <tr key={wk} className="border-b border-stone-100">
                        <td className="py-2 text-stone-700">Week {wk}</td>
                        <td className="py-2 text-right text-stone-600">
                          {displayWeight(exp.min)} &ndash; {displayWeight(exp.max)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weight breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-medium text-stone-800">
              What Does the Weight Consist Of?
            </p>
            <p className="text-xs text-stone-400">
              Typical breakdown at full term (singleton, approximate)
            </p>
            <div className="space-y-2">
              {WEIGHT_BREAKDOWN.map((item) => {
                const total = WEIGHT_BREAKDOWN.reduce((s, i) => s + i.kg, 0);
                const pct = (item.kg / total) * 100;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-700">{item.label}</span>
                      <span className="text-stone-500">{displayWeight(item.kg)}</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">Disclaimer</p>
        <p>
          Weight gain recommendations are based on the Institute of Medicine
          (IOM) guidelines and are general ranges. Every pregnancy is different.
          Factors such as age, activity level, and medical history all influence
          healthy weight gain. Twin pregnancy guidelines for underweight BMI are
          not well established. Always consult your healthcare provider for
          personalised guidance. This tool is for informational purposes only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
