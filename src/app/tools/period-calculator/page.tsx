"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("period-calculator")!;

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

interface CycleData {
  periodStart: Date;
  periodEnd: Date;
  ovulation: Date;
  fertileStart: Date;
  fertileEnd: Date;
}

interface Results {
  currentCycleDay: number;
  nextPeriod: Date;
  cycles: CycleData[];
}

function calculateCycles(
  lastPeriodStart: Date,
  cycleLength: number,
  periodDuration: number,
  count: number
): CycleData[] {
  const cycles: CycleData[] = [];
  for (let i = 0; i < count; i++) {
    const periodStart = addDays(lastPeriodStart, cycleLength * i);
    const periodEnd = addDays(periodStart, periodDuration - 1);
    const nextCycleStart = addDays(periodStart, cycleLength);
    const ovulation = addDays(nextCycleStart, -14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    cycles.push({ periodStart, periodEnd, ovulation, fertileStart, fertileEnd });
  }
  return cycles;
}

export default function PeriodCalculatorPage() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodDuration, setPeriodDuration] = useState("5");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    if (!lastPeriod) return;

    const lastPeriodDate = new Date(lastPeriod + "T00:00:00");
    const cycle = Number(cycleLength);
    const duration = Number(periodDuration);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentCycleDay = daysBetween(lastPeriodDate, today) + 1;
    const nextPeriod = addDays(lastPeriodDate, cycle);

    // Generate 6 cycles starting from the next period
    const cycles = calculateCycles(nextPeriod, cycle, duration, 6);

    setResults({ currentCycleDay, nextPeriod, cycles });
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

        <div>
          <label className="block text-sm font-medium mb-1">
            Average period duration (days)
          </label>
          <input
            type="number"
            min="2"
            max="8"
            value={periodDuration}
            onChange={(e) => setPeriodDuration(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-stone-400 mt-1">
            Typical range: 2&ndash;8 days (average is 5)
          </p>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Period Dates
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Current cycle day */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
            <p className="text-sm text-purple-600 font-medium mb-1">
              Current Cycle Day
            </p>
            <p className="text-3xl font-bold text-purple-900">
              Day {results.currentCycleDay}
            </p>
            <p className="text-xs text-purple-500 mt-1">
              of your {cycleLength}-day cycle
            </p>
          </div>

          {/* Next period */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 text-center">
            <p className="text-sm text-pink-600 font-medium mb-1">
              Next Expected Period
            </p>
            <p className="text-2xl font-bold text-pink-900">
              {formatDate(results.nextPeriod)}
            </p>
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const daysUntil = daysBetween(today, results.nextPeriod);
              return (
                <p className="text-sm text-pink-600 mt-1">
                  {daysUntil > 0
                    ? `${daysUntil} day${daysUntil !== 1 ? "s" : ""} from today`
                    : daysUntil === 0
                    ? "Today"
                    : `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""} ago`}
                </p>
              );
            })()}
          </div>

          {/* Current cycle fertile window & ovulation */}
          {(() => {
            const lastPeriodDate = new Date(lastPeriod + "T00:00:00");
            const cycle = Number(cycleLength);
            const nextCycleStart = addDays(lastPeriodDate, cycle);
            const ovulation = addDays(nextCycleStart, -14);
            const fertileStart = addDays(ovulation, -5);
            const fertileEnd = addDays(ovulation, 1);
            return (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <p className="text-sm text-green-600 font-medium mb-1">
                    Ovulation Estimate
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    {formatShortDate(ovulation)}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <p className="text-sm text-green-600 font-medium mb-1">
                    Fertile Window
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    {formatShortDate(fertileStart)}
                  </p>
                  <p className="text-xs text-green-600">
                    to {formatShortDate(fertileEnd)}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* 6-month forecast table */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              6-Month Forecast
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left text-stone-500">
                    <th className="pb-2 pr-3 font-medium">Period Start</th>
                    <th className="pb-2 pr-3 font-medium">Period End</th>
                    <th className="pb-2 pr-3 font-medium">Ovulation</th>
                    <th className="pb-2 pr-3 font-medium">Fertile Start</th>
                    <th className="pb-2 font-medium">Fertile End</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cycles.map((c, i) => (
                    <tr
                      key={i}
                      className={`border-b border-stone-100 ${
                        i % 2 === 0 ? "bg-stone-50" : ""
                      }`}
                    >
                      <td className="py-2 pr-3 font-medium text-stone-700">
                        {formatShortDate(c.periodStart)}
                      </td>
                      <td className="py-2 pr-3 text-stone-600">
                        {formatShortDate(c.periodEnd)}
                      </td>
                      <td className="py-2 pr-3 text-green-700">
                        {formatShortDate(c.ovulation)}
                      </td>
                      <td className="py-2 pr-3 text-green-600">
                        {formatShortDate(c.fertileStart)}
                      </td>
                      <td className="py-2 text-green-600">
                        {formatShortDate(c.fertileEnd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Health disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Note</p>
            <p>
              This calculator provides estimates based on averages. Actual cycle
              timing can vary due to stress, illness, hormonal changes, and other
              factors. It should not be used as a form of birth control. Consult
              your healthcare provider for personalized guidance.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          How period calculation works
        </p>
        <p className="mb-2">
          Your menstrual cycle is counted from the first day of one period to the
          first day of the next. The average cycle is 28 days, but cycles
          anywhere from 21 to 45 days are considered normal.
        </p>
        <p className="mb-2">
          <strong className="text-stone-600">Next period:</strong> Calculated by
          adding your average cycle length to the first day of your last period.
        </p>
        <p className="mb-2">
          <strong className="text-stone-600">Ovulation:</strong> Estimated to
          occur 14 days before your next period starts. This is based on the
          luteal phase, which is relatively consistent at about 14 days for most
          women.
        </p>
        <p>
          <strong className="text-stone-600">Fertile window:</strong> Spans from
          5 days before ovulation to 1 day after. Sperm can survive in the
          reproductive tract for up to 5 days, so the fertile window begins
          before ovulation occurs.
        </p>
      </div>
    </ToolPageLayout>
  );
}
