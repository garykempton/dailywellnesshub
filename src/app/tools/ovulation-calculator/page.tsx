"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("ovulation-calculator")!;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

interface CycleForecast {
  cycleStart: Date;
  ovulation: Date;
  fertileStart: Date;
  fertileEnd: Date;
}

type FertilityLevel = "not-fertile" | "approaching" | "fertile" | "peak";

function getFertilityLevel(
  today: Date,
  ovulation: Date,
  fertileStart: Date,
  fertileEnd: Date
): { level: FertilityLevel; label: string; color: string; bgColor: string; borderColor: string } {
  const t = today.getTime();
  const ovDay = ovulation.getTime();
  const fStart = fertileStart.getTime();
  const fEnd = fertileEnd.getTime();

  if (t === ovDay) {
    return {
      level: "peak",
      label: "Peak Fertility",
      color: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    };
  }
  if (t >= fStart && t <= fEnd) {
    return {
      level: "fertile",
      label: "Fertile",
      color: "text-pink-700",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    };
  }
  // Approaching: 3 days before fertile window
  const approachStart = addDays(fertileStart, -3).getTime();
  if (t >= approachStart && t < fStart) {
    return {
      level: "approaching",
      label: "Approaching Fertile Window",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    };
  }
  return {
    level: "not-fertile",
    label: "Not Fertile",
    color: "text-stone-600",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-200",
  };
}

interface Results {
  ovulation: Date;
  fertileStart: Date;
  fertileEnd: Date;
  daysUntilOvulation: number;
  fertility: ReturnType<typeof getFertilityLevel>;
  follicularPhase: number;
  lutealPhase: number;
  forecast: CycleForecast[];
}

export default function OvulationCalculatorPage() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    if (!lastPeriod) return;

    const lastPeriodDate = new Date(lastPeriod + "T00:00:00");
    const cycle = Number(cycleLength);
    const lutealPhase = 14;
    const follicularPhase = cycle - lutealPhase;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the current or next ovulation relative to today
    let cycleStart = new Date(lastPeriodDate);
    while (addDays(cycleStart, cycle).getTime() <= today.getTime()) {
      cycleStart = addDays(cycleStart, cycle);
    }

    const ovulation = addDays(cycleStart, cycle - lutealPhase);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    const daysUntilOvulation = daysBetween(today, ovulation);
    const fertility = getFertilityLevel(today, ovulation, fertileStart, fertileEnd);

    // Generate 6-month forecast
    const forecast: CycleForecast[] = [];
    let fStart = new Date(cycleStart);
    for (let i = 0; i < 6; i++) {
      const ov = addDays(fStart, cycle - lutealPhase);
      const fs = addDays(ov, -5);
      const fe = addDays(ov, 1);
      forecast.push({
        cycleStart: new Date(fStart),
        ovulation: ov,
        fertileStart: fs,
        fertileEnd: fe,
      });
      fStart = addDays(fStart, cycle);
    }

    setResults({
      ovulation,
      fertileStart,
      fertileEnd,
      daysUntilOvulation,
      fertility,
      follicularPhase,
      lutealPhase,
      forecast,
    });
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            First day of your last period
          </label>
          <input
            type="date"
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Average cycle length (days)
          </label>
          <input
            type="number"
            min="21"
            max="45"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-stone-400 mt-1">
            Typical range: 21&ndash;45 days (average is 28)
          </p>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Ovulation
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Ovulation date */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-center">
            <p className="text-sm text-rose-600 font-medium mb-1">
              Estimated Ovulation Date
            </p>
            <p className="text-2xl font-bold text-rose-900">
              {formatDate(results.ovulation)}
            </p>
            <p className="text-sm text-rose-600 mt-1">
              {results.daysUntilOvulation > 0
                ? `${results.daysUntilOvulation} day${results.daysUntilOvulation !== 1 ? "s" : ""} from today`
                : results.daysUntilOvulation === 0
                ? "Today"
                : `${Math.abs(results.daysUntilOvulation)} day${Math.abs(results.daysUntilOvulation) !== 1 ? "s" : ""} ago`}
            </p>
          </div>

          {/* Fertile window and fertility level */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 text-center">
              <p className="text-sm text-pink-600 font-medium mb-1">
                Fertile Window
              </p>
              <p className="text-lg font-bold text-pink-900">
                {formatShortDate(results.fertileStart)}
              </p>
              <p className="text-xs text-pink-600">
                to {formatShortDate(results.fertileEnd)}
              </p>
              <p className="text-xs text-pink-500 mt-1">6 days total</p>
            </div>
            <div
              className={`${results.fertility.bgColor} border ${results.fertility.borderColor} rounded-xl p-5 text-center`}
            >
              <p className={`text-sm font-medium mb-1 ${results.fertility.color}`}>
                Today&apos;s Fertility Level
              </p>
              <p className={`text-lg font-bold ${results.fertility.color}`}>
                {results.fertility.label}
              </p>
            </div>
          </div>

          {/* Cycle phase diagram */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Cycle Phases
            </p>
            <div className="flex rounded-lg overflow-hidden h-10">
              <div
                className="bg-red-300 flex items-center justify-center text-xs font-medium text-red-900"
                style={{ width: `${(5 / Number(cycleLength)) * 100}%` }}
                title="Menstruation"
              >
                Period
              </div>
              <div
                className="bg-amber-200 flex items-center justify-center text-xs font-medium text-amber-900"
                style={{
                  width: `${((results.follicularPhase - 5) / Number(cycleLength)) * 100}%`,
                }}
                title="Follicular Phase"
              >
                Follicular
              </div>
              <div
                className="bg-rose-400 flex items-center justify-center text-xs font-medium text-white"
                style={{ width: `${(1 / Number(cycleLength)) * 100}%`, minWidth: "2rem" }}
                title="Ovulation"
              >
                Ov
              </div>
              <div
                className="bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-900"
                style={{
                  width: `${((results.lutealPhase - 1) / Number(cycleLength)) * 100}%`,
                }}
                title="Luteal Phase"
              >
                Luteal
              </div>
            </div>
            <div className="flex justify-between text-xs text-stone-400 mt-2">
              <span>Day 1</span>
              <span>Day {results.follicularPhase}</span>
              <span>Day {results.follicularPhase + 1}</span>
              <span>Day {Number(cycleLength)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-300" />
                <span className="text-stone-600">Menstruation (~5 days)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-200" />
                <span className="text-stone-600">
                  Follicular ({results.follicularPhase - 5} days)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-rose-400" />
                <span className="text-stone-600">Ovulation (1 day)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-200" />
                <span className="text-stone-600">
                  Luteal ({results.lutealPhase} days)
                </span>
              </div>
            </div>
          </div>

          {/* 6-month forecast */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              6-Month Forecast
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left text-stone-500">
                    <th className="pb-2 pr-3 font-medium">Cycle Start</th>
                    <th className="pb-2 pr-3 font-medium">Ovulation</th>
                    <th className="pb-2 pr-3 font-medium">Fertile Start</th>
                    <th className="pb-2 font-medium">Fertile End</th>
                  </tr>
                </thead>
                <tbody>
                  {results.forecast.map((c, i) => (
                    <tr
                      key={i}
                      className={`border-b border-stone-100 ${
                        i % 2 === 0 ? "bg-stone-50" : ""
                      }`}
                    >
                      <td className="py-2 pr-3 text-stone-700">
                        {formatShortDate(c.cycleStart)}
                      </td>
                      <td className="py-2 pr-3 font-medium text-rose-700">
                        {formatShortDate(c.ovulation)}
                      </td>
                      <td className="py-2 pr-3 text-pink-600">
                        {formatShortDate(c.fertileStart)}
                      </td>
                      <td className="py-2 text-pink-600">
                        {formatShortDate(c.fertileEnd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Note</p>
            <p>
              Ovulation timing can vary from cycle to cycle, even if your periods
              are regular. This tool provides estimates based on averages and
              should not be relied upon as a sole method for achieving or
              avoiding pregnancy. Consult your healthcare provider for
              personalized fertility guidance.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          How ovulation calculation works
        </p>
        <p className="mb-2">
          Ovulation typically occurs about 14 days before the start of your next
          period. This is because the luteal phase (the time between ovulation
          and your period) is relatively constant at around 14 days for most
          women, even when cycle length varies.
        </p>
        <p className="mb-2">
          <strong className="text-stone-600">Ovulation date:</strong> Estimated
          by subtracting 14 days from your expected next period start date (or
          equivalently, adding your cycle length minus 14 to your last period
          start date).
        </p>
        <p className="mb-2">
          <strong className="text-stone-600">Fertile window:</strong> Spans 5
          days before ovulation through 1 day after (6 days total). Sperm can
          survive in the female reproductive tract for up to 5 days, so
          conception is possible from intercourse that occurs several days before
          ovulation.
        </p>
        <p>
          <strong className="text-stone-600">Cycle phases:</strong> Your cycle
          consists of the menstrual phase (your period), the follicular phase
          (when an egg matures), ovulation (egg release), and the luteal phase
          (when the uterine lining prepares for possible implantation). The
          follicular phase length varies with cycle length; the luteal phase is
          typically fixed at about 14 days.
        </p>
      </div>
    </ToolPageLayout>
  );
}
