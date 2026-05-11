"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("screen-time-calculator")!;

interface Category {
  key: string;
  label: string;
  color: string;
  isWork: boolean;
}

const CATEGORIES: Category[] = [
  { key: "work", label: "Work / Productivity", color: "bg-blue-500", isWork: true },
  { key: "social", label: "Social Media", color: "bg-pink-500", isWork: false },
  { key: "entertainment", label: "Entertainment (streaming, YouTube)", color: "bg-purple-500", isWork: false },
  { key: "gaming", label: "Gaming", color: "bg-green-500", isWork: false },
  { key: "news", label: "News / Reading", color: "bg-amber-500", isWork: false },
  { key: "other", label: "Other", color: "bg-stone-400", isWork: false },
];

function formatHM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getHealthRisk(recreationalMinutes: number): {
  label: string;
  color: string;
  bg: string;
} {
  const hours = recreationalMinutes / 60;
  if (hours < 2) return { label: "Low risk", color: "text-green-700", bg: "bg-green-50 border-green-200" };
  if (hours < 4) return { label: "Moderate - consider reducing", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
  if (hours < 6) return { label: "High - likely affecting health", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" };
  return { label: "Very high - significant health risk", color: "text-red-700", bg: "bg-red-50 border-red-200" };
}

function getHeaviestCategory(
  values: Record<string, { hours: number; minutes: number }>
): string | null {
  let maxMinutes = 0;
  let maxKey: string | null = null;
  for (const cat of CATEGORIES) {
    if (cat.isWork) continue;
    const total = (values[cat.key]?.hours || 0) * 60 + (values[cat.key]?.minutes || 0);
    if (total > maxMinutes) {
      maxMinutes = total;
      maxKey = cat.key;
    }
  }
  return maxKey;
}

function getTips(heaviestKey: string | null): string[] {
  switch (heaviestKey) {
    case "social":
      return [
        "Set daily time limits for social media apps on your phone.",
        "Use app blockers during focused work or family time.",
        "Try phone-free meals to reconnect with the people around you.",
        "Turn off non-essential push notifications to reduce compulsive checking.",
        "Schedule specific times to check social media rather than browsing on impulse.",
      ];
    case "entertainment":
      return [
        "Time-box your streaming sessions - set an episode limit before you start.",
        "Swap one streaming session per day for an active alternative like a walk or stretching.",
        "Remove autoplay to make each episode a conscious choice.",
        "Try audio alternatives like podcasts or audiobooks during chores.",
        "Use a viewing log to track what you watch and reflect on what adds value.",
      ];
    case "gaming":
      return [
        "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
        "Take a 5-minute stretching break every hour of gaming.",
        "Consider blue-light blocking glasses for evening sessions.",
        "Set a timer before you start playing and stick to it.",
        "Balance gaming with physical activity - try to move for 30 minutes per hour of gaming.",
      ];
    case "news":
      return [
        "Limit news consumption to set times of day rather than continuous checking.",
        "Choose one or two trusted sources instead of scrolling many outlets.",
        "Replace some reading time with offline activities like paper books or puzzles.",
        "Turn off breaking news alerts to reduce anxiety-driven checking.",
      ];
    default:
      return [
        "Track your screen time daily to build awareness of your habits.",
        "Set specific screen-free windows during your day.",
        "Keep devices out of the bedroom for better sleep quality.",
        "Replace 30 minutes of screen time with a short walk or stretch.",
      ];
  }
}

export default function ScreenTimeCalculatorPage() {
  const [values, setValues] = useState<Record<string, { hours: number; minutes: number }>>(
    Object.fromEntries(CATEGORIES.map((c) => [c.key, { hours: 0, minutes: 0 }]))
  );

  function updateValue(key: string, field: "hours" | "minutes", val: number) {
    setValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: Math.max(0, val) },
    }));
  }

  // Compute totals
  const categoryMinutes = CATEGORIES.map((cat) => {
    const v = values[cat.key];
    return { ...cat, totalMinutes: (v?.hours || 0) * 60 + (v?.minutes || 0) };
  });

  const totalDailyMinutes = categoryMinutes.reduce((s, c) => s + c.totalMinutes, 0);
  const recreationalMinutes = categoryMinutes
    .filter((c) => !c.isWork)
    .reduce((s, c) => s + c.totalMinutes, 0);

  const weeklyMinutes = totalDailyMinutes * 7;
  const monthlyMinutes = totalDailyMinutes * 30;
  const yearlyMinutes = totalDailyMinutes * 365;
  const yearlyHours = yearlyMinutes / 60;
  const daysPerYear = yearlyHours / 16;

  const healthRisk = getHealthRisk(recreationalMinutes);
  const heaviestKey = getHeaviestCategory(values);
  const tips = getTips(heaviestKey);

  const maxCategoryMinutes = Math.max(...categoryMinutes.map((c) => c.totalMinutes), 1);

  const hasData = totalDailyMinutes > 0;

  // "What could you do instead" calculations
  const recreationalHoursPerYear = (recreationalMinutes * 365) / 60;
  const booksPerYear = Math.floor(recreationalHoursPerYear / 2);
  const walksPerYear = Math.floor(recreationalHoursPerYear / 0.5);
  const workoutsPerYear = Math.floor(recreationalHoursPerYear / 1);
  const sleepHoursGained = Math.floor(recreationalHoursPerYear);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Input Section */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">
            Daily Screen Time by Category
          </h2>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cat.color}`} />
                <span className="text-sm text-stone-700 w-48 flex-shrink-0">{cat.label}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={values[cat.key]?.hours || 0}
                    onChange={(e) =>
                      updateValue(cat.key, "hours", parseInt(e.target.value) || 0)
                    }
                    className="w-16 border border-stone-300 rounded-lg px-2 py-2 text-center"
                  />
                  <span className="text-sm text-stone-500">h</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={values[cat.key]?.minutes || 0}
                    onChange={(e) =>
                      updateValue(cat.key, "minutes", parseInt(e.target.value) || 0)
                    }
                    className="w-16 border border-stone-300 rounded-lg px-2 py-2 text-center"
                  />
                  <span className="text-sm text-stone-500">m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasData && (
          <>
            {/* Total Daily Screen Time */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Total Daily Screen Time</h2>
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">
                  {formatHM(totalDailyMinutes)}
                </span>
                <span className="text-lg text-stone-500 ml-2">per day</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-2">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-xl font-bold text-stone-800">{formatHM(weeklyMinutes)}</div>
                  <div className="text-sm text-stone-500">per week</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-xl font-bold text-stone-800">{formatHM(monthlyMinutes)}</div>
                  <div className="text-sm text-stone-500">per month</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-xl font-bold text-stone-800">{formatHM(yearlyMinutes)}</div>
                  <div className="text-sm text-stone-500">per year</div>
                </div>
              </div>
              <div className="text-center p-3 bg-stone-50 rounded-lg">
                <span className="text-lg font-bold text-stone-800">
                  {daysPerYear.toFixed(1)} days
                </span>
                <span className="text-sm text-stone-500 ml-2">
                  of waking hours per year spent on screens
                </span>
              </div>
            </div>

            {/* Percentage Breakdown */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Breakdown by Category</h2>
              <div className="space-y-3">
                {categoryMinutes
                  .filter((c) => c.totalMinutes > 0)
                  .sort((a, b) => b.totalMinutes - a.totalMinutes)
                  .map((cat) => {
                    const pct = (cat.totalMinutes / totalDailyMinutes) * 100;
                    const barWidth = (cat.totalMinutes / maxCategoryMinutes) * 100;
                    return (
                      <div key={cat.key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-700">{cat.label}</span>
                          <span className="text-stone-500">
                            {formatHM(cat.totalMinutes)} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.color}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Health Impact Assessment */}
            <div className={`border rounded-xl p-6 space-y-3 ${healthRisk.bg}`}>
              <h2 className="text-lg font-semibold text-stone-800">Health Impact Assessment</h2>
              <p className="text-sm text-stone-600">
                Based on <strong>{formatHM(recreationalMinutes)}</strong> of recreational screen
                time per day (excludes work/productivity):
              </p>
              <div className={`text-xl font-bold ${healthRisk.color}`}>{healthRisk.label}</div>
            </div>

            {/* 20-20-20 Rule */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3">
              <h2 className="text-lg font-semibold text-stone-800">The 20-20-20 Rule</h2>
              <p className="text-sm text-stone-600">
                Every <strong>20 minutes</strong> of screen time, look at something{" "}
                <strong>20 feet away</strong> for at least <strong>20 seconds</strong>. This helps
                reduce eye strain, dryness, and fatigue.
              </p>
              <p className="text-sm text-stone-500">
                Based on your daily screen time, you should take approximately{" "}
                <strong>{Math.floor(totalDailyMinutes / 20)}</strong> eye breaks per day.
              </p>
            </div>

            {/* Practical Tips */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Tips to Reduce Screen Time</h2>
              {heaviestKey && (
                <p className="text-sm text-stone-500">
                  Based on your heaviest recreational category:{" "}
                  <strong>
                    {CATEGORIES.find((c) => c.key === heaviestKey)?.label}
                  </strong>
                </p>
              )}
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-stone-700">
                    <span className="text-primary font-bold flex-shrink-0">&#x2022;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* What Could You Do Instead */}
            {recreationalMinutes > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-stone-800">
                  What Could You Do Instead?
                </h2>
                <p className="text-sm text-stone-500">
                  If you redirected your <strong>{formatHM(recreationalMinutes)}</strong> of daily
                  recreational screen time, in one year you could:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{booksPerYear}</div>
                    <div className="text-sm text-stone-500">books read</div>
                    <div className="text-xs text-stone-400">at 2 hours per book</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{walksPerYear.toLocaleString()}</div>
                    <div className="text-sm text-stone-500">30-min walks</div>
                    <div className="text-xs text-stone-400">taken throughout the year</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{workoutsPerYear.toLocaleString()}</div>
                    <div className="text-sm text-stone-500">workout sessions</div>
                    <div className="text-xs text-stone-400">at 1 hour each</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{sleepHoursGained.toLocaleString()}</div>
                    <div className="text-sm text-stone-500">hours of sleep</div>
                    <div className="text-xs text-stone-400">gained per year</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
