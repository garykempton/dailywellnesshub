"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("yoga-flow-builder")!;

interface Pose {
  name: string;
  sanskritName?: string;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  categories: string[];
  description: string;
}

const POSES: Pose[] = [
  // Standing poses
  { name: "Mountain Pose", sanskritName: "Tadasana", duration: 30, level: "beginner", categories: ["standing", "warmup", "energy"], description: "Stand tall with feet together, arms at your sides, grounding evenly through both feet." },
  { name: "Forward Fold", sanskritName: "Uttanasana", duration: 30, level: "beginner", categories: ["standing", "flexibility", "cooldown"], description: "Hinge at the hips and fold forward, letting your head hang heavy toward the floor." },
  { name: "Warrior I", sanskritName: "Virabhadrasana I", duration: 40, level: "beginner", categories: ["standing", "strength", "energy"], description: "Step one foot back, bend the front knee to 90 degrees, and reach your arms overhead." },
  { name: "Warrior II", sanskritName: "Virabhadrasana II", duration: 40, level: "beginner", categories: ["standing", "strength", "energy"], description: "Open your hips and arms wide, gazing over your front fingertips with the front knee bent." },
  { name: "Warrior III", sanskritName: "Virabhadrasana III", duration: 30, level: "intermediate", categories: ["standing", "balance", "strength"], description: "Balance on one leg while extending the other behind you, torso and arms reaching forward." },
  { name: "Triangle Pose", sanskritName: "Trikonasana", duration: 40, level: "beginner", categories: ["standing", "flexibility"], description: "Straighten both legs, reach one hand to your shin and the other toward the sky." },
  { name: "Chair Pose", sanskritName: "Utkatasana", duration: 30, level: "beginner", categories: ["standing", "strength", "energy"], description: "Bend your knees as if sitting in a chair, arms reaching overhead." },
  { name: "Tree Pose", sanskritName: "Vrksasana", duration: 40, level: "beginner", categories: ["standing", "balance", "relaxation"], description: "Balance on one foot and place the other foot on your inner thigh or calf, never the knee." },
  { name: "Half Moon", sanskritName: "Ardha Chandrasana", duration: 30, level: "intermediate", categories: ["standing", "balance", "strength"], description: "Balance on one hand and foot, opening your body to the side with top arm reaching skyward." },
  { name: "Eagle Pose", sanskritName: "Garudasana", duration: 30, level: "intermediate", categories: ["standing", "balance", "flexibility"], description: "Wrap one leg around the other and cross your arms, sinking into a single-leg squat." },
  { name: "Dancer's Pose", sanskritName: "Natarajasana", duration: 30, level: "intermediate", categories: ["standing", "balance", "flexibility"], description: "Stand on one leg, grab the opposite foot behind you, and gently press it away while leaning forward." },
  { name: "Extended Side Angle", sanskritName: "Utthita Parsvakonasana", duration: 35, level: "beginner", categories: ["standing", "strength", "flexibility"], description: "From Warrior II, bring your front forearm to your thigh and extend the top arm over your ear." },

  // Floor poses
  { name: "Child's Pose", sanskritName: "Balasana", duration: 45, level: "beginner", categories: ["floor", "relaxation", "cooldown", "warmup"], description: "Kneel and sit back on your heels, folding forward with arms extended or by your sides." },
  { name: "Cat-Cow", sanskritName: "Marjaryasana-Bitilasana", duration: 40, level: "beginner", categories: ["floor", "warmup", "flexibility"], description: "On hands and knees, alternate between arching and rounding your spine with each breath." },
  { name: "Downward Dog", sanskritName: "Adho Mukha Svanasana", duration: 40, level: "beginner", categories: ["floor", "strength", "flexibility", "energy"], description: "Lift your hips high from hands and knees, pressing heels toward the floor to form an inverted V." },
  { name: "Cobra", sanskritName: "Bhujangasana", duration: 30, level: "beginner", categories: ["floor", "flexibility", "energy"], description: "Lie face down, place hands under shoulders, and gently lift your chest using your back muscles." },
  { name: "Upward Dog", sanskritName: "Urdhva Mukha Svanasana", duration: 25, level: "intermediate", categories: ["floor", "strength", "flexibility"], description: "From a face-down position, press through your hands to lift your chest and thighs off the floor." },
  { name: "Plank", duration: 30, level: "beginner", categories: ["floor", "strength", "energy"], description: "Hold a straight line from head to heels with hands under shoulders and core engaged." },
  { name: "Low Lunge", sanskritName: "Anjaneyasana", duration: 35, level: "beginner", categories: ["floor", "flexibility", "warmup"], description: "Step one foot forward between your hands, lower the back knee, and lift your arms overhead." },
  { name: "Pigeon Pose", sanskritName: "Kapotasana", duration: 60, level: "intermediate", categories: ["floor", "flexibility", "relaxation", "cooldown"], description: "From Downward Dog, bring one knee forward behind your wrist and extend the other leg back." },
  { name: "Seated Forward Fold", sanskritName: "Paschimottanasana", duration: 45, level: "beginner", categories: ["seated", "flexibility", "cooldown", "relaxation"], description: "Sit with legs extended and hinge forward from the hips, reaching toward your feet." },
  { name: "Bridge Pose", sanskritName: "Setu Bandhasana", duration: 35, level: "beginner", categories: ["floor", "strength", "flexibility"], description: "Lie on your back with knees bent, then lift your hips toward the ceiling." },
  { name: "Happy Baby", sanskritName: "Ananda Balasana", duration: 40, level: "beginner", categories: ["floor", "relaxation", "flexibility", "cooldown"], description: "Lie on your back, grab the outsides of your feet, and gently pull your knees toward the floor." },
  { name: "Supine Twist", sanskritName: "Supta Matsyendrasana", duration: 40, level: "beginner", categories: ["floor", "relaxation", "flexibility", "cooldown"], description: "Lie on your back, draw one knee across your body, and extend the opposite arm out to the side." },
  { name: "Chaturanga", sanskritName: "Chaturanga Dandasana", duration: 15, level: "intermediate", categories: ["floor", "strength"], description: "Lower from Plank with elbows tight to your sides until your arms form a 90-degree angle." },
  { name: "Boat Pose", sanskritName: "Navasana", duration: 30, level: "intermediate", categories: ["seated", "strength"], description: "Balance on your sit bones with legs lifted and arms reaching forward, forming a V shape." },
  { name: "Crow Pose", sanskritName: "Bakasana", duration: 20, level: "advanced", categories: ["floor", "strength", "balance"], description: "From a squat, place hands on the floor, lean forward, and lift your feet by pressing knees into upper arms." },

  // Relaxation poses
  { name: "Legs Up The Wall", sanskritName: "Viparita Karani", duration: 60, level: "beginner", categories: ["floor", "relaxation", "cooldown"], description: "Lie on your back with your legs resting vertically against a wall." },
  { name: "Savasana", sanskritName: "Savasana", duration: 120, level: "beginner", categories: ["floor", "relaxation", "cooldown"], description: "Lie on your back with arms at your sides, palms up, and allow your entire body to relax." },
  { name: "Reclined Butterfly", sanskritName: "Supta Baddha Konasana", duration: 50, level: "beginner", categories: ["floor", "relaxation", "flexibility", "cooldown"], description: "Lie on your back with the soles of your feet together and knees falling open to the sides." },

  // Additional poses
  { name: "Sun Salutation A Flow", duration: 60, level: "beginner", categories: ["standing", "vinyasa", "energy", "warmup"], description: "Flow through Mountain, Forward Fold, Halfway Lift, Plank, Cobra, Downward Dog, and back to Mountain." },
  { name: "Sun Salutation B Flow", duration: 75, level: "intermediate", categories: ["standing", "vinyasa", "energy", "strength"], description: "Flow through Chair, Forward Fold, Plank, Chaturanga, Upward Dog, Downward Dog, Warrior I, and repeat." },
  { name: "Halfway Lift", sanskritName: "Ardha Uttanasana", duration: 10, level: "beginner", categories: ["standing", "warmup"], description: "From Forward Fold, lift your torso halfway with a flat back, hands on shins." },
  { name: "Garland Pose", sanskritName: "Malasana", duration: 35, level: "beginner", categories: ["standing", "flexibility", "warmup"], description: "Sink into a deep squat with feet slightly turned out and palms pressed together at your heart." },
  { name: "Camel Pose", sanskritName: "Ustrasana", duration: 30, level: "intermediate", categories: ["floor", "flexibility", "energy"], description: "Kneel upright, then lean back and reach for your heels, opening through the chest." },
  { name: "Shoulder Stand", sanskritName: "Sarvangasana", duration: 45, level: "advanced", categories: ["floor", "strength", "balance"], description: "From your back, lift legs and hips overhead, supporting your lower back with your hands." },
  { name: "Fish Pose", sanskritName: "Matsyasana", duration: 30, level: "intermediate", categories: ["floor", "flexibility", "cooldown"], description: "Lie on your back and lift your chest by pressing into your forearms, arching your upper back." },
  { name: "Thread the Needle", duration: 35, level: "beginner", categories: ["floor", "flexibility", "warmup", "relaxation"], description: "From all fours, slide one arm under your body, lowering that shoulder and cheek to the floor." },
  { name: "Seated Breathing", duration: 60, level: "beginner", categories: ["seated", "relaxation", "warmup", "centering"], description: "Sit cross-legged with a tall spine, close your eyes, and focus on slow, deep breaths." },
  { name: "Neck Rolls", duration: 30, level: "beginner", categories: ["seated", "warmup"], description: "Gently roll your head in slow circles, releasing tension in the neck and shoulders." },
];

const DURATIONS = [
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "20 min", minutes: 20 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "60 min", minutes: 60 },
];

const FOCUS_AREAS = ["Flexibility", "Strength", "Relaxation", "Energy/Morning", "Balance"] as const;
const STYLES = ["Gentle/Hatha", "Vinyasa Flow", "Power"] as const;
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

interface FlowPose {
  pose: Pose;
  holdSeconds: number;
  phase: "centering" | "warm-up" | "main" | "cool-down" | "savasana";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function focusCategory(focus: string): string {
  switch (focus) {
    case "Flexibility": return "flexibility";
    case "Strength": return "strength";
    case "Relaxation": return "relaxation";
    case "Energy/Morning": return "energy";
    case "Balance": return "balance";
    default: return "flexibility";
  }
}

function levelFilter(pose: Pose, level: string): boolean {
  if (level === "Advanced") return true;
  if (level === "Intermediate") return pose.level !== "advanced";
  return pose.level === "beginner";
}

function generateFlow(
  level: string,
  durationMin: number,
  focus: string,
  style: string
): FlowPose[] {
  const totalSec = durationMin * 60;
  const cat = focusCategory(focus);

  // Allocate time to phases
  const centeringSec = Math.min(90, Math.max(60, Math.round(totalSec * 0.1)));
  const savasanaSec = Math.min(300, Math.max(120, Math.round(totalSec * 0.08)));
  const warmupSec = Math.round(totalSec * 0.2);
  const cooldownSec = Math.round(totalSec * 0.15);
  const mainSec = totalSec - centeringSec - savasanaSec - warmupSec - cooldownSec;

  const flow: FlowPose[] = [];

  // Centering
  const seatedBreathing = POSES.find((p) => p.name === "Seated Breathing")!;
  flow.push({ pose: seatedBreathing, holdSeconds: centeringSec, phase: "centering" });

  // Helper to pick poses for a phase
  function pickPoses(
    categories: string[],
    budget: number,
    phase: FlowPose["phase"],
    holdMult: number
  ) {
    const candidates = shuffle(
      POSES.filter(
        (p) =>
          levelFilter(p, level) &&
          p.name !== "Seated Breathing" &&
          p.name !== "Savasana" &&
          categories.some((c) => p.categories.includes(c))
      )
    );
    let used = 0;
    const seen = new Set(flow.map((f) => f.pose.name));
    for (const pose of candidates) {
      if (seen.has(pose.name)) continue;
      const hold = Math.round(pose.duration * holdMult);
      if (used + hold > budget) continue;
      flow.push({ pose, holdSeconds: hold, phase });
      seen.add(pose.name);
      used += hold;
      if (budget - used < 15) break;
    }
  }

  // Warm-up
  const warmupCats = ["warmup", "flexibility"];
  if (style === "Vinyasa Flow") warmupCats.push("vinyasa");
  pickPoses(warmupCats, warmupSec, "warm-up", style === "Gentle/Hatha" ? 1.3 : 1.0);

  // Main sequence
  const mainCats = [cat];
  if (style === "Vinyasa Flow") mainCats.push("vinyasa", "energy");
  if (style === "Power") mainCats.push("strength");
  if (style === "Gentle/Hatha") mainCats.push("relaxation", "flexibility");
  const holdMult = style === "Gentle/Hatha" ? 1.4 : style === "Power" ? 0.7 : 1.0;
  pickPoses(mainCats, mainSec, "main", holdMult);

  // Cool-down
  pickPoses(["cooldown", "relaxation"], cooldownSec, "cool-down", 1.2);

  // Savasana
  const savasana = POSES.find((p) => p.name === "Savasana")!;
  flow.push({ pose: savasana, holdSeconds: savasanaSec, phase: "savasana" });

  return flow;
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const phaseColors: Record<string, string> = {
  centering: "bg-indigo-100 text-indigo-700",
  "warm-up": "bg-amber-100 text-amber-700",
  main: "bg-green-100 text-green-700",
  "cool-down": "bg-blue-100 text-blue-700",
  savasana: "bg-purple-100 text-purple-700",
};

export default function YogaFlowBuilderPage() {
  const [level, setLevel] = useState(0);
  const [duration, setDuration] = useState(3); // 30 min default
  const [focus, setFocus] = useState(0);
  const [style, setStyle] = useState(0);
  const [flow, setFlow] = useState<FlowPose[] | null>(null);

  function handleGenerate() {
    const result = generateFlow(
      LEVELS[level],
      DURATIONS[duration].minutes,
      FOCUS_AREAS[focus],
      STYLES[style]
    );
    setFlow(result);
  }

  const totalSeconds = flow ? flow.reduce((sum, p) => sum + p.holdSeconds, 0) : 0;
  const selectClass = "w-full border border-stone-300 rounded-lg px-3 py-2 bg-white";

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Experience Level</label>
          <select className={selectClass} value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            {LEVELS.map((l, i) => (
              <option key={l} value={i}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Session Duration</label>
          <select className={selectClass} value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            {DURATIONS.map((d, i) => (
              <option key={d.minutes} value={i}>{d.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Focus Area</label>
          <select className={selectClass} value={focus} onChange={(e) => setFocus(Number(e.target.value))}>
            {FOCUS_AREAS.map((f, i) => (
              <option key={f} value={i}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Style Preference</label>
          <select className={selectClass} value={style} onChange={(e) => setStyle(Number(e.target.value))}>
            {STYLES.map((s, i) => (
              <option key={s} value={i}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Generate Yoga Flow
        </button>
      </div>

      {flow && (
        <div className="mt-6 space-y-6">
          {/* Summary card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Your Flow</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-stone-500">Duration</p>
                <p className="font-semibold">{formatDuration(totalSeconds)}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-stone-500">Poses</p>
                <p className="font-semibold">{flow.length}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-stone-500">Level</p>
                <p className="font-semibold">{LEVELS[level]}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-stone-500">Focus</p>
                <p className="font-semibold">{FOCUS_AREAS[focus]}</p>
              </div>
            </div>
          </div>

          {/* Pose sequence */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Pose Sequence</h2>
            <div className="space-y-4">
              {flow.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    {i < flow.length - 1 && (
                      <div className="w-px h-full min-h-[24px] bg-stone-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-stone-800">{item.pose.name}</span>
                      {item.pose.sanskritName && (
                        <span className="text-xs italic text-stone-400">{item.pose.sanskritName}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${phaseColors[item.phase] || "bg-stone-100 text-stone-600"}`}>
                        {item.phase}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">{item.pose.description}</p>
                    <p className="text-xs text-stone-400 mt-1">Hold: {formatDuration(item.holdSeconds)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regenerate button */}
          <button
            onClick={handleGenerate}
            className="w-full bg-white border border-stone-300 text-stone-700 py-3 rounded-lg font-medium hover:bg-stone-50 transition-colors"
          >
            Generate New Flow
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
