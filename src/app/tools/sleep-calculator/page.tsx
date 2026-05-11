"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("sleep-calculator")!;

const CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 15;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function addMinutes(date: Date, mins: number): Date {
  return new Date(date.getTime() + mins * 60000);
}

export default function SleepCalculatorPage() {
  const [mode, setMode] = useState<"bedtime" | "wake">("bedtime");
  const [timeInput, setTimeInput] = useState("07:00");
  const [results, setResults] = useState<{ time: Date; cycles: number; hours: number }[]>([]);

  function calculate() {
    const [h, m] = timeInput.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);

    const options: { time: Date; cycles: number; hours: number }[] = [];

    if (mode === "wake") {
      // Given wake time, suggest bedtimes (working backwards)
      for (let cycles = 6; cycles >= 3; cycles--) {
        const sleepMins = cycles * CYCLE_MINUTES;
        const bedtime = addMinutes(base, -(sleepMins + FALL_ASLEEP_MINUTES));
        options.push({
          time: bedtime,
          cycles,
          hours: Math.round((sleepMins / 60) * 10) / 10,
        });
      }
    } else {
      // Given bedtime, suggest wake times (working forwards)
      const fallAsleep = addMinutes(base, FALL_ASLEEP_MINUTES);
      for (let cycles = 3; cycles <= 6; cycles++) {
        const sleepMins = cycles * CYCLE_MINUTES;
        const wakeTime = addMinutes(fallAsleep, sleepMins);
        options.push({
          time: wakeTime,
          cycles,
          hours: Math.round((sleepMins / 60) * 10) / 10,
        });
      }
    }

    setResults(options);
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex gap-2">
          {(["wake", "bedtime"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setResults([]);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                mode === m
                  ? "bg-primary text-white border-primary"
                  : "border-stone-300 hover:border-stone-500"
              }`}
            >
              {m === "wake" ? "I need to wake up at..." : "I want to go to bed at..."}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {mode === "wake" ? "Wake-up time" : "Bedtime"}
          </label>
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-stone-500 font-medium">
            {mode === "wake"
              ? "Suggested bedtimes:"
              : "Suggested wake-up times:"}
          </p>
          {results.map((r, i) => (
            <div
              key={i}
              className={`bg-white border rounded-xl p-4 flex items-center justify-between ${
                r.cycles >= 5
                  ? "border-green-200 bg-green-50"
                  : r.cycles >= 4
                  ? "border-stone-200"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div>
                <p className="text-2xl font-bold">{formatTime(r.time)}</p>
                <p className="text-sm text-stone-500">
                  {r.cycles} cycles &middot; {r.hours} hours of sleep
                </p>
              </div>
              {r.cycles >= 5 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Recommended
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About sleep cycles</p>
        <p>
          A typical sleep cycle lasts about 90 minutes and includes light sleep,
          deep sleep, and REM sleep. Most adults need 4-6 complete cycles (6-9
          hours) per night. This calculator adds 15 minutes to fall asleep.
          Individual sleep needs vary. This tool is for informational purposes
          only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
