"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("foam-rolling-routine")!;

type BodyArea =
  | "calves"
  | "it-band"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "hip-flexors"
  | "upper-back"
  | "lats";

type Purpose = "pre-workout" | "post-workout" | "rest-day" | "maintenance";
type Soreness = "mild" | "moderate" | "severe";

interface FoamExercise {
  name: string;
  bodyArea: BodyArea;
  bodyAreaLabel: string;
  baseDuration: number;
  technique: string;
  difficultyTip: string;
  pressureNote: string;
  order: number; // lower = earlier in routine
}

const BODY_AREAS: { key: BodyArea; label: string }[] = [
  { key: "calves", label: "Calves" },
  { key: "it-band", label: "IT Band / Outer Thigh" },
  { key: "quads", label: "Quads" },
  { key: "hamstrings", label: "Hamstrings" },
  { key: "glutes", label: "Glutes / Piriformis" },
  { key: "hip-flexors", label: "Hip Flexors" },
  { key: "upper-back", label: "Upper Back / Thoracic" },
  { key: "lats", label: "Lats" },
];

const TIME_OPTIONS = [5, 10, 15, 20];

const EXERCISES: FoamExercise[] = [
  { name: "Calf Roll (centre)", bodyArea: "calves", bodyAreaLabel: "Calves", baseDuration: 45, technique: "Sit with legs extended, roller under mid-calf. Cross the opposite ankle on top for extra pressure. Roll slowly from just above the ankle to below the knee, pausing on tender spots for 5-10 seconds.", difficultyTip: "Remove the top leg and roll both calves at once for an easier version.", pressureNote: "Moderate pressure; calves can be surprisingly tender.", order: 1 },
  { name: "Calf Roll (medial/lateral)", bodyArea: "calves", bodyAreaLabel: "Calves", baseDuration: 40, technique: "Rotate your foot inward and outward as you roll to target the inner and outer heads of the calf. Spend equal time on each rotation to address the soleus and gastrocnemius.", difficultyTip: "Bend the knee slightly to shift emphasis to the soleus.", pressureNote: "Light to moderate; adjust by stacking or removing the top leg.", order: 2 },
  { name: "IT Band Roll", bodyArea: "it-band", bodyAreaLabel: "IT Band", baseDuration: 50, technique: "Lie on your side with the roller under your outer thigh, between the hip and knee. Use your top leg planted in front for support. Roll slowly along the outer thigh, pausing on hot spots.", difficultyTip: "Place more weight on the support leg to decrease pressure if painful.", pressureNote: "Can be intense; start light and increase gradually. Breathe steadily.", order: 3 },
  { name: "TFL / Outer Hip Roll", bodyArea: "it-band", bodyAreaLabel: "IT Band", baseDuration: 40, technique: "Position the roller just below and in front of the hip bone on the outer thigh. Make small, slow rolls targeting the tensor fasciae latae. Keep your core braced to control pressure.", difficultyTip: "Use a softer roller if the area is very sensitive.", pressureNote: "Moderate; this small muscle can refer discomfort down the leg.", order: 4 },
  { name: "Quad Roll (prone)", bodyArea: "quads", bodyAreaLabel: "Quads", baseDuration: 50, technique: "Lie face-down with the roller under your front thighs. Use your forearms to support your upper body. Roll from just above the knee to the hip crease, shifting slightly left and right to cover the inner and outer quad.", difficultyTip: "Roll one leg at a time to increase pressure and control.", pressureNote: "Moderate to firm; the rectus femoris responds well to steady pressure.", order: 5 },
  { name: "Quad Roll (lateral emphasis)", bodyArea: "quads", bodyAreaLabel: "Quads", baseDuration: 40, technique: "Shift your body so the roller targets the vastus lateralis on the outer quad. Roll slowly and pause on adhesions. This area often holds tension from squats and lunges.", difficultyTip: "Bend the knee to 90 degrees on tender spots to add a contract-relax stretch.", pressureNote: "Firm pressure is usually well tolerated on the outer quad.", order: 6 },
  { name: "Hamstring Roll", bodyArea: "hamstrings", bodyAreaLabel: "Hamstrings", baseDuration: 50, technique: "Sit on the roller with it under your thighs. Cross one ankle over the other to increase pressure on a single leg. Roll from the sit bones to just above the back of the knee.", difficultyTip: "Place the roller on a bench or step for greater range and pressure.", pressureNote: "Moderate; hamstrings are a large muscle group and usually tolerate firm rolling.", order: 7 },
  { name: "Hamstring Roll (inner)", bodyArea: "hamstrings", bodyAreaLabel: "Hamstrings", baseDuration: 40, technique: "Rotate your leg inward to expose the inner hamstrings (semitendinosus and semimembranosus). Roll slowly and search for adhesions near the sit bone attachment.", difficultyTip: "Use a ball for more targeted inner hamstring work near the sit bone.", pressureNote: "Light to moderate; the medial hamstrings can be sensitive near the attachment.", order: 8 },
  { name: "Glute Roll", bodyArea: "glutes", bodyAreaLabel: "Glutes", baseDuration: 45, technique: "Sit on the roller and lean to one side, placing one ankle on the opposite knee in a figure-four position. Roll through the gluteus maximus, shifting weight to find tight spots.", difficultyTip: "Use a lacrosse or massage ball to go deeper on specific knots.", pressureNote: "Firm pressure; the glutes are thick muscles that benefit from sustained pressure.", order: 9 },
  { name: "Piriformis Roll (cross-legged)", bodyArea: "glutes", bodyAreaLabel: "Glutes", baseDuration: 45, technique: "In the same figure-four position, shift your weight deeper and slightly toward the centre of the glute to target the piriformis beneath. Hold on tender spots and breathe deeply for 10-15 seconds.", difficultyTip: "A lacrosse ball provides more targeted piriformis release than a roller.", pressureNote: "Moderate to firm; the piriformis can refer sensation down the leg when tight.", order: 10 },
  { name: "Adductor Roll", bodyArea: "hip-flexors", bodyAreaLabel: "Hip Flexors", baseDuration: 45, technique: "Lie face-down and place the roller parallel to your body under one inner thigh. Open the hip and roll from the groin area to just above the knee. Move slowly and pause on tender points.", difficultyTip: "Bend the knee of the working leg to change the angle and intensity.", pressureNote: "Light to moderate; the inner thigh can be very sensitive.", order: 11 },
  { name: "Hip Flexor / TFL Roll", bodyArea: "hip-flexors", bodyAreaLabel: "Hip Flexors", baseDuration: 45, technique: "Lie face-down with the roller under the front of one hip, just below the hip bone. Use gentle rocking motions to work through the hip flexor complex. Keep the core engaged to control body weight.", difficultyTip: "Use a softer roller or place less body weight over the roller for sensitive areas.", pressureNote: "Light to moderate; the hip flexors can be tender, especially if you sit a lot.", order: 12 },
  { name: "Psoas Release", bodyArea: "hip-flexors", bodyAreaLabel: "Hip Flexors", baseDuration: 40, technique: "Position a firm ball or the edge of the roller just inside the hip bone on the front of the pelvis. Lie gently on it and breathe. Slowly extend the same-side leg to create a stretch-and-release effect.", difficultyTip: "Start with minimal pressure; the psoas is a deep muscle and responds to gentle work.", pressureNote: "Very light; excessive pressure on the psoas can be counterproductive.", order: 13 },
  { name: "Thoracic Spine Extension", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", baseDuration: 50, technique: "Lie on your back with the roller across your mid-back. Support your head with your hands. Gently extend backward over the roller, then curl back up. Move the roller up or down one vertebra and repeat.", difficultyTip: "Keep your hips on the ground and avoid arching the lower back.", pressureNote: "Moderate; the thoracic spine benefits from extension mobilisation rather than heavy pressure.", order: 14 },
  { name: "Upper Back Roll", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", baseDuration: 45, technique: "Place the roller across your upper back just below the shoulder blades. Cross your arms over your chest or hug yourself. Lift hips and roll from mid-back to upper shoulders.", difficultyTip: "Squeeze your shoulder blades together as you roll to access the rhomboids.", pressureNote: "Moderate to firm; the upper back musculature is dense and can handle pressure.", order: 15 },
  { name: "Thoracic Side Roll", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", baseDuration: 40, technique: "Shift your body so the roller targets the muscles alongside the spine on one side. Roll slowly from the mid-back to the shoulder blade region, keeping your hips lifted.", difficultyTip: "Reach the same-side arm overhead for a deeper stretch through the lats and thoracic area.", pressureNote: "Moderate; the paraspinal muscles respond well to steady, controlled rolling.", order: 16 },
  { name: "Lat Roll", bodyArea: "lats", bodyAreaLabel: "Lats", baseDuration: 45, technique: "Lie on your side with the roller under your armpit, arm extended overhead. Roll from the armpit down to the lower ribs. Rotate your torso slightly forward and backward to cover the full lat.", difficultyTip: "Bend the top knee and place the foot in front for balance and pressure control.", pressureNote: "Moderate; the lats are often neglected but can hold significant tension.", order: 17 },
  { name: "Lat / Teres Roll", bodyArea: "lats", bodyAreaLabel: "Lats", baseDuration: 40, technique: "Stay on your side and shift the roller to just below the armpit, targeting the teres major and minor. Use small rocking motions to work through the tissue that connects the lats to the shoulder.", difficultyTip: "A ball can provide more targeted pressure in the teres and rear shoulder area.", pressureNote: "Moderate; this area may be tender if you do a lot of pulling or overhead movements.", order: 18 },
  { name: "Mid-Back / Rhomboid Roll", bodyArea: "upper-back", bodyAreaLabel: "Upper Back", baseDuration: 40, technique: "Place the roller vertically along the spine. Shift your body to one side so the roller is between the spine and the shoulder blade. Roll slowly up and down to release the rhomboids.", difficultyTip: "Cross the same-side arm across your body to protract the scapula and expose the rhomboids.", pressureNote: "Moderate; sustained holds work better than fast rolling for this area.", order: 15 },
  { name: "Calf Ankle Mobilisation", bodyArea: "calves", bodyAreaLabel: "Calves", baseDuration: 35, technique: "Place the roller under the Achilles tendon area. Slowly dorsiflex and plantarflex the ankle while maintaining roller contact. This mobilises the ankle joint while releasing calf tension.", difficultyTip: "Use very light pressure near the Achilles tendon to avoid aggravation.", pressureNote: "Light; the Achilles area is sensitive and benefits from gentle mobilisation.", order: 2 },
];

interface RoutineExercise extends FoamExercise {
  adjustedDuration: number;
  pressureGuidance: string;
}

export default function FoamRollingRoutinePage() {
  const [selectedAreas, setSelectedAreas] = useState<BodyArea[]>([]);
  const [time, setTime] = useState(10);
  const [soreness, setSoreness] = useState<Soreness>("mild");
  const [purpose, setPurpose] = useState<Purpose>("maintenance");
  const [routine, setRoutine] = useState<RoutineExercise[] | null>(null);

  const allSelected = BODY_AREAS.every((a) => selectedAreas.includes(a.key));

  function toggleArea(area: BodyArea) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  function toggleFullBody() {
    if (allSelected) {
      setSelectedAreas([]);
    } else {
      setSelectedAreas(BODY_AREAS.map((a) => a.key));
    }
  }

  function generateRoutine() {
    if (selectedAreas.length === 0) return;

    const filtered = EXERCISES.filter((e) => selectedAreas.includes(e.bodyArea));
    if (filtered.length === 0) return;

    // Adjust durations based on purpose and soreness
    const adjusted: RoutineExercise[] = filtered.map((e) => {
      let duration = e.baseDuration;
      let pressureGuidance = e.pressureNote;

      if (purpose === "pre-workout") {
        duration = Math.round(duration * 0.65);
        pressureGuidance = "Light to moderate pressure. Keep it quick and focus on blood flow rather than deep release.";
      } else if (purpose === "post-workout") {
        duration = Math.round(duration * 1.3);
        pressureGuidance = "Moderate pressure. Spend extra time on areas that were worked during your session.";
      } else if (purpose === "rest-day") {
        duration = Math.round(duration * 1.2);
        pressureGuidance = "Moderate to firm pressure. Take your time and breathe into tight spots.";
      }

      if (soreness === "severe") {
        duration = Math.round(duration * 1.2);
        pressureGuidance = "Gentle pressure only. Avoid pressing through sharp pain. Use slow, sweeping motions and let the muscle relax onto the roller.";
      } else if (soreness === "moderate") {
        duration = Math.round(duration * 1.1);
        pressureGuidance = "Moderate pressure. Ease into tender areas gradually and breathe deeply.";
      }

      return { ...e, adjustedDuration: duration, pressureGuidance: pressureGuidance };
    });

    // Sort by order (lower body first, then upper body)
    adjusted.sort((a, b) => a.order - b.order);

    // Select exercises that fit the time budget
    const totalSeconds = time * 60;
    const transitionTime = 8; // seconds between exercises
    const selected: RoutineExercise[] = [];
    let usedTime = 0;

    for (const ex of adjusted) {
      const needed = ex.adjustedDuration + transitionTime;
      if (usedTime + needed <= totalSeconds) {
        selected.push(ex);
        usedTime += needed;
      }
    }

    // If we have space left, see if we can fit more from the already-included areas
    if (selected.length === 0 && adjusted.length > 0) {
      selected.push({ ...adjusted[0], adjustedDuration: Math.min(adjusted[0].adjustedDuration, totalSeconds) });
    }

    setRoutine(selected);
  }

  const totalRoutineTime = routine
    ? routine.reduce((sum, e) => sum + e.adjustedDuration, 0)
    : 0;

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
                allSelected
                  ? "bg-primary text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Full Body
            </button>
            {BODY_AREAS.map((area) => (
              <button
                key={area.key}
                onClick={() => toggleArea(area.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedAreas.includes(area.key)
                    ? "bg-primary text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
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
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Available Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t} minutes
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Soreness Level
              </label>
              <select
                value={soreness}
                onChange={(e) => setSoreness(e.target.value as Soreness)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as Purpose)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              >
                <option value="pre-workout">Pre-workout</option>
                <option value="post-workout">Post-workout</option>
                <option value="rest-day">Rest Day Recovery</option>
                <option value="maintenance">General Maintenance</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateRoutine}
            disabled={selectedAreas.length === 0}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Routine
          </button>
        </div>

        {/* Results */}
        {routine && routine.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Your Foam Rolling Routine</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary">{Math.ceil(totalRoutineTime / 60)}</p>
                  <p className="text-xs text-stone-500">Minutes</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary">{routine.length}</p>
                  <p className="text-xs text-stone-500">Exercises</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary">
                    {new Set(routine.map((e) => e.bodyArea)).size}
                  </p>
                  <p className="text-xs text-stone-500">Body Areas</p>
                </div>
              </div>
            </div>

            {/* Exercise List */}
            {routine.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl p-6 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-stone-800">{ex.name}</h3>
                      <span className="inline-block mt-1 text-xs font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {ex.bodyAreaLabel}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary whitespace-nowrap">
                    {ex.adjustedDuration}s
                  </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{ex.technique}</p>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-stone-500 mb-1">Pressure Guidance</p>
                  <p className="text-sm text-stone-700">{ex.pressureGuidance}</p>
                </div>
                {ex.difficultyTip && (
                  <p className="text-xs text-stone-500 italic">Tip: {ex.difficultyTip}</p>
                )}
              </div>
            ))}

            <button
              onClick={generateRoutine}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Generate New Routine
            </button>
          </div>
        )}

        {/* General Tips */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Foam Rolling Tips</h2>
          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              Roll slowly, spending 30-60 seconds per area. Rushing reduces effectiveness.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              When you find a tender spot, pause and hold pressure for 10-15 seconds while breathing deeply.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              Avoid rolling directly on joints, bones, or the lower back (lumbar spine).
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">4.</span>
              Pain should be a comfortable 5-7 out of 10. Sharp or shooting pain means too much pressure.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">5.</span>
              Stay hydrated after rolling to help flush metabolic waste released from the tissues.
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">6.</span>
              Consistency matters more than intensity. A few minutes daily beats one long session per week.
            </li>
          </ul>
        </div>
      </div>
    </ToolPageLayout>
  );
}
