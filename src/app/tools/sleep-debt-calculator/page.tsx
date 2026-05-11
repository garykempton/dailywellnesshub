"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("sleep-debt-calculator")!;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Results {
  totalDebt: number;
  avgSleep: number;
  avgDeficit: number;
  perNight: { day: string; actual: number; target: number; deficit: number }[];
  recoveryOneWeek: number;
  recoveryTwoWeeks: number;
  missedNights: string;
}

function compute(target: number, actuals: number[]): Results {
  const perNight = actuals.map((actual, i) => ({
    day: DAYS[i],
    actual,
    target,
    deficit: Math.max(0, target - actual),
  }));

  const totalDebt = perNight.reduce((sum, n) => sum + n.deficit, 0);
  const avgSleep = actuals.reduce((a, b) => a + b, 0) / 7;
  const avgDeficit = totalDebt / 7;
  const recoveryOneWeek = (totalDebt / 7) * 60;
  const recoveryTwoWeeks = (totalDebt / 14) * 60;
  const missedNights = (totalDebt / target).toFixed(1);

  return { totalDebt, avgSleep, avgDeficit, perNight, recoveryOneWeek, recoveryTwoWeeks, missedNights };
}

export default function SleepDebtCalculatorPage() {
  const [target, setTarget] = useState(8);
  const [actuals, setActuals] = useState<string[]>(Array(7).fill(""));
  const [quickFill, setQuickFill] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  function handleQuickFill() {
    const val = parseFloat(quickFill);
    if (!isNaN(val) && val >= 0 && val <= 24) {
      setActuals(Array(7).fill(String(val)));
    }
  }

  function handleCalculate() {
    const parsed = actuals.map((v) => {
      const n = parseFloat(v);
      return isNaN(n) ? 0 : Math.max(0, Math.min(24, n));
    });
    if (parsed.every((v) => v === 0) && actuals.every((v) => v === "")) return;
    setResults(compute(target, parsed));
  }

  function handleReset() {
    setActuals(Array(7).fill(""));
    setQuickFill("");
    setResults(null);
  }

  function debtColor(debt: number) {
    if (debt >= 10) return "bg-red-50 border-red-300 text-red-800";
    if (debt >= 5) return "bg-amber-50 border-amber-300 text-amber-800";
    return "bg-green-50 border-green-300 text-green-800";
  }

  function debtLabel(debt: number) {
    if (debt >= 14) return "Severe";
    if (debt >= 10) return "High";
    if (debt >= 5) return "Moderate";
    return "Low";
  }

  const maxBarHours = Math.max(target, ...actuals.map((v) => parseFloat(v) || 0), 10);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Target */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Sleep Target</h2>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              Hours per night (recommended)
            </label>
            <input
              type="number"
              min={6}
              max={10}
              step={0.5}
              value={target}
              onChange={(e) => setTarget(parseFloat(e.target.value) || 8)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Actual sleep inputs */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Actual Sleep (Past 7 Nights)</h2>

          {/* Quick-fill */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-stone-600 mb-1">Quick-fill all nights</label>
              <input
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={quickFill}
                onChange={(e) => setQuickFill(e.target.value)}
                placeholder="e.g. 6.5"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
            <button
              onClick={handleQuickFill}
              className="bg-stone-200 text-stone-700 py-2 px-4 rounded-lg font-medium hover:bg-stone-300 transition-colors"
            >
              Fill All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DAYS.map((day, i) => (
              <div key={day}>
                <label className="block text-sm font-medium text-stone-600 mb-1">{day}</label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={actuals[i]}
                  onChange={(e) => {
                    const next = [...actuals];
                    next[i] = e.target.value;
                    setActuals(next);
                  }}
                  placeholder="hrs"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Calculate Sleep Debt
          </button>
          <button
            onClick={handleReset}
            className="bg-stone-200 text-stone-700 py-3 px-6 rounded-lg font-medium hover:bg-stone-300 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Total debt card */}
            <div className={`border rounded-xl p-6 text-center ${debtColor(results.totalDebt)}`}>
              <p className="text-sm font-medium uppercase tracking-wide mb-1">Total Sleep Debt</p>
              <p className="text-5xl font-bold">{results.totalDebt.toFixed(1)}h</p>
              <p className="text-sm mt-2">{debtLabel(results.totalDebt)} sleep debt</p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
                <p className="text-sm text-stone-500">Avg Nightly Sleep</p>
                <p className="text-2xl font-bold text-stone-800">{results.avgSleep.toFixed(1)}h</p>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
                <p className="text-sm text-stone-500">Avg Nightly Deficit</p>
                <p className="text-2xl font-bold text-stone-800">{results.avgDeficit.toFixed(1)}h</p>
              </div>
            </div>

            {/* Per-night breakdown */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Nightly Breakdown</h3>
              <div className="space-y-3">
                {results.perNight.map((night) => {
                  const actualPct = (night.actual / maxBarHours) * 100;
                  const targetPct = (night.target / maxBarHours) * 100;
                  const metTarget = night.actual >= night.target;
                  return (
                    <div key={night.day} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium text-stone-600">{night.day}</span>
                      <div className="flex-1 relative h-6 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${metTarget ? "bg-green-400" : "bg-red-400"}`}
                          style={{ width: `${Math.min(100, actualPct)}%` }}
                        />
                        <div
                          className="absolute inset-y-0 border-r-2 border-dashed border-stone-500"
                          style={{ left: `${Math.min(100, targetPct)}%` }}
                          title={`Target: ${night.target}h`}
                        />
                      </div>
                      <span className="w-14 text-sm text-right text-stone-600">
                        {night.actual.toFixed(1)}h
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-stone-400">Dashed line = your {target}h target</p>
            </div>

            {/* Recovery plan */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Recovery Plan</h3>
              {results.totalDebt > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">1w</span>
                    <p className="text-stone-700">
                      To recover in <strong>1 week</strong>, sleep an extra{" "}
                      <strong>{Math.ceil(results.recoveryOneWeek)} minutes</strong> per night.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">2w</span>
                    <p className="text-stone-700">
                      To recover in <strong>2 weeks</strong>, sleep an extra{" "}
                      <strong>{Math.ceil(results.recoveryTwoWeeks)} minutes</strong> per night.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-green-700">No sleep debt to recover. Well done!</p>
              )}
            </div>

            {/* Context */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2">
              <h3 className="text-lg font-semibold text-stone-800">Context</h3>
              <p className="text-stone-700">
                Your sleep debt is equivalent to missing{" "}
                <strong>{results.missedNights} full nights</strong> of sleep.
              </p>
            </div>

            {/* Severe health warning */}
            {results.totalDebt > 14 && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-semibold text-red-800">Health Impact Warning</h3>
                <p className="text-red-700">
                  Your sleep debt exceeds 14 hours, which is equivalent to missing nearly two full
                  nights of sleep. Chronic sleep deprivation at this level is associated with
                  impaired cognitive function, weakened immune response, increased risk of
                  cardiovascular disease, and hormonal imbalances. Prioritise improving your sleep
                  habits and consider consulting a healthcare professional.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
