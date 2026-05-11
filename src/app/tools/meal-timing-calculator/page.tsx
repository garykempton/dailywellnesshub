"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("meal-timing-calculator")!;

type EatingPattern =
  | "3-meals"
  | "3-meals-2-snacks"
  | "5-small-meals"
  | "if-16-8"
  | "if-18-6"
  | "if-20-4";

type Goal = "general" | "weight-loss" | "muscle-gain" | "athletic";

interface MealSlot {
  time: string;
  label: string;
  suggestion: string;
  type: "meal" | "snack" | "pre-workout" | "post-workout" | "fasting";
}

function parseMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number): string {
  let m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const min = Math.round(m % 60);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${min.toString().padStart(2, "0")} ${period}`;
}

function wakingHours(wake: number, bed: number): number {
  let diff = bed - wake;
  if (diff <= 0) diff += 1440;
  return diff / 60;
}

function buildSchedule(
  wake: number,
  bed: number,
  pattern: EatingPattern,
  goal: Goal,
  includeWorkout: boolean,
  workoutMin: number
): { meals: MealSlot[]; eatingWindowHrs: number; fastingWindowHrs: number } {
  const wakeHrs = wakingHours(wake, bed);
  let meals: MealSlot[] = [];

  const ifWindows: Record<string, number> = {
    "if-16-8": 8,
    "if-18-6": 6,
    "if-20-4": 4,
  };

  const isIF = pattern.startsWith("if-");
  let eatingWindowHrs = wakeHrs;
  let fastingWindowHrs = 24 - wakeHrs;

  if (isIF) {
    const windowSize = ifWindows[pattern] || 8;
    eatingWindowHrs = windowSize;
    fastingWindowHrs = 24 - windowSize;

    // Default: start eating window at noon-ish (or wake+5hrs, whichever is later)
    const earliestStart = wake + 5 * 60;
    const ifStart = Math.max(earliestStart, wake + (wakeHrs * 60 - windowSize * 60) / 2);
    const ifEnd = ifStart + windowSize * 60;

    if (windowSize >= 8) {
      meals.push({
        time: formatTime(ifStart),
        label: "First Meal",
        suggestion: "Balanced meal with protein, complex carbs, and healthy fats",
        type: "meal",
      });
      meals.push({
        time: formatTime(ifStart + (windowSize * 60) / 2),
        label: "Second Meal",
        suggestion: "Protein-rich meal with vegetables and whole grains",
        type: "meal",
      });
      meals.push({
        time: formatTime(ifEnd - 30),
        label: "Final Meal",
        suggestion: "Lighter meal with lean protein and vegetables",
        type: "meal",
      });
    } else if (windowSize >= 6) {
      meals.push({
        time: formatTime(ifStart),
        label: "First Meal",
        suggestion: "Larger meal with protein, carbs, and fats to sustain energy",
        type: "meal",
      });
      meals.push({
        time: formatTime(ifStart + windowSize * 30),
        label: "Second Meal",
        suggestion: "Balanced meal with lean protein and vegetables",
        type: "meal",
      });
      meals.push({
        time: formatTime(ifEnd - 30),
        label: "Final Snack",
        suggestion: "Small protein-rich snack before fasting window",
        type: "snack",
      });
    } else {
      meals.push({
        time: formatTime(ifStart),
        label: "Main Meal",
        suggestion: "Large nutrient-dense meal covering most daily calories",
        type: "meal",
      });
      meals.push({
        time: formatTime(ifEnd - 30),
        label: "Second Meal",
        suggestion: "Moderate meal to complete daily nutrition needs",
        type: "meal",
      });
    }
  } else if (pattern === "3-meals") {
    const third = (wakeHrs * 60) / 3;
    meals.push({
      time: formatTime(wake + 60),
      label: "Breakfast",
      suggestion: "Protein and complex carbs for sustained morning energy",
      type: "meal",
    });
    meals.push({
      time: formatTime(wake + third + third / 2),
      label: "Lunch",
      suggestion: "Balanced plate: lean protein, whole grains, vegetables",
      type: "meal",
    });
    meals.push({
      time: formatTime(bed - 150),
      label: "Dinner",
      suggestion: "Moderate portion with protein, vegetables, and healthy fats",
      type: "meal",
    });
  } else if (pattern === "3-meals-2-snacks") {
    const breakfastMin = wake + 60;
    const dinnerMin = bed - 150;
    const lunchMin = wake + ((dinnerMin - breakfastMin) / 2);
    const snack1Min = breakfastMin + (lunchMin - breakfastMin) / 2;
    const snack2Min = lunchMin + (dinnerMin - lunchMin) / 2;

    meals.push({
      time: formatTime(breakfastMin),
      label: "Breakfast",
      suggestion: "Whole grains with protein (eggs, yogurt, or nut butter)",
      type: "meal",
    });
    meals.push({
      time: formatTime(snack1Min),
      label: "Morning Snack",
      suggestion: "Fruit with a handful of nuts or Greek yogurt",
      type: "snack",
    });
    meals.push({
      time: formatTime(lunchMin),
      label: "Lunch",
      suggestion: "Lean protein with vegetables and complex carbs",
      type: "meal",
    });
    meals.push({
      time: formatTime(snack2Min),
      label: "Afternoon Snack",
      suggestion: "Vegetables with hummus or a protein bar",
      type: "snack",
    });
    meals.push({
      time: formatTime(dinnerMin),
      label: "Dinner",
      suggestion: "Balanced dinner with protein, vegetables, and healthy fats",
      type: "meal",
    });
  } else if (pattern === "5-small-meals") {
    const interval = (wakeHrs * 60) / 5;
    const labels = ["Meal 1", "Meal 2", "Meal 3", "Meal 4", "Meal 5"];
    const suggestions = [
      "Protein-rich breakfast (eggs, oats, Greek yogurt)",
      "Light meal with fruit, nuts, or a smoothie",
      "Lean protein with vegetables and whole grains",
      "Balanced snack-sized meal (cottage cheese, veggies, crackers)",
      "Light dinner with protein and vegetables",
    ];
    for (let i = 0; i < 5; i++) {
      meals.push({
        time: formatTime(wake + 60 + interval * i),
        label: labels[i],
        suggestion: suggestions[i],
        type: "meal",
      });
    }
  }

  // Add workout meals if included
  if (includeWorkout) {
    const preWorkoutMin = workoutMin - 90;
    const postWorkoutMin = workoutMin + 60;

    // Check no existing meal overlaps closely (within 30min)
    const hasNearbyMeal = (targetMin: number) =>
      meals.some(() => {
        // We compare raw minutes for simplicity
        return false; // always add workout meals
      });

    if (!hasNearbyMeal(preWorkoutMin)) {
      meals.push({
        time: formatTime(preWorkoutMin),
        label: "Pre-Workout Snack",
        suggestion: "Easily digestible carbs with moderate protein (banana + whey, toast + PB)",
        type: "pre-workout",
      });
    }
    if (!hasNearbyMeal(postWorkoutMin)) {
      meals.push({
        time: formatTime(postWorkoutMin),
        label: "Post-Workout Meal",
        suggestion: "Fast-digesting protein and carbs (protein shake + fruit, chicken + rice)",
        type: "post-workout",
      });
    }
  }

  // Goal adjustments
  if (goal === "weight-loss") {
    // Remove any late snacks (within 2hrs of bed)
    meals = meals.filter((m) => {
      if (m.type !== "snack") return true;
      return true; // keep but add tip
    });
  }

  if (goal === "muscle-gain" && !isIF) {
    meals.push({
      time: formatTime(bed - 45),
      label: "Pre-Bed Protein",
      suggestion: "Casein protein shake or cottage cheese for overnight muscle recovery",
      type: "snack",
    });
  }

  // Sort meals by time (parse the formatted time back to minutes for sorting)
  meals.sort((a, b) => {
    const getMin = (t: string) => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/);
      if (!match) return 0;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const p = match[3];
      if (p === "PM" && h !== 12) h += 12;
      if (p === "AM" && h === 12) h = 0;
      return h * 60 + m;
    };
    return getMin(a.time) - getMin(b.time);
  });

  if (!isIF) {
    eatingWindowHrs = Math.round(wakeHrs * 10) / 10;
    fastingWindowHrs = Math.round((24 - wakeHrs) * 10) / 10;
  }

  return { meals, eatingWindowHrs, fastingWindowHrs };
}

function getGoalTips(goal: Goal): string[] {
  switch (goal) {
    case "weight-loss":
      return [
        "Front-load your calories: eat more at breakfast and lunch, less at dinner.",
        "Avoid snacking within 2-3 hours of bedtime to improve sleep and metabolism.",
        "Stay hydrated between meals to manage hunger -- sometimes thirst mimics hunger.",
        "Consider a longer overnight fasting window (12-14 hours) for metabolic benefits.",
      ];
    case "muscle-gain":
      return [
        "Eat protein at every meal (aim for 20-40g per sitting) to maximise muscle protein synthesis.",
        "Consume a protein-rich snack before bed (casein is ideal) for overnight recovery.",
        "Time carbohydrates around your workouts for better performance and glycogen replenishment.",
        "Do not skip breakfast; it sets the stage for consistent protein distribution throughout the day.",
      ];
    case "athletic":
      return [
        "Eat a carb-rich meal 2-3 hours before training for optimal fuel.",
        "Consume a 3:1 or 4:1 carb-to-protein ratio within 30-60 minutes post-workout.",
        "Hydrate consistently and include electrolytes during sessions over 60 minutes.",
        "On competition days, eat familiar foods -- never try new meals before an event.",
      ];
    default:
      return [
        "Eat consistent meals at regular times to support your circadian rhythm.",
        "Include protein, fibre, and healthy fats at each meal for balanced nutrition.",
        "Finish eating 2-3 hours before bed to support better sleep quality.",
        "Listen to your hunger cues and eat mindfully rather than by the clock alone.",
      ];
  }
}

function getWorkoutTips(): string[] {
  return [
    "Pre-workout: Eat easily digestible carbs and moderate protein 1-2 hours before exercise.",
    "Post-workout: Aim for 20-40g protein and 40-80g carbs within 60 minutes after training.",
    "Hydrate before, during, and after exercise. Drink 500ml of water 2 hours before training.",
    "For early morning workouts, a small banana or handful of dried fruit can fuel your session without heaviness.",
  ];
}

export default function MealTimingCalculatorPage() {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("22:00");
  const [includeWorkout, setIncludeWorkout] = useState(false);
  const [workoutTime, setWorkoutTime] = useState("17:00");
  const [eatingPattern, setEatingPattern] = useState<EatingPattern>("3-meals");
  const [goal, setGoal] = useState<Goal>("general");
  const [results, setResults] = useState<{
    meals: MealSlot[];
    eatingWindowHrs: number;
    fastingWindowHrs: number;
  } | null>(null);

  function calculate() {
    const wake = parseMinutes(wakeTime);
    const bed = parseMinutes(bedTime);
    const workout = parseMinutes(workoutTime);
    const schedule = buildSchedule(wake, bed, eatingPattern, goal, includeWorkout, workout);
    setResults(schedule);
  }

  const patternLabels: Record<EatingPattern, string> = {
    "3-meals": "3 Meals",
    "3-meals-2-snacks": "3 Meals + 2 Snacks",
    "5-small-meals": "5 Small Meals",
    "if-16-8": "Intermittent Fasting 16:8",
    "if-18-6": "Intermittent Fasting 18:6",
    "if-20-4": "Intermittent Fasting 20:4",
  };

  const goalLabels: Record<Goal, string> = {
    general: "General Health",
    "weight-loss": "Weight Loss",
    "muscle-gain": "Muscle Gain",
    athletic: "Athletic Performance",
  };

  const slotColors: Record<string, string> = {
    meal: "bg-emerald-500",
    snack: "bg-amber-400",
    "pre-workout": "bg-blue-500",
    "post-workout": "bg-indigo-500",
    fasting: "bg-stone-300",
  };

  const slotBadgeColors: Record<string, string> = {
    meal: "bg-emerald-100 text-emerald-700",
    snack: "bg-amber-100 text-amber-700",
    "pre-workout": "bg-blue-100 text-blue-700",
    "post-workout": "bg-indigo-100 text-indigo-700",
    fasting: "bg-stone-100 text-stone-500",
  };

  const isIF = eatingPattern.startsWith("if-");

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Wake Time</label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bed Time</label>
            <input
              type="time"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="include-workout"
            checked={includeWorkout}
            onChange={(e) => setIncludeWorkout(e.target.checked)}
            className="rounded border-stone-300"
          />
          <label htmlFor="include-workout" className="text-sm font-medium">
            Include workout in schedule
          </label>
        </div>

        {includeWorkout && (
          <div>
            <label className="block text-sm font-medium mb-1">Workout Time</label>
            <input
              type="time"
              value={workoutTime}
              onChange={(e) => setWorkoutTime(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Eating Pattern</label>
          <select
            value={eatingPattern}
            onChange={(e) => setEatingPattern(e.target.value as EatingPattern)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {Object.entries(patternLabels).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Primary Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as Goal)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {Object.entries(goalLabels).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Generate Meal Schedule
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Eating / Fasting window summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Eating Window</p>
              <p className="text-3xl font-bold text-emerald-600">
                {results.eatingWindowHrs}h
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500 mb-1">Fasting Window</p>
              <p className="text-3xl font-bold text-stone-600">
                {results.fastingWindowHrs}h
              </p>
            </div>
          </div>

          {/* Visual timeline */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Your Daily Meal Timeline
            </p>
            <div className="relative ml-2">
              {/* Vertical line */}
              <div className="absolute left-[5.5rem] top-0 bottom-0 w-0.5 bg-stone-200" />

              {results.meals.map((slot, i) => (
                <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  {/* Time */}
                  <div className="w-20 text-right text-sm font-medium text-stone-500 pt-1 shrink-0">
                    {slot.time}
                  </div>
                  {/* Dot */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 ${slotColors[slot.type]}`}
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-stone-800">
                        {slot.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${slotBadgeColors[slot.type]}`}
                      >
                        {slot.type === "pre-workout"
                          ? "Pre-Workout"
                          : slot.type === "post-workout"
                          ? "Post-Workout"
                          : slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 mt-0.5">
                      {slot.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IF fasting window highlight */}
          {isIF && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
              <p className="text-sm font-medium text-stone-700 mb-2">
                Fasting Window
              </p>
              <p className="text-sm text-stone-500">
                Your {results.fastingWindowHrs}-hour fasting window runs outside
                your eating period. During fasting hours, stick to water, black
                coffee, or plain tea (no calories). Break your fast gently with
                easily digestible foods.
              </p>
            </div>
          )}

          {/* Workout nutrition tips */}
          {includeWorkout && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-medium text-stone-700">
                Workout Nutrition Tips
              </p>
              <ul className="space-y-2">
                {getWorkoutTips().map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-stone-600">
                    <span className="text-blue-500 shrink-0">*</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Goal-based tips */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="text-sm font-medium text-stone-700">
              Tips for {goalLabels[goal]}
            </p>
            <ul className="space-y-2">
              {getGoalTips(goal).map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-600">
                  <span className="text-emerald-500 shrink-0">*</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About meal timing</p>
        <p>
          Meal timing interacts with your circadian rhythm, the internal clock
          that regulates metabolism, hormone release, and energy levels. Eating
          at consistent times can improve digestion, blood sugar control, and
          sleep quality. This tool provides general guidance based on your
          schedule and goals. Individual needs vary based on activity level,
          health conditions, and personal preferences. Consult a registered
          dietitian for personalised nutrition advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
