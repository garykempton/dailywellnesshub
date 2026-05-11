"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("pregnancy-due-date-calculator")!;

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

function getTrimester(weeks: number): { label: string; number: number } {
  if (weeks < 13) return { label: "1st Trimester", number: 1 };
  if (weeks < 28) return { label: "2nd Trimester", number: 2 };
  return { label: "3rd Trimester", number: 3 };
}

interface Results {
  dueDate: Date;
  gestationalWeeks: number;
  gestationalDays: number;
  trimester: { label: string; number: number };
  totalDaysPregnant: number;
  milestones: { label: string; date: Date; weeks: number }[];
}

export default function PregnancyDueDateCalculatorPage() {
  const [method, setMethod] = useState<"lmp" | "conception">("lmp");
  const [dateInput, setDateInput] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [results, setResults] = useState<Results | null>(null);

  function calculate() {
    if (!dateInput) return;

    const inputDate = new Date(dateInput + "T00:00:00");
    let dueDate: Date;
    let lmpDate: Date;

    if (method === "lmp") {
      const cycleAdj = Number(cycleLength) - 28;
      dueDate = addDays(inputDate, 280 + cycleAdj);
      lmpDate = inputDate;
    } else {
      dueDate = addDays(inputDate, 266);
      // LMP equivalent is conception - 14 days
      lmpDate = addDays(inputDate, -14);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDaysPregnant = daysBetween(lmpDate, today);
    const gestationalWeeks = Math.floor(totalDaysPregnant / 7);
    const gestationalDays = totalDaysPregnant % 7;
    const trimester = getTrimester(gestationalWeeks);

    const milestones = [
      { label: "End of 1st Trimester", date: addDays(lmpDate, 12 * 7), weeks: 12 },
      { label: "Start of 2nd Trimester", date: addDays(lmpDate, 13 * 7), weeks: 13 },
      { label: "Start of 3rd Trimester", date: addDays(lmpDate, 28 * 7), weeks: 28 },
      { label: "Full Term", date: addDays(lmpDate, 37 * 7), weeks: 37 },
      { label: "Due Date", date: dueDate, weeks: 40 },
    ];

    setResults({
      dueDate,
      gestationalWeeks,
      gestationalDays,
      trimester,
      totalDaysPregnant,
      milestones,
    });
  }

  const isPastDate = results && results.totalDaysPregnant > 0;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex gap-2">
          {(["lmp", "conception"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMethod(m);
                setResults(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                method === m
                  ? "bg-primary text-white border-primary"
                  : "border-stone-300 hover:border-stone-500"
              }`}
            >
              {m === "lmp" ? "Last Menstrual Period" : "Conception Date"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {method === "lmp"
              ? "First day of last menstrual period"
              : "Estimated conception date"}
          </label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {method === "lmp" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Average cycle length (days)
            </label>
            <input
              type="number"
              min="20"
              max="45"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            {Number(cycleLength) !== 28 && (
              <p className="text-xs text-stone-400 mt-1">
                Due date adjusted by {Number(cycleLength) - 28} day
                {Math.abs(Number(cycleLength) - 28) !== 1 ? "s" : ""} for your
                cycle length.
              </p>
            )}
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate Due Date
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Due date */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 text-center">
            <p className="text-sm text-pink-600 font-medium mb-1">
              Estimated Due Date
            </p>
            <p className="text-2xl font-bold text-pink-900">
              {formatDate(results.dueDate)}
            </p>
          </div>

          {/* Gestational age and trimester */}
          {isPastDate && results.gestationalWeeks >= 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 text-center">
                <p className="text-sm text-pink-600 mb-1">Gestational Age</p>
                <p className="text-2xl font-bold text-pink-900">
                  {results.gestationalWeeks}w {results.gestationalDays}d
                </p>
              </div>
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 text-center">
                <p className="text-sm text-pink-600 mb-1">Trimester</p>
                <p className="text-2xl font-bold text-pink-900">
                  {results.trimester.label}
                </p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {isPastDate && results.gestationalWeeks >= 0 && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-pink-700">
                  Progress
                </span>
                <span className="text-sm text-pink-600">
                  {Math.min(results.gestationalWeeks, 40)} of 40 weeks
                </span>
              </div>
              <div className="w-full bg-pink-100 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-pink-500 transition-all"
                  style={{
                    width: `${Math.min(
                      (results.totalDaysPregnant / 280) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-pink-400 mt-1">
                <span>Week 0</span>
                <span>Week 12</span>
                <span>Week 28</span>
                <span>Week 40</span>
              </div>
            </div>
          )}

          {/* Key milestones */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Key milestone dates
            </p>
            <div className="space-y-3">
              {results.milestones.map((m, i) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = m.date.getTime() < today.getTime();
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isPast ? "bg-green-500" : "bg-stone-300"
                        }`}
                      />
                      <span
                        className={
                          isPast ? "text-stone-400" : "text-stone-700"
                        }
                      >
                        {m.label}{" "}
                        <span className="text-stone-400">
                          (week {m.weeks})
                        </span>
                      </span>
                    </div>
                    <span
                      className={`font-medium ${
                        isPast ? "text-stone-400" : "text-stone-700"
                      }`}
                    >
                      {formatShortDate(m.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Health disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
            <p className="font-semibold mb-1">Important Health Disclaimer</p>
            <p>
              This tool provides an estimate only. Only your healthcare provider
              can confirm your due date. Please consult your doctor or midwife
              for prenatal care. Due dates are approximate — only about 5% of
              babies are born on their estimated due date.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          How due date calculation works
        </p>
        <p>
          The LMP method (Naegele&apos;s rule) adds 280 days (40 weeks) to the
          first day of your last menstrual period. If your cycle is longer or
          shorter than 28 days, the estimate is adjusted accordingly. The
          conception method adds 266 days (38 weeks) from the estimated date of
          conception. Both methods provide an estimated due date, which your
          healthcare provider may adjust based on ultrasound measurements.
        </p>
      </div>
    </ToolPageLayout>
  );
}
