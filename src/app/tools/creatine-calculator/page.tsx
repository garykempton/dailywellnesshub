"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("creatine-calculator")!;

const COST_PER_GRAM = 0.05;

function roundHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

interface Result {
  weightKg: number;
  protocol: "loading" | "maintenance";
  loadingDose: number;
  loadingPerServing: number;
  maintenanceDose: number;
  loadingCost: number;
  monthlyCost: number;
}

export default function CreatineCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [protocol, setProtocol] = useState<"loading" | "maintenance">("loading");
  const [training, setTraining] = useState("intermediate");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const raw = parseFloat(weight);
    if (!raw || raw <= 0) return;

    const weightKg = unit === "lbs" ? raw * 0.453592 : raw;

    // Loading: 0.3 g/kg
    const loadingDose = roundHalf(weightKg * 0.3);
    const loadingPerServing = roundHalf(loadingDose / 4);

    // Maintenance: 0.03-0.04 g/kg depending on training
    const maintRate = training === "advanced" ? 0.04 : training === "intermediate" ? 0.035 : 0.03;
    const maintenanceDose = clamp(roundHalf(weightKg * maintRate), 3, 10);

    // Costs
    const loadingCost = loadingDose * 7 * COST_PER_GRAM;
    const monthlyCost = maintenanceDose * 30 * COST_PER_GRAM;

    setResult({
      weightKg,
      protocol,
      loadingDose,
      loadingPerServing,
      maintenanceDose,
      loadingCost,
      monthlyCost,
    });
  }

  const selectClass = "w-full border border-stone-300 rounded-lg px-3 py-2 bg-white";

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Weight input with unit toggle */}
        <div>
          <label className="block text-sm font-medium mb-1">Body Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "kg" ? "75" : "165"}
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
            />
            <div className="flex rounded-lg border border-stone-300 overflow-hidden">
              {(["kg", "lbs"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    unit === u
                      ? "bg-primary text-white"
                      : "bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Protocol */}
        <div>
          <label className="block text-sm font-medium mb-2">Protocol</label>
          <div className="space-y-2">
            {[
              { value: "loading" as const, label: "Loading + Maintenance", desc: "Faster saturation (5-7 days), then daily dose" },
              { value: "maintenance" as const, label: "Maintenance Only", desc: "Lower daily dose, full saturation in 3-4 weeks" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  protocol === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="protocol"
                  value={opt.value}
                  checked={protocol === opt.value}
                  onChange={() => setProtocol(opt.value)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-stone-500">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Training status */}
        <div>
          <label className="block text-sm font-medium mb-1">Training Status</label>
          <select className={selectClass} value={training} onChange={(e) => setTraining(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Dosage
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-6">
          {/* Loading phase card */}
          {result.protocol === "loading" && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <h2 className="text-lg font-semibold">Loading Phase</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-stone-500">Daily Dose</p>
                  <p className="text-3xl font-bold">{result.loadingDose}g</p>
                  <p className="text-xs text-stone-400">per day</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-stone-500">Per Serving</p>
                  <p className="text-3xl font-bold">{result.loadingPerServing}g</p>
                  <p className="text-xs text-stone-400">4 times daily</p>
                </div>
              </div>
              <div className="text-sm text-stone-600 space-y-1">
                <p><span className="font-medium">Duration:</span> 5-7 days</p>
                <p><span className="font-medium">Timing:</span> Split into 4 equal doses, taken with meals and spread throughout the day</p>
                <p><span className="font-medium">Cost:</span> ~${result.loadingCost.toFixed(2)} for the loading phase</p>
              </div>
            </div>
          )}

          {/* Maintenance phase card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <h2 className="text-lg font-semibold">Maintenance Phase</h2>
            </div>
            <div className="bg-stone-50 rounded-lg p-4 text-center">
              <p className="text-sm text-stone-500">Daily Dose</p>
              <p className="text-5xl font-bold">{result.maintenanceDose}g</p>
              <p className="text-xs text-stone-400">per day, every day</p>
            </div>
            <div className="text-sm text-stone-600 space-y-1">
              <p><span className="font-medium">Timing:</span> Post-workout on training days, or with any meal on rest days</p>
              <p><span className="font-medium">Monthly cost:</span> ~${result.monthlyCost.toFixed(2)}/month (creatine monohydrate)</p>
              <p><span className="font-medium">Duration:</span> Ongoing -- creatine is taken continuously</p>
            </div>
          </div>

          {/* Expected effects timeline */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Expected Effects Timeline</h2>
            <div className="space-y-4">
              {[
                {
                  period: result.protocol === "loading" ? "Week 1 (Loading)" : "Weeks 1-3",
                  description: result.protocol === "loading"
                    ? "Muscle creatine stores saturate. Expect 1-3 kg of water weight gain as muscles draw in more water."
                    : "Creatine stores gradually increasing. Slight water weight gain (0.5-1.5 kg) may occur.",
                  color: "bg-amber-400",
                },
                {
                  period: result.protocol === "loading" ? "Weeks 2-4" : "Weeks 3-5",
                  description: "Strength gains becoming noticeable. You may be able to push 1-2 extra reps on heavy sets.",
                  color: "bg-blue-400",
                },
                {
                  period: result.protocol === "loading" ? "Weeks 4-8" : "Weeks 6-10",
                  description: "Measurable performance improvement. Greater training volume and faster recovery between sets.",
                  color: "bg-green-400",
                },
                {
                  period: "Ongoing",
                  description: "Benefits maintained with consistent daily dosing. No need to cycle on and off.",
                  color: "bg-green-500",
                },
              ].map((phase, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                    {i < 3 && <div className="w-px h-full min-h-[24px] bg-stone-200 mt-1" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{phase.period}</p>
                    <p className="text-sm text-stone-500">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 text-sm mb-1">Hydration Reminder</h3>
            <p className="text-sm text-blue-700">
              Creatine pulls water into your muscles, so drink an additional 500 ml (about 2 extra
              glasses) of water per day while supplementing. Staying well hydrated supports
              performance and reduces the chance of cramping.
            </p>
          </div>

          {/* Safety notes */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
            <p className="font-semibold text-stone-700 mb-2">Safety Notes</p>
            <ul className="space-y-1.5">
              <li>Creatine monohydrate is the most researched and cost-effective form. Other forms (HCL, buffered, etc.) have no proven advantage.</li>
              <li>Creatine is one of the safest and most well-studied supplements, with decades of research supporting its use in healthy adults.</li>
              <li>Consult a healthcare professional before supplementing if you have kidney disease or other pre-existing conditions.</li>
              <li>Mild digestive discomfort during the loading phase is normal. Splitting doses and taking with food usually resolves this.</li>
              <li>This calculator is for informational purposes only and is not medical advice.</li>
            </ul>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
