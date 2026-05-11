"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("workout-split-generator")!;

type Experience = "beginner" | "intermediate" | "advanced";
type Goal = "strength" | "muscle_gain" | "fat_loss" | "general";
type Equipment = "full_gym" | "home_gym" | "bodyweight";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
}

interface TrainingDay {
  label: string;
  muscles: string;
  exercises: Exercise[];
}

interface SplitResult {
  days: (TrainingDay | null)[];
  summary: { muscle: string; sets: number }[];
  restGuidance: string;
}

// Exercise database by muscle group
const DB_CHEST_GYM = ["Bench Press", "Incline Dumbbell Press", "Dumbbell Fly", "Cable Crossover", "Dips"];
const DB_CHEST_HOME = ["Dumbbell Bench Press", "Incline Dumbbell Press", "Dumbbell Fly", "Push-Ups", "Dips"];
const DB_CHEST_BW = ["Push-Ups", "Wide Push-Ups", "Decline Push-Ups", "Diamond Push-Ups", "Dips"];

const DB_BACK_GYM = ["Barbell Row", "Lat Pulldown", "Cable Row", "Dumbbell Row", "Face Pulls", "Pull-Ups"];
const DB_BACK_HOME = ["Dumbbell Row", "Pull-Ups", "Inverted Rows", "Face Pulls", "Resistance Band Pulldown"];
const DB_BACK_BW = ["Pull-Ups", "Inverted Rows", "Superman Hold", "Doorframe Rows", "Wide Pull-Ups"];

const DB_SHOULDERS_GYM = ["Overhead Press", "Lateral Raise", "Front Raise", "Face Pull", "Arnold Press"];
const DB_SHOULDERS_HOME = ["Dumbbell Overhead Press", "Lateral Raise", "Front Raise", "Arnold Press", "Band Pull-Apart"];
const DB_SHOULDERS_BW = ["Pike Push-Ups", "Handstand Hold", "Lateral Plank Walk", "Arm Circles with Pause", "Decline Pike Push-Ups"];

const DB_BICEPS_GYM = ["Barbell Curl", "Dumbbell Curl", "Hammer Curl", "Concentration Curl"];
const DB_BICEPS_HOME = ["Dumbbell Curl", "Hammer Curl", "Concentration Curl", "Resistance Band Curl"];
const DB_BICEPS_BW = ["Chin-Ups", "Inverted Curl Rows", "Isometric Towel Curl", "Doorframe Curls"];

const DB_TRICEPS_GYM = ["Tricep Pushdown", "Overhead Extension", "Skull Crusher", "Close-Grip Bench Press", "Dips"];
const DB_TRICEPS_HOME = ["Overhead Dumbbell Extension", "Dumbbell Kickback", "Close-Grip Push-Ups", "Dips", "Band Pushdown"];
const DB_TRICEPS_BW = ["Diamond Push-Ups", "Bench Dips", "Close-Grip Push-Ups", "Tricep Bodyweight Extension"];

const DB_QUADS_GYM = ["Squat", "Leg Press", "Lunges", "Leg Extension", "Goblet Squat", "Step-Ups"];
const DB_QUADS_HOME = ["Goblet Squat", "Dumbbell Lunges", "Step-Ups", "Bulgarian Split Squat", "Sissy Squat"];
const DB_QUADS_BW = ["Bodyweight Squat", "Lunges", "Step-Ups", "Bulgarian Split Squat", "Jump Squats", "Pistol Squat Progression"];

const DB_HAMS_GYM = ["Romanian Deadlift", "Leg Curl", "Deadlift", "Hip Thrust", "Glute Bridge"];
const DB_HAMS_HOME = ["Dumbbell Romanian Deadlift", "Glute Bridge", "Hip Thrust", "Single-Leg Deadlift", "Slider Leg Curl"];
const DB_HAMS_BW = ["Glute Bridge", "Single-Leg Glute Bridge", "Nordic Curl Progression", "Hip Thrust", "Good Morning"];

const DB_CALVES_GYM = ["Standing Calf Raise", "Seated Calf Raise"];
const DB_CALVES_HOME = ["Dumbbell Calf Raise", "Seated Calf Raise"];
const DB_CALVES_BW = ["Bodyweight Calf Raise", "Single-Leg Calf Raise"];

const DB_CORE = ["Plank", "Crunches", "Leg Raises", "Russian Twist", "Dead Bug"];
const DB_CORE_BW = ["Plank", "Crunches", "Leg Raises", "Russian Twist", "Mountain Climbers", "Dead Bug"];

function getExercises(
  muscle: string,
  equipment: Equipment,
): string[] {
  const map: Record<string, Record<Equipment, string[]>> = {
    chest: { full_gym: DB_CHEST_GYM, home_gym: DB_CHEST_HOME, bodyweight: DB_CHEST_BW },
    back: { full_gym: DB_BACK_GYM, home_gym: DB_BACK_HOME, bodyweight: DB_BACK_BW },
    shoulders: { full_gym: DB_SHOULDERS_GYM, home_gym: DB_SHOULDERS_HOME, bodyweight: DB_SHOULDERS_BW },
    biceps: { full_gym: DB_BICEPS_GYM, home_gym: DB_BICEPS_HOME, bodyweight: DB_BICEPS_BW },
    triceps: { full_gym: DB_TRICEPS_GYM, home_gym: DB_TRICEPS_HOME, bodyweight: DB_TRICEPS_BW },
    quads: { full_gym: DB_QUADS_GYM, home_gym: DB_QUADS_HOME, bodyweight: DB_QUADS_BW },
    hamstrings: { full_gym: DB_HAMS_GYM, home_gym: DB_HAMS_HOME, bodyweight: DB_HAMS_BW },
    calves: { full_gym: DB_CALVES_GYM, home_gym: DB_CALVES_HOME, bodyweight: DB_CALVES_BW },
    core: { full_gym: DB_CORE, home_gym: DB_CORE, bodyweight: DB_CORE_BW },
  };
  return map[muscle]?.[equipment] ?? [];
}

function repRange(goal: Goal): string {
  switch (goal) {
    case "strength":
      return "3-6";
    case "muscle_gain":
      return "8-12";
    case "fat_loss":
      return "12-15";
    case "general":
      return "8-12";
  }
}

function setsForGoal(goal: Goal): number {
  switch (goal) {
    case "strength":
      return 4;
    case "muscle_gain":
      return 4;
    case "fat_loss":
      return 3;
    case "general":
      return 3;
  }
}

function pick(arr: string[], count: number, seed: number): string[] {
  // Simple shuffle using seed
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1) * 2654435761) % (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function buildExercises(
  muscles: { muscle: string; count: number }[],
  equipment: Equipment,
  goal: Goal,
  seed: number,
): Exercise[] {
  const reps = repRange(goal);
  const sets = setsForGoal(goal);
  const result: Exercise[] = [];
  muscles.forEach((m, mi) => {
    const pool = getExercises(m.muscle, equipment);
    const selected = pick(pool, m.count, seed + mi * 7);
    selected.forEach((name) => {
      result.push({ name, sets, reps });
    });
  });
  return result;
}

function generateSplit(
  trainingDays: number,
  experience: Experience,
  goal: Goal,
  equipment: Equipment,
  seed: number,
): SplitResult {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let structure: { label: string; muscles: string; muscleList: { muscle: string; count: number }[] }[] = [];

  if (trainingDays === 2) {
    structure = [
      {
        label: "Full Body A",
        muscles: "Full Body",
        muscleList: [
          { muscle: "chest", count: 2 }, { muscle: "back", count: 2 },
          { muscle: "quads", count: 2 }, { muscle: "shoulders", count: 1 },
          { muscle: "core", count: 1 },
        ],
      },
      {
        label: "Full Body B",
        muscles: "Full Body",
        muscleList: [
          { muscle: "back", count: 2 }, { muscle: "chest", count: 1 },
          { muscle: "hamstrings", count: 2 }, { muscle: "shoulders", count: 1 },
          { muscle: "biceps", count: 1 }, { muscle: "core", count: 1 },
        ],
      },
    ];
  } else if (trainingDays === 3) {
    if (experience === "beginner") {
      structure = [
        {
          label: "Full Body A",
          muscles: "Full Body",
          muscleList: [
            { muscle: "chest", count: 2 }, { muscle: "back", count: 2 },
            { muscle: "quads", count: 2 }, { muscle: "core", count: 1 },
          ],
        },
        {
          label: "Full Body B",
          muscles: "Full Body",
          muscleList: [
            { muscle: "shoulders", count: 2 }, { muscle: "back", count: 1 },
            { muscle: "hamstrings", count: 2 }, { muscle: "biceps", count: 1 },
            { muscle: "triceps", count: 1 },
          ],
        },
        {
          label: "Full Body C",
          muscles: "Full Body",
          muscleList: [
            { muscle: "chest", count: 1 }, { muscle: "back", count: 2 },
            { muscle: "quads", count: 1 }, { muscle: "hamstrings", count: 1 },
            { muscle: "shoulders", count: 1 }, { muscle: "core", count: 1 },
          ],
        },
      ];
    } else {
      structure = [
        {
          label: "Push (Chest, Shoulders, Triceps)",
          muscles: "Chest, Shoulders, Triceps",
          muscleList: [
            { muscle: "chest", count: 3 }, { muscle: "shoulders", count: 2 },
            { muscle: "triceps", count: 2 },
          ],
        },
        {
          label: "Pull (Back, Biceps)",
          muscles: "Back, Biceps",
          muscleList: [
            { muscle: "back", count: 4 }, { muscle: "biceps", count: 2 },
          ],
        },
        {
          label: "Legs (Quads, Hamstrings, Calves)",
          muscles: "Quads, Hamstrings, Calves",
          muscleList: [
            { muscle: "quads", count: 3 }, { muscle: "hamstrings", count: 2 },
            { muscle: "calves", count: 1 }, { muscle: "core", count: 1 },
          ],
        },
      ];
    }
  } else if (trainingDays === 4) {
    structure = [
      {
        label: "Upper Body A",
        muscles: "Chest, Back, Shoulders, Arms",
        muscleList: [
          { muscle: "chest", count: 2 }, { muscle: "back", count: 2 },
          { muscle: "shoulders", count: 1 }, { muscle: "biceps", count: 1 },
          { muscle: "triceps", count: 1 },
        ],
      },
      {
        label: "Lower Body A",
        muscles: "Quads, Hamstrings, Calves, Core",
        muscleList: [
          { muscle: "quads", count: 3 }, { muscle: "hamstrings", count: 2 },
          { muscle: "calves", count: 1 }, { muscle: "core", count: 1 },
        ],
      },
      {
        label: "Upper Body B",
        muscles: "Chest, Back, Shoulders, Arms",
        muscleList: [
          { muscle: "back", count: 2 }, { muscle: "chest", count: 2 },
          { muscle: "shoulders", count: 2 }, { muscle: "triceps", count: 1 },
        ],
      },
      {
        label: "Lower Body B",
        muscles: "Quads, Hamstrings, Calves, Core",
        muscleList: [
          { muscle: "hamstrings", count: 2 }, { muscle: "quads", count: 2 },
          { muscle: "calves", count: 1 }, { muscle: "core", count: 2 },
        ],
      },
    ];
  } else if (trainingDays === 5) {
    structure = [
      {
        label: "Push (Chest, Shoulders, Triceps)",
        muscles: "Chest, Shoulders, Triceps",
        muscleList: [
          { muscle: "chest", count: 3 }, { muscle: "shoulders", count: 2 },
          { muscle: "triceps", count: 2 },
        ],
      },
      {
        label: "Pull (Back, Biceps)",
        muscles: "Back, Biceps",
        muscleList: [
          { muscle: "back", count: 4 }, { muscle: "biceps", count: 2 },
          { muscle: "core", count: 1 },
        ],
      },
      {
        label: "Legs",
        muscles: "Quads, Hamstrings, Calves",
        muscleList: [
          { muscle: "quads", count: 3 }, { muscle: "hamstrings", count: 2 },
          { muscle: "calves", count: 1 }, { muscle: "core", count: 1 },
        ],
      },
      {
        label: "Upper Body",
        muscles: "Chest, Back, Shoulders, Arms",
        muscleList: [
          { muscle: "chest", count: 2 }, { muscle: "back", count: 2 },
          { muscle: "shoulders", count: 1 }, { muscle: "biceps", count: 1 },
          { muscle: "triceps", count: 1 },
        ],
      },
      {
        label: "Lower Body",
        muscles: "Quads, Hamstrings, Glutes",
        muscleList: [
          { muscle: "quads", count: 2 }, { muscle: "hamstrings", count: 2 },
          { muscle: "calves", count: 1 }, { muscle: "core", count: 2 },
        ],
      },
    ];
  } else {
    // 6 days: PPL x 2
    structure = [
      {
        label: "Push A (Chest, Shoulders, Triceps)",
        muscles: "Chest, Shoulders, Triceps",
        muscleList: [
          { muscle: "chest", count: 3 }, { muscle: "shoulders", count: 2 },
          { muscle: "triceps", count: 2 },
        ],
      },
      {
        label: "Pull A (Back, Biceps)",
        muscles: "Back, Biceps",
        muscleList: [
          { muscle: "back", count: 4 }, { muscle: "biceps", count: 2 },
        ],
      },
      {
        label: "Legs A (Quads, Hamstrings, Calves)",
        muscles: "Quads, Hamstrings, Calves",
        muscleList: [
          { muscle: "quads", count: 3 }, { muscle: "hamstrings", count: 2 },
          { muscle: "calves", count: 1 }, { muscle: "core", count: 1 },
        ],
      },
      {
        label: "Push B (Chest, Shoulders, Triceps)",
        muscles: "Chest, Shoulders, Triceps",
        muscleList: [
          { muscle: "chest", count: 2 }, { muscle: "shoulders", count: 2 },
          { muscle: "triceps", count: 2 }, { muscle: "core", count: 1 },
        ],
      },
      {
        label: "Pull B (Back, Biceps, Rear Delts)",
        muscles: "Back, Biceps",
        muscleList: [
          { muscle: "back", count: 3 }, { muscle: "biceps", count: 2 },
          { muscle: "shoulders", count: 1 },
        ],
      },
      {
        label: "Legs B (Quads, Hamstrings, Calves)",
        muscles: "Quads, Hamstrings, Calves",
        muscleList: [
          { muscle: "hamstrings", count: 3 }, { muscle: "quads", count: 2 },
          { muscle: "calves", count: 1 }, { muscle: "core", count: 1 },
        ],
      },
    ];
  }

  // Build training days mapped to the week
  const days: (TrainingDay | null)[] = [];
  let trainingIndex = 0;

  // Distribute training days across the week
  const daySlots: boolean[] = new Array(7).fill(false);
  if (trainingDays <= 3) {
    // Spread evenly
    const gap = Math.floor(7 / trainingDays);
    for (let i = 0; i < trainingDays; i++) {
      daySlots[Math.min(i * gap, 6)] = true;
    }
  } else if (trainingDays === 4) {
    [0, 1, 3, 4].forEach((i) => (daySlots[i] = true));
  } else if (trainingDays === 5) {
    [0, 1, 2, 3, 4].forEach((i) => (daySlots[i] = true));
  } else {
    [0, 1, 2, 3, 4, 5].forEach((i) => (daySlots[i] = true));
  }

  for (let d = 0; d < 7; d++) {
    if (daySlots[d] && trainingIndex < structure.length) {
      const s = structure[trainingIndex];
      days.push({
        label: `${weekDays[d]} - ${s.label}`,
        muscles: s.muscles,
        exercises: buildExercises(s.muscleList, equipment, goal, seed + trainingIndex * 31),
      });
      trainingIndex++;
    } else {
      days.push(null);
    }
  }

  // Calculate weekly volume summary
  const muscleSets: Record<string, number> = {};
  structure.forEach((s) => {
    s.muscleList.forEach((m) => {
      const sets = m.count * setsForGoal(goal);
      muscleSets[m.muscle] = (muscleSets[m.muscle] || 0) + sets;
    });
  });
  const summary = Object.entries(muscleSets)
    .map(([muscle, sets]) => ({ muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1), sets }))
    .sort((a, b) => b.sets - a.sets);

  const restGuidance =
    trainingDays <= 3
      ? "Take at least one full rest day between training sessions. Use rest days for light walking, stretching, or mobility work."
      : trainingDays <= 5
        ? "Schedule at least 1-2 rest days per week. Avoid training the same muscle groups on consecutive days when possible."
        : "With 6 training days, ensure your one rest day is a true recovery day. Prioritise sleep, nutrition, and light stretching.";

  return { days, summary, restGuidance };
}

const GOAL_LABELS: Record<Goal, string> = {
  strength: "Strength",
  muscle_gain: "Muscle Gain",
  fat_loss: "Fat Loss",
  general: "General Fitness",
};

const EQUIPMENT_LABELS: Record<Equipment, string> = {
  full_gym: "Full Gym",
  home_gym: "Home Gym with Basics",
  bodyweight: "Bodyweight Only",
};

export default function WorkoutSplitGeneratorPage() {
  const [trainingDays, setTrainingDays] = useState(4);
  const [experience, setExperience] = useState<Experience>("intermediate");
  const [goal, setGoal] = useState<Goal>("muscle_gain");
  const [equipment, setEquipment] = useState<Equipment>("full_gym");

  const [result, setResult] = useState<SplitResult | null>(null);
  const [seed, setSeed] = useState(1);

  function generate() {
    const newSeed = Date.now() % 100000;
    setSeed(newSeed);
    setResult(generateSplit(trainingDays, experience, goal, equipment, newSeed));
  }

  function regenerate() {
    const newSeed = seed + 97;
    setSeed(newSeed);
    setResult(generateSplit(trainingDays, experience, goal, equipment, newSeed));
  }

  return (
    <ToolPageLayout tool={tool}>
      {!result && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          {/* Training days */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Training Days per Week</p>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6].map((d) => (
                <button
                  key={d}
                  onClick={() => setTrainingDays(d)}
                  className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                    trainingDays === d
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 text-stone-600 hover:border-stone-500"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Experience Level</p>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value as Experience)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Primary Goal</p>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              <option value="muscle_gain">Muscle Gain</option>
              <option value="fat_loss">Fat Loss</option>
              <option value="strength">Strength</option>
              <option value="general">General Fitness</option>
            </select>
          </div>

          {/* Equipment */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Equipment Access</p>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value as Equipment)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              <option value="full_gym">Full Gym</option>
              <option value="home_gym">Home Gym with Basics</option>
              <option value="bodyweight">Bodyweight Only</option>
            </select>
          </div>

          <button
            onClick={generate}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Generate Split
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Header summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-600">
            <span>
              <span className="font-semibold text-stone-800">{trainingDays}</span> days/week
            </span>
            <span>
              <span className="font-semibold text-stone-800">{experience}</span> level
            </span>
            <span>
              Goal: <span className="font-semibold text-stone-800">{GOAL_LABELS[goal]}</span>
            </span>
            <span>
              Equipment: <span className="font-semibold text-stone-800">{EQUIPMENT_LABELS[equipment]}</span>
            </span>
          </div>

          {/* Weekly schedule cards */}
          {result.days.map((day, i) => {
            const weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i];
            if (!day) {
              return (
                <div
                  key={i}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center"
                >
                  <p className="font-medium text-stone-400">{weekDay} - Rest Day</p>
                  <p className="text-xs text-stone-400 mt-1">Recovery and mobility</p>
                </div>
              );
            }
            return (
              <div
                key={i}
                className="bg-white border border-stone-200 rounded-xl p-6 space-y-4"
              >
                <div>
                  <p className="font-semibold text-stone-800 text-lg">{day.label}</p>
                  <p className="text-sm text-stone-500">{day.muscles}</p>
                </div>
                <div className="divide-y divide-stone-100">
                  {day.exercises.map((ex, j) => (
                    <div key={j} className="flex items-center justify-between py-2">
                      <span className="text-stone-700">{ex.name}</span>
                      <span className="text-sm text-stone-500 font-medium whitespace-nowrap ml-4">
                        {ex.sets} x {ex.reps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Weekly volume summary */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <p className="font-semibold text-stone-800">Weekly Volume Summary</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {result.summary.map((s) => (
                <div key={s.muscle} className="bg-stone-50 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-stone-700">{s.muscle}</p>
                  <p className="text-lg font-bold text-stone-800">{s.sets} sets</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rest guidance */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-600">
            <p className="font-semibold text-stone-700 mb-1">Rest Day Guidance</p>
            <p>{result.restGuidance}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={regenerate}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Regenerate Exercises
            </button>
            <button
              onClick={() => setResult(null)}
              className="flex-1 border border-stone-300 py-3 rounded-lg font-medium text-stone-600 hover:border-stone-500 transition-colors"
            >
              Change Settings
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About workout splits</p>
        <p>
          A workout split divides your weekly training across different muscle
          groups and sessions. The right split depends on how many days you can
          train, your experience level, and your goals. Beginners generally
          benefit from full-body routines that train each muscle group multiple
          times per week, while more experienced lifters may prefer push/pull/legs
          or upper/lower splits for greater training volume per muscle. This tool
          is for informational purposes only and does not replace professional
          coaching.
        </p>
      </div>
    </ToolPageLayout>
  );
}
