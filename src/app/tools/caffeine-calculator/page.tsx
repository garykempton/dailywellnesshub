"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("caffeine-calculator")!;

const HALF_LIFE = 5.7; // hours

interface DrinkOption {
  name: string;
  mg: number;
}

const DRINKS: DrinkOption[] = [
  { name: "Brewed Coffee (8 oz)", mg: 95 },
  { name: "Espresso (single shot)", mg: 63 },
  { name: "Black Tea (8 oz)", mg: 47 },
  { name: "Green Tea (8 oz)", mg: 28 },
  { name: "Cola (12 oz)", mg: 34 },
  { name: "Energy Drink (8 oz)", mg: 80 },
  { name: "Dark Chocolate (1 oz)", mg: 12 },
  { name: "Pre-Workout (1 scoop)", mg: 200 },
  { name: "Custom amount", mg: 0 },
];

interface DrinkEntry {
  drinkIndex: number;
  customMg: string;
  time: string;
}

interface TimelinePoint {
  label: string;
  totalMg: number;
}

function caffeineRemaining(doseMg: number, elapsedHours: number): number {
  return doseMg * Math.pow(0.5, elapsedHours / HALF_LIFE);
}

function parseTime(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatTimeLabel(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getDrinkMg(entry: DrinkEntry): number {
  const drink = DRINKS[entry.drinkIndex];
  if (drink.name === "Custom amount") {
    return Number(entry.customMg) || 0;
  }
  return drink.mg;
}

interface Results {
  drinks: { name: string; mg: number; time: string; remainingAtBed: number }[];
  totalConsumed: number;
  totalRemainingAtBed: number;
  latestSafeTime: string;
  timeline: TimelinePoint[];
  sleepImpact: "green" | "amber" | "red";
  sleepImpactLabel: string;
}

export default function CaffeineCalculatorPage() {
  const [entries, setEntries] = useState<DrinkEntry[]>([
    { drinkIndex: 0, customMg: "", time: "08:00" },
  ]);
  const [bedtime, setBedtime] = useState("22:00");
  const [results, setResults] = useState<Results | null>(null);

  function updateEntry(index: number, updates: Partial<DrinkEntry>) {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...updates } : e))
    );
  }

  function addEntry() {
    setEntries((prev) => [
      ...prev,
      { drinkIndex: 0, customMg: "", time: "12:00" },
    ]);
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function calculate() {
    const bedDate = parseTime(bedtime);

    // Calculate remaining caffeine at bedtime for each drink
    const drinkResults = entries.map((entry) => {
      const mg = getDrinkMg(entry);
      const consumedDate = parseTime(entry.time);
      let elapsedMs = bedDate.getTime() - consumedDate.getTime();
      if (elapsedMs < 0) elapsedMs += 24 * 60 * 60 * 1000; // next day bedtime
      const elapsedHours = elapsedMs / (1000 * 60 * 60);
      const remaining = caffeineRemaining(mg, elapsedHours);
      return {
        name: DRINKS[entry.drinkIndex].name,
        mg,
        time: entry.time,
        remainingAtBed: Math.round(remaining * 10) / 10,
      };
    });

    const totalConsumed = drinkResults.reduce((s, d) => s + d.mg, 0);
    const totalRemainingAtBed = Math.round(
      drinkResults.reduce((s, d) => s + d.remainingAtBed, 0) * 10
    ) / 10;

    // Latest safe caffeine time: when 95mg coffee would drop below 25mg by bedtime
    // 25 = 95 * 0.5^(t / 5.7) => t = 5.7 * log2(95/25)
    const hoursNeeded = HALF_LIFE * (Math.log(95 / 25) / Math.log(2));
    const latestSafeDate = new Date(bedDate.getTime() - hoursNeeded * 60 * 60 * 1000);
    if (latestSafeDate.getTime() < 0) {
      latestSafeDate.setTime(latestSafeDate.getTime() + 24 * 60 * 60 * 1000);
    }
    const latestSafeTime = formatTimeLabel(latestSafeDate);

    // Build caffeine timeline at 2-hour intervals from latest drink until bedtime
    let latestDrinkTime = 0;
    entries.forEach((entry) => {
      const t = parseTime(entry.time).getTime();
      if (t > latestDrinkTime) latestDrinkTime = t;
    });

    const timeline: TimelinePoint[] = [];
    let cursor = latestDrinkTime;
    let bedMs = bedDate.getTime();
    if (bedMs <= latestDrinkTime) bedMs += 24 * 60 * 60 * 1000;

    while (cursor <= bedMs) {
      const cursorDate = new Date(cursor);
      let totalAtCursor = 0;
      entries.forEach((entry) => {
        const mg = getDrinkMg(entry);
        const consumedMs = parseTime(entry.time).getTime();
        let elapsedMs = cursor - consumedMs;
        if (elapsedMs < 0) elapsedMs += 24 * 60 * 60 * 1000;
        const elapsedHours = elapsedMs / (1000 * 60 * 60);
        if (elapsedHours >= 0) {
          totalAtCursor += caffeineRemaining(mg, elapsedHours);
        }
      });
      timeline.push({
        label: formatTimeLabel(cursorDate),
        totalMg: Math.round(totalAtCursor),
      });
      cursor += 2 * 60 * 60 * 1000;
    }

    // Add bedtime as final point if not already there
    if (timeline.length === 0 || timeline[timeline.length - 1].label !== formatTimeLabel(bedDate)) {
      let totalAtBed = 0;
      entries.forEach((entry) => {
        const mg = getDrinkMg(entry);
        const consumedMs = parseTime(entry.time).getTime();
        let elapsedMs = bedMs - consumedMs;
        if (elapsedMs < 0) elapsedMs += 24 * 60 * 60 * 1000;
        totalAtBed += caffeineRemaining(mg, elapsedMs / (1000 * 60 * 60));
      });
      timeline.push({
        label: formatTimeLabel(bedDate) + " (bedtime)",
        totalMg: Math.round(totalAtBed),
      });
    }

    // Sleep impact
    let sleepImpact: "green" | "amber" | "red";
    let sleepImpactLabel: string;
    if (totalRemainingAtBed > 100) {
      sleepImpact = "red";
      sleepImpactLabel = "Likely to significantly disrupt sleep";
    } else if (totalRemainingAtBed >= 50) {
      sleepImpact = "amber";
      sleepImpactLabel = "May affect sleep quality";
    } else {
      sleepImpact = "green";
      sleepImpactLabel = "Minimal sleep impact";
    }

    setResults({
      drinks: drinkResults,
      totalConsumed,
      totalRemainingAtBed,
      latestSafeTime,
      timeline,
      sleepImpact,
      sleepImpactLabel,
    });
  }

  const impactColors = {
    green: "bg-green-50 border-green-200 text-green-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <p className="text-sm font-medium text-stone-700">
          Add your drinks for the day:
        </p>

        {entries.map((entry, i) => (
          <div
            key={i}
            className="border border-stone-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-600">
                Drink {i + 1}
              </span>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(i)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Beverage</label>
              <select
                value={entry.drinkIndex}
                onChange={(e) =>
                  updateEntry(i, { drinkIndex: Number(e.target.value) })
                }
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                {DRINKS.map((d, di) => (
                  <option key={di} value={di}>
                    {d.name}
                    {d.mg > 0 ? ` (${d.mg} mg)` : ""}
                  </option>
                ))}
              </select>
            </div>
            {DRINKS[entry.drinkIndex].name === "Custom amount" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Caffeine (mg)
                </label>
                <input
                  type="number"
                  min="0"
                  value={entry.customMg}
                  onChange={(e) => updateEntry(i, { customMg: e.target.value })}
                  placeholder="e.g. 150"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Time consumed
              </label>
              <input
                type="time"
                value={entry.time}
                onChange={(e) => updateEntry(i, { time: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addEntry}
          className="w-full border border-dashed border-stone-300 rounded-lg py-2 text-sm text-stone-500 hover:border-stone-500 hover:text-stone-700 transition-colors"
        >
          + Add another drink
        </button>

        <div>
          <label className="block text-sm font-medium mb-1">Bedtime</label>
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
        <div className="mt-6 space-y-4">
          {/* Daily total vs FDA limit */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-2">
              Daily caffeine intake
            </p>
            <div className="flex items-end justify-between mb-1">
              <span className="text-2xl font-bold">
                {results.totalConsumed} mg
              </span>
              <span className="text-sm text-stone-500">/ 400 mg FDA limit</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${
                  results.totalConsumed > 400 ? "bg-red-500" : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min((results.totalConsumed / 400) * 100, 100)}%`,
                }}
              />
            </div>
            {results.totalConsumed > 400 && (
              <p className="text-sm text-red-600 mt-1 font-medium">
                Exceeds the FDA recommended daily limit of 400 mg.
              </p>
            )}
          </div>

          {/* Sleep impact */}
          <div
            className={`border rounded-xl p-5 text-center ${
              impactColors[results.sleepImpact]
            }`}
          >
            <p className="text-sm font-medium mb-1">
              Caffeine remaining at bedtime
            </p>
            <p className="text-3xl font-bold">{results.totalRemainingAtBed} mg</p>
            <p className="text-sm font-medium mt-1">{results.sleepImpactLabel}</p>
          </div>

          {/* Latest safe caffeine time */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Latest safe time for a cup of coffee
            </p>
            <p className="text-2xl font-bold">{results.latestSafeTime}</p>
            <p className="text-xs text-stone-400 mt-1">
              Based on a standard 95 mg brewed coffee dropping below 25 mg by
              bedtime
            </p>
          </div>

          {/* Per-drink breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Caffeine remaining at bedtime by drink
            </p>
            <div className="space-y-2">
              {results.drinks.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-stone-600">{d.name}</span>
                  <span className="font-medium">{d.remainingAtBed} mg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Caffeine Timeline */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Caffeine timeline
            </p>
            <div className="space-y-2">
              {results.timeline.map((point, i) => {
                const maxMg =
                  results.timeline.length > 0
                    ? Math.max(...results.timeline.map((p) => p.totalMg))
                    : 1;
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-28 text-stone-500 text-right shrink-0">
                      {point.label}
                    </span>
                    <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full ${
                          point.totalMg > 100
                            ? "bg-red-400"
                            : point.totalMg > 50
                            ? "bg-amber-400"
                            : "bg-green-400"
                        }`}
                        style={{
                          width: `${
                            maxMg > 0
                              ? Math.max((point.totalMg / maxMg) * 100, 2)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="w-14 font-medium text-right">
                      {point.totalMg} mg
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About caffeine</p>
        <p>
          Caffeine has an average half-life of 5.7 hours, meaning half the
          caffeine you consume is still in your system nearly 6 hours later.
          Individual metabolism varies based on genetics, age, liver function,
          and medications. The FDA recommends a maximum of 400 mg of caffeine per
          day for most healthy adults. This tool provides estimates for
          informational purposes only and is not medical advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
