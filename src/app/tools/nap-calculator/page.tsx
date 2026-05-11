"use client";

import { useState, useEffect } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("nap-calculator")!;

interface NapType {
  label: string;
  minutes: number;
  description: string;
}

const NAP_TYPES: NapType[] = [
  { label: "Power Nap", minutes: 20, description: "Quick boost of alertness and energy" },
  { label: "Recovery Nap", minutes: 60, description: "Deeper rest for memory and learning" },
  { label: "Full Cycle", minutes: 90, description: "Complete sleep cycle with REM sleep" },
];

const FALL_ASLEEP_MINUTES = 5;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getCurrentTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function parseTime(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function addMinutes(date: Date, mins: number): Date {
  return new Date(date.getTime() + mins * 60000);
}

interface NapResult {
  nap: NapType;
  wakeTime: Date;
  isTooLate: boolean;
  isRecommended: boolean;
}

export default function NapCalculatorPage() {
  const [currentTime, setCurrentTime] = useState("13:00");
  const [bedtime, setBedtime] = useState("22:00");
  const [results, setResults] = useState<NapResult[] | null>(null);

  useEffect(() => {
    setCurrentTime(getCurrentTimeString());
  }, []);

  function calculate() {
    const now = parseTime(currentTime);
    const bed = parseTime(bedtime);

    // If bedtime is earlier in clock time, assume next day
    let bedMs = bed.getTime();
    if (bedMs <= now.getTime()) {
      bedMs += 24 * 60 * 60 * 1000;
    }

    const safeCutoff = new Date(bedMs - 5 * 60 * 60 * 1000); // 5 hours before bedtime
    const currentHour = now.getHours();

    const napResults: NapResult[] = NAP_TYPES.map((nap) => {
      const wakeTime = addMinutes(now, nap.minutes + FALL_ASLEEP_MINUTES);
      const isTooLate = wakeTime.getTime() > safeCutoff.getTime();
      const isRecommended =
        (nap.minutes === 20 && currentHour >= 14) ||
        (nap.minutes === 90 && currentHour < 12);
      return { nap, wakeTime, isTooLate, isRecommended };
    });

    setResults(napResults);
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current time</label>
          <input
            type="time"
            value={currentTime}
            onChange={(e) => setCurrentTime(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Usual bedtime</label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
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

      {results && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-stone-500 font-medium">Nap options:</p>
          {results.map((r, i) => (
            <div
              key={i}
              className={`bg-white border rounded-xl p-5 ${
                r.isTooLate
                  ? "border-amber-200 bg-amber-50"
                  : "border-stone-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-lg font-bold">
                  {r.nap.label}{" "}
                  <span className="text-sm font-normal text-stone-500">
                    ({r.nap.minutes} min)
                  </span>
                </p>
                <div className="flex gap-2">
                  {r.isRecommended && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                  {r.nap.minutes === 60 && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                      May cause grogginess
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-stone-500 mb-2">{r.nap.description}</p>
              <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
                <p className="text-2xl font-bold">{formatTime(r.wakeTime)}</p>
                <p className="text-sm text-stone-500">Wake-up time</p>
              </div>
              {r.isTooLate && (
                <p className="mt-2 text-sm text-amber-700 font-medium">
                  Warning: Waking up this late may disrupt your nighttime sleep.
                  Consider a shorter nap or skipping the nap.
                </p>
              )}
            </div>
          ))}

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
            <p>
              <strong className="text-stone-700">Latest safe nap wake-up:</strong>{" "}
              {formatTime(
                addMinutes(
                  parseTime(bedtime),
                  bedtime <= currentTime ? 24 * 60 - 5 * 60 : -5 * 60
                )
              )}{" "}
              (5 hours before your bedtime)
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About napping</p>
        <p>
          Power naps (20 minutes) enhance alertness without entering deep sleep.
          Recovery naps (60 minutes) include deep sleep and may cause temporary
          grogginess upon waking. Full-cycle naps (90 minutes) complete an entire
          sleep cycle including REM, leaving you refreshed. Avoid napping within
          5 hours of bedtime, as it can make it harder to fall asleep at night.
          This tool adds 5 minutes to account for time to fall asleep.
        </p>
      </div>
    </ToolPageLayout>
  );
}
