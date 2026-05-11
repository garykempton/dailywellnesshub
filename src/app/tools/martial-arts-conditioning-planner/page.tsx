"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("martial-arts-conditioning-planner")!;

type Discipline =
  | "boxing"
  | "muay-thai"
  | "bjj"
  | "karate-tkd"
  | "mma"
  | "general";
type Experience = "beginner" | "intermediate" | "advanced";
type Goal = "general-fitness" | "competition-prep" | "strength-power" | "endurance";

const DISCIPLINE_LABELS: Record<Discipline, string> = {
  boxing: "Boxing",
  "muay-thai": "Muay Thai",
  bjj: "BJJ/Grappling",
  "karate-tkd": "Karate/TKD",
  mma: "MMA",
  general: "General Martial Arts",
};

const EXPERIENCE_LABELS: Record<Experience, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const GOAL_LABELS: Record<Goal, string> = {
  "general-fitness": "General Fitness",
  "competition-prep": "Competition Prep",
  "strength-power": "Strength & Power",
  endurance: "Endurance",
};

type SessionType = "strength" | "cardio" | "power" | "recovery";

interface Exercise {
  name: string;
  prescription: string;
}

interface DayPlan {
  day: string;
  sessionType: SessionType;
  sessionLabel: string;
  exercises: Exercise[];
  estimatedTime: string;
}

const SESSION_COLORS: Record<SessionType, string> = {
  strength: "border-blue-500",
  cardio: "border-red-500",
  power: "border-amber-500",
  recovery: "border-green-500",
};

const SESSION_BG: Record<SessionType, string> = {
  strength: "bg-blue-50 text-blue-700",
  cardio: "bg-red-50 text-red-700",
  power: "bg-amber-50 text-amber-700",
  recovery: "bg-green-50 text-green-700",
};

const STRENGTH_EXERCISES: Exercise[] = [
  { name: "Squats", prescription: "4x8" },
  { name: "Deadlifts", prescription: "3x5" },
  { name: "Pull-ups", prescription: "3xmax" },
  { name: "Bench Press", prescription: "3x8" },
  { name: "Rows", prescription: "3x10" },
  { name: "Overhead Press", prescription: "3x8" },
];

const CARDIO_EXERCISES: Exercise[] = [
  { name: "Jump Rope", prescription: "3x3min" },
  { name: "Heavy Bag", prescription: "5x3min" },
  { name: "Shuttle Runs", prescription: "6x30s" },
  { name: "Burpees", prescription: "3x15" },
  { name: "Mountain Climbers", prescription: "3x45s" },
  { name: "Battle Ropes", prescription: "3x30s" },
];

const POWER_EXERCISES: Exercise[] = [
  { name: "Box Jumps", prescription: "4x5" },
  { name: "Medicine Ball Slams", prescription: "3x10" },
  { name: "Kettlebell Swings", prescription: "4x12" },
  { name: "Plyometric Push-ups", prescription: "3x8" },
  { name: "Broad Jumps", prescription: "3x5" },
  { name: "Clean & Press", prescription: "3x5" },
];

const RECOVERY_EXERCISES: Exercise[] = [
  { name: "Foam Rolling", prescription: "10min" },
  { name: "Hip Mobility Flow", prescription: "10min" },
  { name: "Shoulder Mobility", prescription: "10min" },
  { name: "Yoga Flow", prescription: "20min" },
  { name: "Static Stretching", prescription: "15min" },
];

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function pickExercises(
  pool: Exercise[],
  count: number,
  experience: Experience
): Exercise[] {
  const selected: Exercise[] = [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const ex = { ...shuffled[i] };
    // Adjust volume for beginner (reduce sets)
    if (experience === "beginner" && ex.prescription.includes("x")) {
      ex.prescription = ex.prescription.replace(/^[45]/, "3");
    }
    if (experience === "advanced" && ex.prescription.match(/^3x/)) {
      ex.prescription = ex.prescription.replace(/^3/, "4");
    }
    selected.push(ex);
  }
  return selected;
}

function estimateTime(exercises: Exercise[]): string {
  let minutes = 0;
  for (const ex of exercises) {
    const minMatch = ex.prescription.match(/(\d+)min/);
    if (minMatch) {
      minutes += parseInt(minMatch[1]);
      continue;
    }
    const setsMatch = ex.prescription.match(/^(\d+)x/);
    if (setsMatch) {
      const sets = parseInt(setsMatch[1]);
      minutes += sets * 3; // ~3 min per set including rest
    }
  }
  return `~${minutes} min`;
}

function generatePlan(
  _discipline: Discipline,
  experience: Experience,
  goal: Goal,
  daysPerWeek: number
): DayPlan[] {
  // Determine session type distribution based on goal
  let sessionPattern: SessionType[];

  switch (goal) {
    case "strength-power":
      sessionPattern = ["strength", "power", "strength", "cardio", "power"];
      break;
    case "endurance":
      sessionPattern = ["cardio", "strength", "cardio", "cardio", "power"];
      break;
    case "competition-prep":
      sessionPattern = ["cardio", "power", "strength", "cardio", "power"];
      break;
    default: // general-fitness
      sessionPattern = ["strength", "cardio", "power", "strength", "cardio"];
      break;
  }

  // Clamp days based on experience
  let effectiveDays = daysPerWeek;
  if (experience === "beginner") {
    effectiveDays = Math.min(effectiveDays, 3);
  }

  // Always include a recovery day if 4+ days
  const includeRecovery = effectiveDays >= 4;
  const trainingDays = includeRecovery ? effectiveDays - 1 : effectiveDays;

  const plan: DayPlan[] = [];

  // Spread days across the week
  const spacing = Math.floor(7 / effectiveDays);
  const usedDayIndices: number[] = [];
  for (let i = 0; i < effectiveDays; i++) {
    const idx = Math.min((i * spacing) + (i > 0 ? 1 : 0), 6);
    usedDayIndices.push(idx < 7 ? idx : 6);
  }
  // Deduplicate and ensure we have enough days
  const uniqueDays = [...new Set(usedDayIndices)];
  while (uniqueDays.length < effectiveDays && uniqueDays.length < 7) {
    for (let d = 0; d < 7; d++) {
      if (!uniqueDays.includes(d)) {
        uniqueDays.push(d);
        break;
      }
    }
  }
  uniqueDays.sort((a, b) => a - b);

  const exerciseCount = experience === "beginner" ? 4 : experience === "intermediate" ? 5 : 6;

  for (let i = 0; i < effectiveDays; i++) {
    const dayIndex = uniqueDays[i];
    const isRecoveryDay = includeRecovery && i === effectiveDays - 1;

    let sessionType: SessionType;
    let exercises: Exercise[];

    if (isRecoveryDay) {
      sessionType = "recovery";
      exercises = pickExercises(RECOVERY_EXERCISES, Math.min(exerciseCount, 4), experience);
    } else {
      sessionType = sessionPattern[i % sessionPattern.length];
      const pool =
        sessionType === "strength"
          ? STRENGTH_EXERCISES
          : sessionType === "cardio"
          ? CARDIO_EXERCISES
          : POWER_EXERCISES;
      exercises = pickExercises(pool, exerciseCount, experience);
    }

    const sessionLabels: Record<SessionType, string> = {
      strength: "Strength",
      cardio: "Cardio",
      power: "Power",
      recovery: "Active Recovery",
    };

    plan.push({
      day: DAY_NAMES[dayIndex],
      sessionType,
      sessionLabel: sessionLabels[sessionType],
      exercises,
      estimatedTime: estimateTime(exercises),
    });
  }

  return plan;
}

export default function MartialArtsConditioningPlannerPage() {
  const [discipline, setDiscipline] = useState<Discipline>("mma");
  const [experience, setExperience] = useState<Experience>("intermediate");
  const [goal, setGoal] = useState<Goal>("general-fitness");
  const [daysPerWeek, setDaysPerWeek] = useState("3");
  const [plan, setPlan] = useState<DayPlan[] | null>(null);

  function handleGenerate() {
    const days = parseInt(daysPerWeek);
    if (!days) return;
    const result = generatePlan(discipline, experience, goal, days);
    setPlan(result);
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        {/* Discipline */}
        <div>
          <label className="block text-sm font-medium mb-1">Discipline</label>
          <select
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value as Discipline)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {(Object.keys(DISCIPLINE_LABELS) as Discipline[]).map((d) => (
              <option key={d} value={d}>
                {DISCIPLINE_LABELS[d]}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level - Pill Buttons */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Experience Level
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EXPERIENCE_LABELS) as Experience[]).map((e) => (
              <button
                key={e}
                onClick={() => setExperience(e)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  experience === e
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {EXPERIENCE_LABELS[e]}
              </button>
            ))}
          </div>
        </div>

        {/* Goal - Pill Buttons */}
        <div>
          <label className="block text-sm font-medium mb-2">Goal</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  goal === g
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Available Days */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Available Days Per Week
          </label>
          <select
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          >
            {["2", "3", "4", "5"].map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Generate Plan
        </button>
      </div>

      {/* Plan Results */}
      {plan && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-center text-stone-700">
            Your {DISCIPLINE_LABELS[discipline]} Conditioning Plan &mdash;{" "}
            {EXPERIENCE_LABELS[experience]} / {GOAL_LABELS[goal]}
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.map((day, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl border border-stone-200 border-t-4 ${SESSION_COLORS[day.sessionType]} overflow-hidden`}
              >
                {/* Day Header */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <h4 className="font-bold text-stone-800">{day.day}</h4>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${SESSION_BG[day.sessionType]}`}
                  >
                    {day.sessionLabel}
                  </span>
                </div>

                {/* Exercises */}
                <ul className="px-4 pb-3 space-y-1.5">
                  {day.exercises.map((ex, j) => (
                    <li
                      key={j}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-stone-700">{ex.name}</span>
                      <span className="text-stone-400 font-mono text-xs">
                        {ex.prescription}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="bg-stone-50 px-4 py-2 text-xs text-stone-400 border-t border-stone-100">
                  Estimated: {day.estimatedTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
