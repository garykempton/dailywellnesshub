"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("stretching-routine-generator")!;

type Level = "beginner" | "intermediate" | "advanced";
type Purpose = "morning" | "pre-workout" | "post-workout" | "desk-break" | "before-bed";
type BodyArea =
  | "neck-shoulders"
  | "upper-back"
  | "lower-back"
  | "chest"
  | "hips"
  | "hamstrings"
  | "quads"
  | "calves";

interface Stretch {
  name: string;
  bodyArea: BodyArea;
  bodyAreaLabel: string;
  duration: number;
  description: string;
  level: Level;
  isDynamic?: boolean;
}

const BODY_AREAS: { key: BodyArea; label: string }[] = [
  { key: "neck-shoulders", label: "Neck & Shoulders" },
  { key: "upper-back", label: "Upper Back" },
  { key: "lower-back", label: "Lower Back" },
  { key: "chest", label: "Chest" },
  { key: "hips", label: "Hips & Hip Flexors" },
  { key: "hamstrings", label: "Hamstrings" },
  { key: "quads", label: "Quads & Thighs" },
  { key: "calves", label: "Calves & Ankles" },
];

const TIME_OPTIONS = [5, 10, 15, 20, 30];

const STRETCHES: Stretch[] = [
  // Neck & Shoulders
  { name: "Neck Rolls", bodyArea: "neck-shoulders", bodyAreaLabel: "Neck & Shoulders", duration: 20, description: "Slowly roll your head in a full circle, spending a few seconds in each position. Reverse direction halfway.", level: "beginner", isDynamic: true },
  { name: "Chin Tucks", bodyArea: "neck-shoulders", bodyAreaLabel: "Neck & Shoulders", duration: 15, description: "Pull your chin straight back, creating a double chin. Hold and feel the stretch at the base of your skull.", level: "beginner" },
  { name: "Ear-to-Shoulder Stretch", bodyArea: "neck-shoulders", bodyAreaLabel: "Neck & Shoulders", duration: 20, description: "Tilt your head to one side, bringing your ear toward your shoulder. Gently press with your hand for a deeper stretch. Repeat both sides.", level: "beginner" },
  { name: "Cross-Body Shoulder Stretch", bodyArea: "neck-shoulders", bodyAreaLabel: "Neck & Shoulders", duration: 20, description: "Bring one arm across your chest and gently pull it closer with the opposite hand. Hold and switch sides.", level: "beginner" },
  { name: "Shoulder Circles", bodyArea: "neck-shoulders", bodyAreaLabel: "Neck & Shoulders", duration: 15, description: "Roll both shoulders forward in large circles, then reverse. Keep movements slow and controlled.", level: "beginner", isDynamic: true },
  { name: "Neck Flexion Hold", bodyArea: "neck-shoulders", bodyAreaLabel: "Neck & Shoulders", duration: 25, description: "Gently tuck your chin to your chest and clasp your hands behind your head. Let the weight of your arms deepen the stretch.", level: "intermediate" },

  // Upper Back
  { name: "Cat-Cow Stretch", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", duration: 25, description: "On all fours, alternate between arching your back upward (cat) and dipping it down (cow). Move with your breath.", level: "beginner", isDynamic: true },
  { name: "Thoracic Rotation", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", duration: 25, description: "On all fours, place one hand behind your head and rotate your upper body, opening your chest toward the ceiling. Return and repeat.", level: "intermediate", isDynamic: true },
  { name: "Child's Pose", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", duration: 30, description: "Kneel and sit back on your heels, then walk your hands forward along the floor. Rest your forehead down and breathe deeply.", level: "beginner" },
  { name: "Seated Twist", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", duration: 25, description: "Sit cross-legged, place one hand on the opposite knee and twist your torso. Look over your back shoulder. Repeat both sides.", level: "beginner" },
  { name: "Thread the Needle", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", duration: 25, description: "From all fours, slide one arm under your body, lowering your shoulder to the floor. Hold and feel the upper back stretch. Switch sides.", level: "intermediate" },

  // Lower Back
  { name: "Knee-to-Chest Stretch", bodyArea: "lower-back", bodyAreaLabel: "Lower Back", duration: 25, description: "Lie on your back and pull one knee toward your chest with both hands. Keep the other leg flat. Hold and switch.", level: "beginner" },
  { name: "Supine Twist", bodyArea: "lower-back", bodyAreaLabel: "Lower Back", duration: 30, description: "Lie on your back with arms out. Drop both knees to one side while keeping shoulders flat. Hold and switch sides.", level: "beginner" },
  { name: "Pelvic Tilts", bodyArea: "lower-back", bodyAreaLabel: "Lower Back", duration: 20, description: "Lie on your back with knees bent. Flatten your lower back against the floor by tightening your abs, then release. Repeat rhythmically.", level: "beginner", isDynamic: true },
  { name: "Standing Forward Fold", bodyArea: "lower-back", bodyAreaLabel: "Lower Back", duration: 25, description: "Stand with feet hip-width apart and fold forward from the hips. Let your head and arms hang heavy. Bend knees slightly if needed.", level: "beginner" },
  { name: "Sphinx Pose", bodyArea: "lower-back", bodyAreaLabel: "Lower Back", duration: 30, description: "Lie face-down and prop yourself up on your forearms with elbows under shoulders. Gently press your chest forward and up.", level: "intermediate" },

  // Chest
  { name: "Doorway Chest Stretch", bodyArea: "chest", bodyAreaLabel: "Chest", duration: 25, description: "Stand in a doorway with your arm at 90 degrees on the frame. Step forward until you feel a stretch across your chest. Switch sides.", level: "beginner" },
  { name: "Chest Opener", bodyArea: "chest", bodyAreaLabel: "Chest", duration: 20, description: "Clasp your hands behind your back, straighten your arms, and lift them gently while squeezing your shoulder blades together.", level: "beginner" },
  { name: "Wall Chest Stretch", bodyArea: "chest", bodyAreaLabel: "Chest", duration: 25, description: "Place your palm flat on a wall at shoulder height. Slowly turn your body away until you feel a stretch in your chest and front shoulder.", level: "beginner" },
  { name: "Lying Chest Opener", bodyArea: "chest", bodyAreaLabel: "Chest", duration: 30, description: "Lie face-up on a foam roller along your spine. Let your arms fall open to the sides, palms up, and breathe deeply.", level: "intermediate" },

  // Hips & Hip Flexors
  { name: "Pigeon Pose", bodyArea: "hips", bodyAreaLabel: "Hips & Hip Flexors", duration: 30, description: "From a lunge, bring your front shin across the mat and lower your hips. Keep your back leg extended behind you. Hold each side.", level: "intermediate" },
  { name: "Butterfly Stretch", bodyArea: "hips", bodyAreaLabel: "Hips & Hip Flexors", duration: 25, description: "Sit with the soles of your feet together and knees out. Gently press your knees toward the floor using your elbows.", level: "beginner" },
  { name: "90/90 Stretch", bodyArea: "hips", bodyAreaLabel: "Hips & Hip Flexors", duration: 30, description: "Sit with both legs bent at 90 degrees, one in front and one to the side. Lean your torso forward over the front shin. Switch sides.", level: "advanced" },
  { name: "Hip Circles", bodyArea: "hips", bodyAreaLabel: "Hips & Hip Flexors", duration: 20, description: "Stand on one leg and make large circles with the opposite knee. Do 10 circles each direction, then switch legs.", level: "beginner", isDynamic: true },
  { name: "Lunge with Twist", bodyArea: "hips", bodyAreaLabel: "Hips & Hip Flexors", duration: 25, description: "Step into a deep lunge, then rotate your torso toward the front leg with arms extended. Hold briefly, then switch sides.", level: "intermediate", isDynamic: true },
  { name: "Low Lunge Hip Flexor Stretch", bodyArea: "hips", bodyAreaLabel: "Hips & Hip Flexors", duration: 30, description: "Kneel in a lunge with your back knee on the floor. Push your hips forward and squeeze your glute to deepen the hip flexor stretch.", level: "beginner" },

  // Hamstrings
  { name: "Standing Hamstring Stretch", bodyArea: "hamstrings", bodyAreaLabel: "Hamstrings", duration: 25, description: "Stand and place one heel on a low step or bench. Keep your leg straight and hinge forward at the hips. Switch sides.", level: "beginner" },
  { name: "Seated Forward Fold", bodyArea: "hamstrings", bodyAreaLabel: "Hamstrings", duration: 30, description: "Sit with legs extended straight. Hinge forward from your hips and reach toward your toes. Keep your back as flat as possible.", level: "beginner" },
  { name: "Towel Hamstring Stretch", bodyArea: "hamstrings", bodyAreaLabel: "Hamstrings", duration: 30, description: "Lie on your back, loop a towel around one foot, and gently pull the leg toward you while keeping it straight. Switch sides.", level: "beginner" },
  { name: "Standing Split", bodyArea: "hamstrings", bodyAreaLabel: "Hamstrings", duration: 25, description: "From a standing forward fold, lift one leg behind you as high as comfortable while keeping both legs straight. Switch sides.", level: "advanced" },
  { name: "Single-Leg Deadlift Reach", bodyArea: "hamstrings", bodyAreaLabel: "Hamstrings", duration: 20, description: "Stand on one leg and hinge forward, reaching both hands toward the floor while extending the other leg behind you. Switch sides.", level: "intermediate", isDynamic: true },

  // Quads & Thighs
  { name: "Standing Quad Stretch", bodyArea: "quads", bodyAreaLabel: "Quads & Thighs", duration: 25, description: "Stand on one leg, bend the other knee, and grab your ankle behind you. Pull your heel toward your glute. Use a wall for balance.", level: "beginner" },
  { name: "Couch Stretch", bodyArea: "quads", bodyAreaLabel: "Quads & Thighs", duration: 30, description: "Kneel with one foot propped against a wall behind you, the other foot forward in a lunge. Squeeze your glute and push hips forward.", level: "advanced" },
  { name: "Kneeling Quad Stretch", bodyArea: "quads", bodyAreaLabel: "Quads & Thighs", duration: 25, description: "From a half-kneeling position, reach back and grab the foot of your back leg. Pull gently toward your glute. Switch sides.", level: "intermediate" },
  { name: "Side-Lying Quad Stretch", bodyArea: "quads", bodyAreaLabel: "Quads & Thighs", duration: 25, description: "Lie on your side and pull your top foot toward your glute. Keep your knees together and push your hip forward for a deeper stretch.", level: "beginner" },

  // Calves & Ankles
  { name: "Wall Calf Stretch", bodyArea: "calves", bodyAreaLabel: "Calves & Ankles", duration: 25, description: "Stand facing a wall with one foot behind you, heel on the ground. Lean into the wall until you feel the stretch in your calf. Switch.", level: "beginner" },
  { name: "Downward Dog", bodyArea: "calves", bodyAreaLabel: "Calves & Ankles", duration: 30, description: "From all fours, lift your hips up and back into an inverted V shape. Press your heels toward the floor and pedal your feet.", level: "beginner" },
  { name: "Step Stretch", bodyArea: "calves", bodyAreaLabel: "Calves & Ankles", duration: 25, description: "Stand on a step with your heels hanging off the edge. Lower your heels below the step level and hold. Use a railing for balance.", level: "beginner" },
  { name: "Seated Calf Stretch", bodyArea: "calves", bodyAreaLabel: "Calves & Ankles", duration: 20, description: "Sit with legs extended and loop a towel around the ball of one foot. Gently pull back until you feel the stretch. Switch sides.", level: "beginner" },
  { name: "Ankle Circles", bodyArea: "calves", bodyAreaLabel: "Calves & Ankles", duration: 15, description: "Lift one foot off the ground and rotate your ankle in large circles. Do 10 each direction, then switch feet.", level: "beginner", isDynamic: true },
];

function getHoldTime(level: Level, purpose: Purpose, baseDuration: number): number {
  let multiplier = 1;
  if (level === "beginner") multiplier = 0.75;
  else if (level === "advanced") multiplier = 1.4;

  if (purpose === "pre-workout") multiplier *= 0.6;
  else if (purpose === "post-workout" || purpose === "before-bed") multiplier *= 1.2;
  else if (purpose === "desk-break") multiplier *= 0.8;

  return Math.round(baseDuration * multiplier);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface RoutineStretch {
  stretch: Stretch;
  holdTime: number;
  step: number;
}

export default function StretchingRoutineGeneratorPage() {
  const [selectedAreas, setSelectedAreas] = useState<Set<BodyArea>>(new Set());
  const [time, setTime] = useState(10);
  const [level, setLevel] = useState<Level>("beginner");
  const [purpose, setPurpose] = useState<Purpose>("morning");
  const [routine, setRoutine] = useState<RoutineStretch[] | null>(null);

  const allAreas = BODY_AREAS.map((a) => a.key);
  const isFullBody = selectedAreas.size === allAreas.length;

  function toggleArea(area: BodyArea) {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(area)) next.delete(area);
      else next.add(area);
      return next;
    });
  }

  function toggleFullBody() {
    if (isFullBody) {
      setSelectedAreas(new Set());
    } else {
      setSelectedAreas(new Set(allAreas));
    }
  }

  function generateRoutine() {
    const areas = selectedAreas.size === 0 ? new Set(allAreas) : selectedAreas;
    const availableTime = time * 60;
    const transitionTime = 5;

    // Filter by area and level
    const levelOrder: Level[] = ["beginner", "intermediate", "advanced"];
    const maxLevelIdx = levelOrder.indexOf(level);
    let eligible = STRETCHES.filter(
      (s) => areas.has(s.bodyArea) && levelOrder.indexOf(s.level) <= maxLevelIdx
    );

    // For pre-workout, prefer dynamic stretches
    if (purpose === "pre-workout") {
      const dynamic = eligible.filter((s) => s.isDynamic);
      const statik = eligible.filter((s) => !s.isDynamic);
      eligible = [...dynamic, ...statik];
    } else {
      // For post-workout/before bed, prefer static
      const statik = eligible.filter((s) => !s.isDynamic);
      const dynamic = eligible.filter((s) => s.isDynamic);
      if (purpose === "post-workout" || purpose === "before-bed") {
        eligible = [...statik, ...dynamic];
      } else {
        eligible = shuffle(eligible);
      }
    }

    // For shorter sessions, prioritize compound stretches (upper-back, hips, lower-back)
    if (time <= 10) {
      const compound: BodyArea[] = ["upper-back", "hips", "lower-back"];
      eligible.sort((a, b) => {
        const aCompound = compound.includes(a.bodyArea) ? 0 : 1;
        const bCompound = compound.includes(b.bodyArea) ? 0 : 1;
        return aCompound - bCompound;
      });
    }

    // Shuffle within priority groups to get variety
    if (purpose === "pre-workout" || purpose === "post-workout" || purpose === "before-bed") {
      // Keep first group prioritized, shuffle within groups
      const primaryEnd = eligible.findIndex(
        (s, i) =>
          i > 0 &&
          (purpose === "pre-workout" ? !s.isDynamic : s.isDynamic) &&
          (purpose === "pre-workout" ? eligible[i - 1].isDynamic : !eligible[i - 1].isDynamic)
      );
      const splitAt = primaryEnd === -1 ? eligible.length : primaryEnd;
      eligible = [...shuffle(eligible.slice(0, splitAt)), ...shuffle(eligible.slice(splitAt))];
    }

    // Pick stretches that fit in time, one per area first for variety
    const picked: Stretch[] = [];
    const usedAreas = new Set<BodyArea>();
    let totalTime = 0;

    // First pass: one stretch per area
    for (const s of eligible) {
      if (usedAreas.has(s.bodyArea)) continue;
      const hold = getHoldTime(level, purpose, s.duration);
      if (totalTime + hold + transitionTime <= availableTime) {
        picked.push(s);
        usedAreas.add(s.bodyArea);
        totalTime += hold + transitionTime;
      }
    }

    // Second pass: fill remaining time
    for (const s of eligible) {
      if (picked.includes(s)) continue;
      const hold = getHoldTime(level, purpose, s.duration);
      if (totalTime + hold + transitionTime <= availableTime) {
        picked.push(s);
        totalTime += hold + transitionTime;
      }
    }

    const result: RoutineStretch[] = picked.map((s, i) => ({
      stretch: s,
      holdTime: getHoldTime(level, purpose, s.duration),
      step: i + 1,
    }));

    setRoutine(result);
  }

  const totalRoutineTime = routine
    ? routine.reduce((sum, r) => sum + r.holdTime + 5, 0)
    : 0;

  const coveredAreas = routine
    ? [...new Set(routine.map((r) => r.stretch.bodyAreaLabel))]
    : [];

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Target Areas */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Target Areas</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleFullBody}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isFullBody
                  ? "bg-primary text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Full Body
            </button>
            {BODY_AREAS.map((area) => (
              <button
                key={area.key}
                onClick={() => toggleArea(area.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedAreas.has(area.key)
                    ? "bg-primary text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-stone-600 mb-1">Available Time</label>
              <select
                value={time}
                onChange={(e) => setTime(parseInt(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t} min
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Flexibility Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as Purpose)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                <option value="morning">Morning Wake-up</option>
                <option value="pre-workout">Pre-workout Warmup</option>
                <option value="post-workout">Post-workout Cooldown</option>
                <option value="desk-break">Desk Break</option>
                <option value="before-bed">Before Bed</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateRoutine}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            {routine ? "Generate New Routine" : "Generate Routine"}
          </button>
        </div>

        {/* Routine Output */}
        {routine && routine.length > 0 && (
          <>
            {/* Summary */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Routine Summary</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Math.ceil(totalRoutineTime / 60)}
                  </div>
                  <div className="text-sm text-stone-500">minutes</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{routine.length}</div>
                  <div className="text-sm text-stone-500">stretches</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{coveredAreas.length}</div>
                  <div className="text-sm text-stone-500">areas covered</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {coveredAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Stretch List */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Your Routine</h2>
              <div className="space-y-4">
                {routine.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 p-4 bg-stone-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-800">
                          {item.stretch.name}
                        </span>
                        <span className="px-2 py-0.5 bg-stone-200 text-stone-600 rounded-full text-xs">
                          {item.stretch.bodyAreaLabel}
                        </span>
                      </div>
                      <div className="text-sm text-primary font-medium mt-1">
                        Hold: {item.holdTime}s
                      </div>
                      <p className="text-sm text-stone-600 mt-1">
                        {item.stretch.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-stone-500 pt-2">
                Total estimated time: {Math.ceil(totalRoutineTime / 60)} minutes
                (including 5s transitions)
              </div>
            </div>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
