"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("waist-to-height-ratio-calculator")!;

type WaistUnit = "cm" | "in";
type HeightUnit = "cm" | "ftin";
type Sex = "male" | "female";

interface Results {
  whtr: number;
  category: string;
  categoryColor: { bg: string; border: string; text: string };
  description: string;
  waistCm: number;
  heightCm: number;
  targetWaistCm: number;
  targetWaistIn: number;
}

function classifyWHtR(ratio: number): { category: string; color: { bg: string; border: string; text: string }; description: string } {
  if (ratio < 0.4) {
    return {
      category: "Underweight Risk",
      color: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
      description: "Your waist-to-height ratio suggests you may be underweight. Being underweight can lead to nutritional deficiencies, weakened immunity, and reduced bone density. Consider consulting a healthcare provider about healthy weight gain strategies.",
    };
  }
  if (ratio <= 0.5) {
    return {
      category: "Healthy",
      color: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
      description: "Your waist circumference is less than half your height, which is associated with a lower risk of cardiovascular disease, type 2 diabetes, and other obesity-related conditions. Keep up the healthy habits.",
    };
  }
  if (ratio <= 0.6) {
    return {
      category: "Increased Risk",
      color: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
      description: "Your waist circumference exceeds half your height, which is associated with increased risk for cardiovascular disease, type 2 diabetes, and metabolic syndrome. Lifestyle changes such as diet improvements and regular exercise can help reduce this ratio.",
    };
  }
  return {
    category: "High Risk",
    color: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
    description: "Your waist-to-height ratio indicates a significantly elevated risk for cardiovascular disease, type 2 diabetes, stroke, and other serious health conditions. We strongly recommend consulting a healthcare provider to discuss strategies for reducing central body fat.",
  };
}

export default function WaistToHeightRatioCalculatorPage() {
  const [waist, setWaist] = useState("");
  const [waistUnit, setWaistUnit] = useState<WaistUnit>("cm");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const waistVal = Number(waist);
    if (!waistVal || waistVal <= 0) return;

    let hCm: number;
    if (heightUnit === "cm") {
      hCm = Number(heightCm);
    } else {
      const ft = Number(heightFt) || 0;
      const inches = Number(heightIn) || 0;
      hCm = (ft * 12 + inches) * 2.54;
    }
    if (!hCm || hCm <= 0) return;

    const wCm = waistUnit === "in" ? waistVal * 2.54 : waistVal;
    const whtr = wCm / hCm;
    const classification = classifyWHtR(whtr);

    const targetCm = hCm / 2;
    const targetIn = targetCm / 2.54;

    setResults({
      whtr: Math.round(whtr * 1000) / 1000,
      category: classification.category,
      categoryColor: classification.color,
      description: classification.description,
      waistCm: Math.round(wCm * 10) / 10,
      heightCm: Math.round(hCm * 10) / 10,
      targetWaistCm: Math.round(targetCm * 10) / 10,
      targetWaistIn: Math.round(targetIn * 10) / 10,
    });
  }

  // Gauge position: map 0.3-0.7 to 0-100%
  function getGaugePos(ratio: number): number {
    const min = 0.3;
    const max = 0.7;
    return Math.min(100, Math.max(0, ((ratio - min) / (max - min)) * 100));
  }

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
          <p className="text-xs text-stone-400 mt-1">Used for context only; the 0.5 threshold applies universally.</p>
        </div>

        {/* Waist */}
        <div>
          <label className="block text-sm font-medium mb-1">Waist Circumference</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              placeholder={waistUnit === "cm" ? "e.g. 85" : "e.g. 33"}
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex shrink-0">
              <button
                onClick={() => setWaistUnit("cm")}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  waistUnit === "cm" ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                cm
              </button>
              <button
                onClick={() => setWaistUnit("in")}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  waistUnit === "in" ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
                }`}
              >
                in
              </button>
            </div>
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setHeightUnit("cm")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                heightUnit === "cm" ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              cm
            </button>
            <button
              onClick={() => setHeightUnit("ftin")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                heightUnit === "ftin" ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              ft / in
            </button>
          </div>
          {heightUnit === "cm" ? (
            <input
              type="number"
              min="0"
              placeholder="e.g. 175"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  min="0"
                  placeholder="ft"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
                <p className="text-xs text-stone-400 mt-1">feet</p>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="11"
                  placeholder="in"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
                <p className="text-xs text-stone-400 mt-1">inches</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Waist-to-Height Ratio
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Big result card */}
          <div className={`${results.categoryColor.bg} border ${results.categoryColor.border} rounded-xl p-6 text-center`}>
            <p className="text-sm font-medium text-stone-500 mb-1">Your Waist-to-Height Ratio</p>
            <p className={`text-4xl font-bold ${results.categoryColor.text}`}>
              {results.whtr.toFixed(2)}
            </p>
            <p className={`text-lg font-semibold mt-2 ${results.categoryColor.text}`}>
              {results.category}
            </p>
            <p className="text-sm text-stone-600 mt-3 max-w-md mx-auto">
              {results.description}
            </p>
          </div>

          {/* Visual gauge */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Where you fall on the scale (0.3 &ndash; 0.7)
            </p>
            <div className="relative h-8 rounded-full overflow-hidden flex">
              <div className="bg-blue-300 h-full" style={{ width: "25%" }} />
              <div className="bg-green-400 h-full" style={{ width: "25%" }} />
              <div className="bg-amber-400 h-full" style={{ width: "25%" }} />
              <div className="bg-red-400 h-full" style={{ width: "25%" }} />
            </div>
            <div className="relative h-6">
              <div
                className="absolute -top-1 transform -translate-x-1/2"
                style={{ left: `${getGaugePos(results.whtr)}%` }}
              >
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-stone-800" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-stone-400">
              <span>0.3</span>
              <span>0.4</span>
              <span>0.5</span>
              <span>0.6</span>
              <span>0.7</span>
            </div>
            <div className="flex justify-between text-xs text-stone-500 mt-1">
              <span>Underweight</span>
              <span>Healthy</span>
              <span>Increased</span>
              <span>High Risk</span>
            </div>
          </div>

          {/* Target waist */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-2">Your Target Waist</p>
            <p className="text-sm text-stone-600 mb-3">
              The key message: <strong className="text-stone-800">keep your waist less than half your height</strong>.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-500">Target (cm)</p>
                <p className="text-2xl font-bold text-stone-800">&lt; {results.targetWaistCm}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-500">Target (inches)</p>
                <p className="text-2xl font-bold text-stone-800">&lt; {results.targetWaistIn}</p>
              </div>
            </div>
            {results.waistCm > results.targetWaistCm && (
              <p className="text-sm text-amber-700 mt-3">
                You are currently {(results.waistCm - results.targetWaistCm).toFixed(1)} cm ({((results.waistCm - results.targetWaistCm) / 2.54).toFixed(1)} inches) above your target.
              </p>
            )}
          </div>

          {/* BMI comparison */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              WHtR vs BMI: Why This Measure Matters
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left text-stone-500">
                    <th className="pb-2 pr-3 font-medium">Factor</th>
                    <th className="pb-2 pr-3 font-medium">BMI</th>
                    <th className="pb-2 font-medium">WHtR</th>
                  </tr>
                </thead>
                <tbody className="text-stone-700">
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-3">Measures</td>
                    <td className="py-2 pr-3">Weight relative to height</td>
                    <td className="py-2">Central fat distribution</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-3">Detects belly fat</td>
                    <td className="py-2 pr-3">No</td>
                    <td className="py-2">Yes</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-3">Muscular individuals</td>
                    <td className="py-2 pr-3">Often overestimates risk</td>
                    <td className="py-2">More accurate</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3">&ldquo;Normal&rdquo; weight, high belly fat</td>
                    <td className="py-2 pr-3">Misses the risk</td>
                    <td className="py-2">Flags the risk</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-500">
              Research shows WHtR is a better predictor of cardiometabolic risk than BMI because it accounts for where fat is stored. Visceral fat around the abdomen is more metabolically active and more dangerous than fat stored elsewhere.
            </p>
          </div>

          {/* Waist reduction tips */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">Tips to Reduce Waist Circumference</p>
            <ul className="space-y-2">
              {[
                "Focus on whole, minimally processed foods. Reduce refined carbohydrates, sugary drinks, and ultra-processed snacks.",
                "Prioritise protein at every meal. It helps maintain muscle mass while losing fat and increases satiety.",
                "Add regular cardiovascular exercise, such as brisk walking, cycling, or swimming, for at least 150 minutes per week.",
                "Include resistance training two to three times per week. Building muscle raises your resting metabolic rate.",
                "Manage stress levels. Chronic stress raises cortisol, which promotes visceral fat storage around the abdomen.",
                "Aim for seven to nine hours of quality sleep. Poor sleep disrupts appetite-regulating hormones and encourages fat gain.",
                "Limit alcohol consumption. Alcohol provides empty calories and promotes abdominal fat accumulation.",
                "Be patient and consistent. Spot-reducing belly fat is not possible, but overall fat loss will reduce waist size over time.",
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-600">
                  <span className="text-stone-400 shrink-0">&#8226;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to measure */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">How to Measure Your Waist Correctly</p>
            <div className="text-sm text-stone-600 space-y-2">
              <p>1. Stand upright and breathe out gently. Do not hold your breath or suck in your stomach.</p>
              <p>2. Find the midpoint between the bottom of your lowest rib and the top of your hip bone (iliac crest). For most people, this is roughly at the level of the navel.</p>
              <p>3. Wrap a flexible tape measure around your bare waist at this midpoint, keeping it snug but not compressing the skin.</p>
              <p>4. Make sure the tape is level all the way around and parallel to the floor.</p>
              <p>5. Read the measurement at the end of a normal exhalation.</p>
              <p>6. Take two measurements and use the average for the most accurate result.</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-4 text-xs text-stone-500 font-mono text-center space-y-1">
              <p>--- Tape level at midpoint ---</p>
              <p>&nbsp;&nbsp;&nbsp;Lowest rib</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;</p>
              <p>===== MEASURE HERE =====</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&uarr;</p>
              <p>&nbsp;&nbsp;&nbsp;Hip bone (iliac crest)</p>
            </div>
          </div>
        </div>
      )}

      {/* Why WHtR is useful */}
      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">Why Waist-to-Height Ratio Is Useful</p>
        <p className="mb-2">
          The waist-to-height ratio is a simple, inexpensive screening tool that has been validated across different ages, sexes, and ethnic groups. A 2012 meta-analysis of over 300,000 adults found that WHtR was a better predictor of cardiovascular risk, diabetes, and mortality than BMI.
        </p>
        <p className="mb-2">
          The beauty of this measure is its simplicity: the 0.5 boundary works for adults and children alike. If your waist is less than half your height, your risk is generally low. If it exceeds half your height, the risk rises significantly.
        </p>
        <p>
          Unlike BMI, WHtR captures abdominal fat distribution, which is the most metabolically dangerous type of fat. Visceral fat surrounding your organs releases inflammatory chemicals and hormones that increase your risk of heart disease, insulin resistance, and certain cancers.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">Medical Disclaimer</p>
        <p>
          This tool is for informational purposes only and does not constitute medical advice. The waist-to-height ratio is a screening tool, not a diagnostic test. Always consult a qualified healthcare professional for a comprehensive health assessment.
        </p>
      </div>
    </ToolPageLayout>
  );
}
