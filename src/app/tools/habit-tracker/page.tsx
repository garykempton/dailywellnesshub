"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("habit-tracker")!;

interface Habit {
  id: string;
  name: string;
  done: boolean;
  streak: number;
}

const DEFAULT_HABITS: string[] = [
  "Drink 8 glasses of water",
  "Exercise 30 minutes",
  "Sleep 7+ hours",
  "Eat a vegetable",
  "10 min mindfulness",
];

function getMotivationalMessage(pct: number): string {
  if (pct >= 100) return "Perfect day! Keep it up!";
  if (pct >= 60) return "Great progress! Almost there.";
  if (pct >= 30) return "Good start. Try to complete a few more.";
  return "Every journey starts with one step.";
}

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState<Habit[]>(
    DEFAULT_HABITS.map((name) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name,
      done: false,
      streak: 0,
    }))
  );
  const [newHabit, setNewHabit] = useState("");

  function addHabit() {
    const trimmed = newHabit.trim();
    if (!trimmed || habits.length >= 10) return;
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name: trimmed,
        done: false,
        streak: 0,
      },
    ]);
    setNewHabit("");
  }

  function toggleHabit(id: string) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const nowDone = !h.done;
        return {
          ...h,
          done: nowDone,
          streak: nowDone ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      })
    );
  }

  function removeHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  const completedCount = habits.filter((h) => h.done).length;
  const totalCount = habits.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        {/* Add Habit */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
            }}
            placeholder={
              habits.length >= 10
                ? "Maximum 10 habits reached"
                : "Add a new habit..."
            }
            disabled={habits.length >= 10}
            className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={addHabit}
            disabled={habits.length >= 10 || !newHabit.trim()}
            className="bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Habit
          </button>
        </div>

        {/* Habit List */}
        {habits.length === 0 && (
          <p className="text-center text-stone-400 text-sm py-4">
            No habits yet. Add one above to get started.
          </p>
        )}

        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`flex items-center gap-3 border rounded-xl p-4 transition-colors ${
                habit.done
                  ? "border-green-200 bg-green-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={habit.done}
                onChange={() => toggleHabit(habit.id)}
                className="w-5 h-5 accent-primary cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm ${
                    habit.done ? "line-through text-stone-400" : "text-stone-800"
                  }`}
                >
                  {habit.name}
                </p>
                <p className="text-xs text-stone-400">
                  Streak: {habit.streak} {habit.streak === 1 ? "day" : "days"}
                </p>
              </div>
              <button
                onClick={() => removeHabit(habit.id)}
                className="text-stone-300 hover:text-red-500 transition-colors text-lg font-bold shrink-0 leading-none"
                aria-label={`Remove ${habit.name}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        {totalCount > 0 && (
          <div className="border-t border-stone-200 pt-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600 font-medium">
                Habits completed today: {completedCount}/{totalCount}
              </span>
              <span className="text-stone-500">{pct}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">
                Longest current streak: {longestStreak}{" "}
                {longestStreak === 1 ? "day" : "days"}
              </span>
              <span className="text-stone-600 font-medium">
                {getMotivationalMessage(pct)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-400">
        This tracker resets when you close the page. For persistent tracking,
        consider a dedicated habit tracking app.
      </div>
    </ToolPageLayout>
  );
}
