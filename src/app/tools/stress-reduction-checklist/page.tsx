"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("stress-reduction-checklist")!;

interface Category {
  name: string;
  color: string;
  items: string[];
}

const CATEGORIES: Category[] = [
  {
    name: "Physical",
    color: "border-blue-400",
    items: [
      "30 minutes of physical activity",
      "Spent time outdoors / in nature",
      "Practised deep breathing (2+ minutes)",
      "Stretched or did yoga",
      "Avoided excessive caffeine",
      "Got 7+ hours of sleep last night",
    ],
  },
  {
    name: "Mental",
    color: "border-purple-400",
    items: [
      "Practised mindfulness or meditation",
      "Wrote in a journal or gratitude log",
      "Took breaks from screens (hourly)",
      "Did something creative",
      "Read for pleasure (10+ minutes)",
      "Set clear boundaries (said no when needed)",
    ],
  },
  {
    name: "Social",
    color: "border-green-400",
    items: [
      "Had a meaningful conversation",
      "Expressed appreciation to someone",
      "Spent quality time with loved ones",
      "Reached out to a friend",
    ],
  },
  {
    name: "Environmental",
    color: "border-amber-400",
    items: [
      "Tidied or organized a space",
      "Reduced noise/clutter in workspace",
      "Spent time away from phone (30+ min)",
      "Created a calming atmosphere (music, lighting)",
    ],
  },
];

const TOTAL_ITEMS = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);

type CheckedState = Record<string, Record<number, boolean>>;

function buildInitialState(): CheckedState {
  const state: CheckedState = {};
  for (const cat of CATEGORIES) {
    state[cat.name] = {};
    for (let i = 0; i < cat.items.length; i++) {
      state[cat.name][i] = false;
    }
  }
  return state;
}

function getRating(pct: number): { label: string; colorClass: string } {
  if (pct >= 80) return { label: "Excellent", colorClass: "text-emerald-600" };
  if (pct >= 60) return { label: "Good", colorClass: "text-blue-600" };
  if (pct >= 40) return { label: "Fair", colorClass: "text-amber-600" };
  return { label: "Needs Attention", colorClass: "text-red-600" };
}

export default function StressReductionChecklistPage() {
  const [checked, setChecked] = useState<CheckedState>(buildInitialState());

  const toggleItem = (category: string, index: number) => {
    setChecked((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: !prev[category][index],
      },
    }));
  };

  const resetAll = () => {
    setChecked(buildInitialState());
  };

  // Stats
  const categoryStats = CATEGORIES.map((cat) => {
    const completed = Object.values(checked[cat.name]).filter(Boolean).length;
    return { name: cat.name, completed, total: cat.items.length };
  });

  const totalCompleted = categoryStats.reduce(
    (sum, s) => sum + s.completed,
    0
  );
  const pct = TOTAL_ITEMS > 0 ? Math.round((totalCompleted / TOTAL_ITEMS) * 100) : 0;
  const rating = getRating(pct);

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        {/* Stats Panel */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">Today&apos;s Progress</h3>
            <span className={`text-sm font-bold ${rating.colorClass}`}>
              {rating.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-600 font-medium whitespace-nowrap">
              {totalCompleted}/{TOTAL_ITEMS}
            </span>
            <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm text-stone-600 font-medium">{pct}%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {categoryStats.map((s) => (
              <div
                key={s.name}
                className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-center"
              >
                <p className="text-stone-500">{s.name}</p>
                <p className="font-semibold text-stone-700">
                  {s.completed}/{s.total}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        {CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <h3
              className={`text-base font-semibold text-stone-800 mb-3 pl-3 border-l-4 ${cat.color}`}
            >
              {cat.name}
            </h3>
            <div className="space-y-2">
              {cat.items.map((item, i) => {
                const isChecked = checked[cat.name][i];
                return (
                  <label
                    key={i}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-emerald-50 border border-emerald-200"
                        : "bg-white border border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(cat.name, i)}
                      className="w-5 h-5 accent-emerald-600 cursor-pointer shrink-0"
                    />
                    <span
                      className={`text-sm ${
                        isChecked
                          ? "text-stone-500 line-through"
                          : "text-stone-700"
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Reset */}
        <div className="flex justify-end">
          <button
            onClick={resetAll}
            className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Reset Checklist
          </button>
        </div>

        {/* Note */}
        <p className="text-xs text-stone-400 text-center">
          Check off activities as you complete them throughout the day. Aim for
          at least 10 items daily.
        </p>
      </div>
    </ToolPageLayout>
  );
}
