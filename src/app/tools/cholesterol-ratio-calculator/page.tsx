"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("cholesterol-ratio-calculator")!;

type Unit = "mgdl" | "mmoll";

interface RatioResult {
  label: string;
  value: number;
  status: "optimal" | "borderline" | "high";
  range: string;
}

interface Results {
  totalHdl: RatioResult;
  ldlHdl: RatioResult;
  trigHdl: RatioResult;
  nonHdl: { value: number; status: "optimal" | "borderline" | "high"; range: string };
  overallRisk: string;
  overallColor: string;
}

function statusColor(status: "optimal" | "borderline" | "high") {
  if (status === "optimal") return { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", badge: "bg-green-100 text-green-800", dot: "bg-green-500" };
  if (status === "borderline") return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500" };
  return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", badge: "bg-red-100 text-red-800", dot: "bg-red-500" };
}

export default function CholesterolRatioCalculatorPage() {
  const [unit, setUnit] = useState<Unit>("mgdl");
  const [total, setTotal] = useState("");
  const [hdl, setHdl] = useState("");
  const [ldl, setLdl] = useState("");
  const [trig, setTrig] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    const totalVal = Number(total);
    const hdlVal = Number(hdl);
    const ldlVal = Number(ldl);
    const trigVal = Number(trig);

    if (!totalVal || !hdlVal || !ldlVal || !trigVal) return;
    if (totalVal <= 0 || hdlVal <= 0 || ldlVal <= 0 || trigVal <= 0) return;

    // Convert to mg/dL if needed
    const cholFactor = unit === "mmoll" ? 38.67 : 1;
    const trigFactor = unit === "mmoll" ? 88.57 : 1;

    const totalMg = totalVal * cholFactor;
    const hdlMg = hdlVal * cholFactor;
    const ldlMg = ldlVal * cholFactor;
    const trigMg = trigVal * trigFactor;

    // Total/HDL ratio
    const totalHdlRatio = totalMg / hdlMg;
    const totalHdlStatus: "optimal" | "borderline" | "high" =
      totalHdlRatio < 3.5 ? "optimal" : totalHdlRatio <= 5.0 ? "borderline" : "high";

    // LDL/HDL ratio
    const ldlHdlRatio = ldlMg / hdlMg;
    const ldlHdlStatus: "optimal" | "borderline" | "high" =
      ldlHdlRatio < 2.0 ? "optimal" : ldlHdlRatio <= 5.0 ? "borderline" : "high";

    // Triglyceride/HDL ratio
    const trigHdlRatio = trigMg / hdlMg;
    const trigHdlStatus: "optimal" | "borderline" | "high" =
      trigHdlRatio < 2.0 ? "optimal" : trigHdlRatio <= 4.0 ? "borderline" : "high";

    // Non-HDL cholesterol
    const nonHdlVal = totalMg - hdlMg;
    const nonHdlStatus: "optimal" | "borderline" | "high" =
      nonHdlVal < 130 ? "optimal" : nonHdlVal < 160 ? "borderline" : "high";

    const statuses = [totalHdlStatus, ldlHdlStatus, trigHdlStatus, nonHdlStatus];
    const highCount = statuses.filter((s) => s === "high").length;
    const optimalCount = statuses.filter((s) => s === "optimal").length;

    let overallRisk = "Moderate Risk";
    let overallColor = "text-amber-700";
    if (optimalCount === 4) {
      overallRisk = "Low Risk - Excellent Profile";
      overallColor = "text-green-700";
    } else if (optimalCount >= 3) {
      overallRisk = "Low Risk - Good Profile";
      overallColor = "text-green-700";
    } else if (highCount >= 3) {
      overallRisk = "High Risk - Consult Your Doctor";
      overallColor = "text-red-700";
    } else if (highCount >= 2) {
      overallRisk = "Elevated Risk - Lifestyle Changes Recommended";
      overallColor = "text-red-600";
    }

    setResults({
      totalHdl: {
        label: "Total / HDL Ratio",
        value: Math.round(totalHdlRatio * 100) / 100,
        status: totalHdlStatus,
        range: "Optimal < 3.5 | Average 3.5 - 5.0 | High > 5.0",
      },
      ldlHdl: {
        label: "LDL / HDL Ratio",
        value: Math.round(ldlHdlRatio * 100) / 100,
        status: ldlHdlStatus,
        range: "Optimal < 2.0 | Moderate 2.0 - 5.0 | High > 5.0",
      },
      trigHdl: {
        label: "Triglyceride / HDL Ratio",
        value: Math.round(trigHdlRatio * 100) / 100,
        status: trigHdlStatus,
        range: "Optimal < 2.0 | Borderline 2.0 - 4.0 | High > 4.0",
      },
      nonHdl: {
        value: Math.round(nonHdlVal),
        status: nonHdlStatus,
        range: "Optimal < 130 | Borderline 130 - 159 | High 160+",
      },
      overallRisk,
      overallColor,
    });
  }

  const ratios = results ? [results.totalHdl, results.ldlHdl, results.trigHdl] : [];

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Unit toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Units</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit("mgdl")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                unit === "mgdl"
                  ? "bg-primary text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              mg/dL
            </button>
            <button
              onClick={() => setUnit("mmoll")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                unit === "mmoll"
                  ? "bg-primary text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              mmol/L
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Total Cholesterol
            </label>
            <input
              type="number"
              min="0"
              placeholder={unit === "mgdl" ? "e.g. 200" : "e.g. 5.2"}
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">{unit === "mgdl" ? "mg/dL" : "mmol/L"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              HDL Cholesterol
            </label>
            <input
              type="number"
              min="0"
              placeholder={unit === "mgdl" ? "e.g. 55" : "e.g. 1.4"}
              value={hdl}
              onChange={(e) => setHdl(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">{unit === "mgdl" ? "mg/dL" : "mmol/L"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              LDL Cholesterol
            </label>
            <input
              type="number"
              min="0"
              placeholder={unit === "mgdl" ? "e.g. 120" : "e.g. 3.1"}
              value={ldl}
              onChange={(e) => setLdl(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">{unit === "mgdl" ? "mg/dL" : "mmol/L"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Triglycerides
            </label>
            <input
              type="number"
              min="0"
              placeholder={unit === "mgdl" ? "e.g. 150" : "e.g. 1.7"}
              value={trig}
              onChange={(e) => setTrig(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">{unit === "mgdl" ? "mg/dL" : "mmol/L"}</p>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Cholesterol Ratios
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Overall risk summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-stone-500 mb-1">Overall Risk Assessment</p>
            <p className={`text-xl font-bold ${results.overallColor}`}>
              {results.overallRisk}
            </p>
          </div>

          {/* Three ratio cards with traffic lights */}
          {ratios.map((ratio, i) => {
            const colors = statusColor(ratio.status);
            return (
              <div
                key={i}
                className={`${colors.bg} border ${colors.border} rounded-xl p-5`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-stone-700">{ratio.label}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.badge}`}>
                    {ratio.status === "optimal" ? "Optimal" : ratio.status === "borderline" ? "Borderline" : "High"}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${colors.text}`}>{ratio.value}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-1">
                    <div className={`w-3 h-3 rounded-full ${ratio.status === "optimal" ? "bg-green-500" : "bg-stone-300"}`} />
                    <div className={`w-3 h-3 rounded-full ${ratio.status === "borderline" ? "bg-amber-500" : "bg-stone-300"}`} />
                    <div className={`w-3 h-3 rounded-full ${ratio.status === "high" ? "bg-red-500" : "bg-stone-300"}`} />
                  </div>
                  <p className="text-xs text-stone-500">{ratio.range}</p>
                </div>
              </div>
            );
          })}

          {/* Non-HDL cholesterol card */}
          {(() => {
            const colors = statusColor(results.nonHdl.status);
            return (
              <div className={`${colors.bg} border ${colors.border} rounded-xl p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-stone-700">Non-HDL Cholesterol</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.badge}`}>
                    {results.nonHdl.status === "optimal" ? "Optimal" : results.nonHdl.status === "borderline" ? "Borderline" : "High"}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${colors.text}`}>
                  {results.nonHdl.value} <span className="text-lg font-normal">mg/dL</span>
                </p>
                <p className="text-xs text-stone-500 mt-2">{results.nonHdl.range}</p>
              </div>
            );
          })()}

          {/* AHA Reference Ranges */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              AHA Desirable Cholesterol Levels
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left text-stone-500">
                    <th className="pb-2 pr-3 font-medium">Measure</th>
                    <th className="pb-2 pr-3 font-medium">Desirable (mg/dL)</th>
                    <th className="pb-2 font-medium">Borderline (mg/dL)</th>
                  </tr>
                </thead>
                <tbody className="text-stone-700">
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-3">Total Cholesterol</td>
                    <td className="py-2 pr-3">&lt; 200</td>
                    <td className="py-2">200 - 239</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-3">LDL (&ldquo;Bad&rdquo;)</td>
                    <td className="py-2 pr-3">&lt; 100</td>
                    <td className="py-2">100 - 159</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-3">HDL (&ldquo;Good&rdquo;)</td>
                    <td className="py-2 pr-3">&ge; 60</td>
                    <td className="py-2">40 - 59</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-3">Triglycerides</td>
                    <td className="py-2 pr-3">&lt; 150</td>
                    <td className="py-2">150 - 199</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3">Non-HDL</td>
                    <td className="py-2 pr-3">&lt; 130</td>
                    <td className="py-2">130 - 159</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-400 mt-3">
              Source: American Heart Association. Individual targets may differ based on personal cardiovascular risk factors.
            </p>
          </div>

          {/* Lifestyle improvement recommendations */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Lifestyle Recommendations to Improve Your Ratios
            </p>
            <ul className="space-y-2">
              {[
                "Eat more soluble fibre from oats, beans, lentils, and fruits to help lower LDL cholesterol.",
                "Replace saturated fats with unsaturated fats from olive oil, nuts, avocados, and fatty fish.",
                "Exercise for at least 150 minutes per week at moderate intensity to raise HDL and lower triglycerides.",
                "Reduce refined carbohydrates and added sugars, which are major drivers of high triglycerides.",
                "Maintain a healthy weight. Losing even 5 to 10 percent of body weight can improve all cholesterol markers.",
                "If you smoke, quitting can raise HDL cholesterol by up to 10 percent.",
                "Limit alcohol intake. Excess alcohol raises triglycerides significantly.",
                "Consider plant sterols and stanols (found in fortified foods) which can lower LDL by up to 10 percent.",
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-600">
                  <span className="text-stone-400 shrink-0">&#8226;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* What do these numbers mean */}
      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          What do these numbers mean?
        </p>
        <p className="mb-2">
          Cholesterol ratios provide a more complete picture of cardiovascular risk than any single cholesterol number alone. They reflect the balance between harmful and protective lipoproteins circulating in your blood.
        </p>
        <p className="mb-2">
          <strong className="text-stone-700">Total/HDL ratio</strong> is widely used as a quick risk indicator. It shows how much of your total cholesterol is made up of protective HDL. A lower number is better because it means a larger proportion of your cholesterol is the heart-protective type.
        </p>
        <p className="mb-2">
          <strong className="text-stone-700">LDL/HDL ratio</strong> directly compares the &ldquo;bad&rdquo; cholesterol that contributes to plaque buildup with the &ldquo;good&rdquo; cholesterol that helps remove it. This ratio is especially useful for assessing your risk of developing atherosclerosis.
        </p>
        <p className="mb-2">
          <strong className="text-stone-700">Triglyceride/HDL ratio</strong> is considered one of the strongest predictors of insulin resistance and metabolic syndrome. A high ratio often signals that the body is struggling to process fats and sugars efficiently, even when other numbers look acceptable.
        </p>
        <p>
          <strong className="text-stone-700">Non-HDL cholesterol</strong> captures all the potentially harmful cholesterol particles in one number (Total minus HDL). Many cardiologists now consider it a better predictor of heart disease than LDL alone because it includes VLDL and other atherogenic particles.
        </p>
      </div>

      {/* Health disclaimer */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">Medical Disclaimer</p>
        <p>
          This tool is for informational purposes only and does not constitute medical advice. Cholesterol management should be guided by a qualified healthcare professional who can consider your complete medical history, risk factors, and lab results.
        </p>
      </div>
    </ToolPageLayout>
  );
}
