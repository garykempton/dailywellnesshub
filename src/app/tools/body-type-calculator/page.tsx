"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("body-type-calculator")!;

interface Question {
  text: string;
  options: [string, string, string]; // ecto, meso, endo
}

const QUESTIONS: Question[] = [
  {
    text: "Wrist circumference relative to your hand",
    options: [
      "Fingers overlap",
      "Fingers just touch",
      "Fingers don't touch",
    ],
  },
  {
    text: "Shoulder width relative to hips",
    options: [
      "Narrower than hips",
      "Same as hips",
      "Wider than hips",
    ],
  },
  {
    text: "How easily do you gain weight?",
    options: [
      "Very difficult",
      "Gain and lose fairly easily",
      "Gain weight easily, hard to lose",
    ],
  },
  {
    text: "Natural build",
    options: [
      "Long and lean",
      "Medium, athletic frame",
      "Wide, stocky frame",
    ],
  },
  {
    text: "How do you respond to strength training?",
    options: [
      "Slow to gain muscle",
      "Gain muscle relatively easily",
      "Gain muscle and fat together",
    ],
  },
  {
    text: "Body shape tendency",
    options: [
      "Lean / straight",
      "V-shape or hourglass",
      "Round or pear-shaped",
    ],
  },
  {
    text: "Energy levels",
    options: [
      "High energy, fidgety",
      "Steady, balanced energy",
      "Lower energy, prefer less intensity",
    ],
  },
];

interface BodyTypeInfo {
  name: string;
  color: string;
  bgColor: string;
  description: string;
  characteristics: string[];
  training: string[];
  nutrition: string[];
}

const BODY_TYPES: Record<string, BodyTypeInfo> = {
  ectomorph: {
    name: "Ectomorph",
    color: "bg-blue-500",
    bgColor: "bg-blue-50 border-blue-200",
    description:
      "Ectomorphs tend to have a lean, long build with narrow shoulders and hips. They typically have a fast metabolism and find it difficult to gain weight or muscle mass.",
    characteristics: [
      "Naturally thin with a fast metabolism",
      "Narrow shoulders and hips",
      "Long limbs relative to torso",
      "Low body fat percentage",
      "Smaller joints and bone structure",
    ],
    training: [
      "Focus on compound lifts (squats, deadlifts, bench press)",
      "Keep cardio moderate to avoid burning excess calories",
      "Train with heavier weights and lower reps (6-10 range)",
      "Allow longer rest periods between sets (2-3 minutes)",
      "Limit workouts to 45-60 minutes to prevent overtraining",
    ],
    nutrition: [
      "Eat in a caloric surplus to support muscle growth",
      "Aim for higher carbohydrate intake (50-60% of calories)",
      "Eat frequent meals every 2-3 hours",
      "Include calorie-dense foods like nuts, avocados, and olive oil",
      "Protein target: 1.6-2.0g per kg of body weight",
    ],
  },
  mesomorph: {
    name: "Mesomorph",
    color: "bg-green-500",
    bgColor: "bg-green-50 border-green-200",
    description:
      "Mesomorphs have a naturally athletic, muscular build. They gain muscle relatively easily and can lose fat without extreme effort, making them well-suited to many sports and physical activities.",
    characteristics: [
      "Naturally muscular and athletic build",
      "Medium-sized bone structure",
      "Broad shoulders with a narrow waist",
      "Efficient metabolism",
      "Responds well to exercise and training",
    ],
    training: [
      "Respond well to a variety of training styles",
      "Mix of moderate weights with 8-12 reps per set",
      "Include both strength training and cardio",
      "Can handle higher training volume and frequency",
      "Periodise training to avoid plateaus",
    ],
    nutrition: [
      "Balanced macronutrient split (40% carbs, 30% protein, 30% fat)",
      "Moderate calorie intake based on training goals",
      "Time carbohydrates around workouts for energy",
      "Protein target: 1.6-2.2g per kg of body weight",
      "Adjust calories based on whether bulking or cutting",
    ],
  },
  endomorph: {
    name: "Endomorph",
    color: "bg-amber-500",
    bgColor: "bg-amber-50 border-amber-200",
    description:
      "Endomorphs tend to have a wider, stockier build and gain weight more easily, especially around the midsection. They often have a slower metabolism but can build impressive strength and muscle when following the right programme.",
    characteristics: [
      "Wider hips and shoulders",
      "Larger bone structure",
      "Higher tendency to store body fat",
      "Slower metabolism",
      "Strong lower body and good natural strength",
    ],
    training: [
      "Prioritise a mix of resistance training and cardio",
      "Include HIIT sessions 2-3 times per week",
      "Use circuit-style weight training to keep heart rate elevated",
      "Focus on full-body workouts for maximum calorie burn",
      "Stay active throughout the day beyond formal workouts",
    ],
    nutrition: [
      "Be mindful of total calorie intake",
      "Higher protein and fat, moderate carbohydrate intake (30-35% carbs)",
      "Focus on complex carbohydrates and high-fibre foods",
      "Eat lean protein with every meal to support satiety",
      "Protein target: 1.8-2.4g per kg of body weight",
    ],
  },
};

interface Results {
  ecto: number;
  meso: number;
  endo: number;
  dominant: string;
  blend: string;
}

function getBlendName(
  ecto: number,
  meso: number,
  endo: number
): { dominant: string; blend: string } {
  const scores = [
    { type: "ectomorph", score: ecto },
    { type: "mesomorph", score: meso },
    { type: "endomorph", score: endo },
  ].sort((a, b) => b.score - a.score);

  const first = scores[0];
  const second = scores[1];

  // If close scores (within 15%), show a blend
  if (first.score - second.score <= 15) {
    const prefix =
      first.type === "ectomorph"
        ? "Ecto"
        : first.type === "mesomorph"
        ? "Meso"
        : "Endo";
    const suffix =
      second.type === "ectomorph"
        ? "Ectomorph"
        : second.type === "mesomorph"
        ? "Mesomorph"
        : "Endomorph";
    return { dominant: first.type, blend: `${prefix}-${suffix}` };
  }

  return {
    dominant: first.type,
    blend: BODY_TYPES[first.type].name,
  };
}

export default function BodyTypeCalculatorPage() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  );
  const [results, setResults] = useState<Results | null>(null);

  function selectAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  function calculate() {
    if (answers.some((a) => a === null)) return;

    let ectoPoints = 0;
    let mesoPoints = 0;
    let endoPoints = 0;

    answers.forEach((a) => {
      if (a === 0) ectoPoints++;
      else if (a === 1) mesoPoints++;
      else if (a === 2) endoPoints++;
    });

    const total = QUESTIONS.length;
    const ecto = Math.round((ectoPoints / total) * 100);
    const meso = Math.round((mesoPoints / total) * 100);
    const endo = Math.round((endoPoints / total) * 100);

    const { dominant, blend } = getBlendName(ecto, meso, endo);

    setResults({ ecto, meso, endo, dominant, blend });
  }

  const allAnswered = answers.every((a) => a !== null);

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        <p className="text-sm text-stone-600">
          Answer all seven questions below to discover your body type. Choose the
          option that best describes you.
        </p>

        {QUESTIONS.map((q, qi) => (
          <div key={qi} className="space-y-2">
            <p className="text-sm font-medium text-stone-700">
              {qi + 1}. {q.text}
            </p>
            <div className="space-y-1">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                    answers[qi] === oi
                      ? "border-primary bg-primary/5"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => selectAnswer(qi, oi)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={calculate}
          disabled={!allAnswered}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            allAnswered
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {allAnswered ? "Calculate My Body Type" : "Answer all questions to continue"}
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Primary result */}
          <div
            className={`border rounded-xl p-5 text-center ${
              BODY_TYPES[results.dominant].bgColor
            }`}
          >
            <p className="text-sm font-medium mb-1">Your body type</p>
            <p className="text-3xl font-bold">{results.blend}</p>
          </div>

          {/* Percentage breakdown - visual bars */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
            <p className="text-sm font-medium text-stone-700">
              Body type breakdown
            </p>
            {[
              { label: "Ectomorph", pct: results.ecto, color: "bg-blue-500" },
              { label: "Mesomorph", pct: results.meso, color: "bg-green-500" },
              { label: "Endomorph", pct: results.endo, color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-stone-600">{item.label}</span>
                  <span className="font-medium">{item.pct}%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${item.color}`}
                    style={{ width: `${Math.max(item.pct, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Three-type visual */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Where you fall on the spectrum
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {(["ectomorph", "mesomorph", "endomorph"] as const).map((type) => {
                const pct =
                  type === "ectomorph"
                    ? results.ecto
                    : type === "mesomorph"
                    ? results.meso
                    : results.endo;
                const isActive = results.dominant === type;
                const info = BODY_TYPES[type];
                return (
                  <div
                    key={type}
                    className={`rounded-lg p-3 border transition-all ${
                      isActive
                        ? `${info.bgColor} border-2`
                        : "border-stone-100 bg-stone-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm ${info.color}`}
                    >
                      {pct}%
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-stone-800" : "text-stone-400"
                      }`}
                    >
                      {info.name}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {type === "ectomorph"
                        ? "Lean"
                        : type === "mesomorph"
                        ? "Athletic"
                        : "Stocky"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div
            className={`border rounded-xl p-5 ${
              BODY_TYPES[results.dominant].bgColor
            }`}
          >
            <p className="text-sm font-medium text-stone-700 mb-2">
              About {BODY_TYPES[results.dominant].name}s
            </p>
            <p className="text-sm text-stone-600">
              {BODY_TYPES[results.dominant].description}
            </p>
          </div>

          {/* Characteristics */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-2">
              Key characteristics
            </p>
            <ul className="space-y-1">
              {BODY_TYPES[results.dominant].characteristics.map((c, i) => (
                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                  <span className="text-stone-400 mt-0.5">-</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Training recommendations */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-2">
              Training recommendations
            </p>
            <ul className="space-y-1">
              {BODY_TYPES[results.dominant].training.map((t, i) => (
                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                  <span className="text-stone-400 mt-0.5">-</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrition recommendations */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-2">
              Nutrition recommendations
            </p>
            <ul className="space-y-1">
              {BODY_TYPES[results.dominant].nutrition.map((n, i) => (
                <li key={i} className="text-sm text-stone-600 flex items-start gap-2">
                  <span className="text-stone-400 mt-0.5">-</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          About body types (somatotypes)
        </p>
        <p className="mb-2">
          The somatotype system was originally developed by psychologist William
          Sheldon in the 1940s and has since been adapted for fitness and
          nutrition planning. Most people are a blend of two or even all three
          types rather than fitting neatly into a single category.
        </p>
        <p className="mb-2">
          Your body type is influenced by genetics, but it does not determine
          your fitness destiny. With the right training and nutrition approach,
          anyone can improve their body composition, build strength, and enhance
          their health regardless of their natural tendency.
        </p>
        <p>
          This quiz provides a general indication based on self-reported traits.
          For precise body composition analysis, consider a DEXA scan or
          consultation with a certified fitness professional. This tool is for
          informational purposes only and is not medical advice.
        </p>
      </div>
    </ToolPageLayout>
  );
}
