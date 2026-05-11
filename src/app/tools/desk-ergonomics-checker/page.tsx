"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("desk-ergonomics-checker")!;

interface ChecklistItem {
  id: number;
  category: string;
  question: string;
  options: [string, string, string]; // Correct, Partial, Incorrect
  fixAdvice: string;
  healthImpact: number; // 1-10, higher = more important to fix
}

const CHECKLIST: ChecklistItem[] = [
  {
    id: 1,
    category: "Monitor height",
    question: "Where is the top of your screen relative to your eye level?",
    options: ["Top of screen at eye level", "Slightly above or below", "Way too high or low"],
    fixAdvice:
      "Raise or lower your monitor so the top of the screen is at eye level. Use a monitor stand, a stack of books, or an adjustable monitor arm. This prevents neck strain from looking up or down for extended periods.",
    healthImpact: 9,
  },
  {
    id: 2,
    category: "Monitor distance",
    question: "How far is your screen from your eyes?",
    options: ["Arm's length away (50-70cm)", "Slightly too close or far", "Very close or very far"],
    fixAdvice:
      "Position your monitor at arm's length (50-70cm). Sit back in your chair and extend your arm — your fingertips should just touch the screen. If text is hard to read at this distance, increase the font size rather than moving the screen closer.",
    healthImpact: 7,
  },
  {
    id: 3,
    category: "Chair height",
    question: "How are your feet, knees, and thighs positioned?",
    options: [
      "Feet flat, knees at 90 degrees, thighs parallel to floor",
      "Mostly correct, slight adjustment needed",
      "Knees much higher or lower than hips",
    ],
    fixAdvice:
      "Adjust your seat height so your feet rest flat on the floor with your knees bent at 90 degrees and thighs parallel to the ground. If your desk is too high, use a footrest rather than raising the chair and dangling your feet.",
    healthImpact: 10,
  },
  {
    id: 4,
    category: "Back support",
    question: "How well does your chair support your lower back?",
    options: [
      "Full lumbar support, sitting upright",
      "Some support, occasional slouching",
      "No support or always slouching",
    ],
    fixAdvice:
      "Your chair should have lumbar support that fits the natural curve of your lower back. If your chair lacks built-in support, use a lumbar roll or rolled-up towel. Sit with your back firmly against the backrest rather than perching on the front edge.",
    healthImpact: 10,
  },
  {
    id: 5,
    category: "Keyboard position",
    question: "What is the position of your elbows and wrists when typing?",
    options: [
      "Elbows at 90 degrees, wrists neutral and straight",
      "Slight angle, mostly comfortable",
      "Wrists bent up or down significantly",
    ],
    fixAdvice:
      "Position your keyboard so your elbows are at 90 degrees and your wrists are straight (not angled up or down). Consider a keyboard tray to achieve the correct height, or adjust your desk height. A wrist rest can help maintain neutral wrist position during pauses.",
    healthImpact: 9,
  },
  {
    id: 6,
    category: "Mouse position",
    question: "Where is your mouse relative to your keyboard and body?",
    options: [
      "Next to keyboard, arm relaxed and supported",
      "Slightly reaching or angled",
      "Reaching far or at wrong height",
    ],
    fixAdvice:
      "Keep your mouse immediately next to your keyboard at the same height. Your arm should be relaxed at your side, not reaching forward or to the side. Consider a shorter keyboard (tenkeyless) to bring the mouse closer, or use a mouse pad with wrist support.",
    healthImpact: 8,
  },
  {
    id: 7,
    category: "Screen glare",
    question: "Do you experience screen glare or reflections?",
    options: [
      "No glare, screen perpendicular to windows",
      "Minor glare sometimes",
      "Significant glare or facing a window directly",
    ],
    fixAdvice:
      "Position your screen perpendicular to windows (not facing them or with your back to them). Use blinds or curtains to control bright daylight. If glare persists, consider an anti-glare screen filter or adjust your screen brightness and contrast.",
    healthImpact: 6,
  },
  {
    id: 8,
    category: "Lighting",
    question: "How is the lighting at your workspace?",
    options: [
      "Even, adequate lighting without harsh shadows",
      "Mostly good, some issues",
      "Too dim, too bright, or uneven",
    ],
    fixAdvice:
      "Aim for even, indirect lighting. Avoid a single bright overhead light that causes shadows on your desk. Use a desk lamp with adjustable brightness to supplement ambient light. Your screen should not be the brightest thing in the room — match its brightness to your surroundings.",
    healthImpact: 5,
  },
  {
    id: 9,
    category: "Break habits",
    question: "How often do you take breaks from your desk?",
    options: [
      "Regular breaks every 30-60 minutes",
      "Occasional breaks, not consistent",
      "Rarely take breaks",
    ],
    fixAdvice:
      "Set a timer to remind you to stand and move every 30-60 minutes. Even a 2-minute walk or stretch makes a significant difference. Follow the 20-20-20 rule for your eyes: every 20 minutes, look at something 20 feet away for 20 seconds.",
    healthImpact: 8,
  },
  {
    id: 10,
    category: "Desk clutter",
    question: "How organised is your workspace?",
    options: [
      "Clean, organised workspace with room to move",
      "Some clutter but functional",
      "Very cluttered, restricted movement",
    ],
    fixAdvice:
      "Clear your desk of unnecessary items. You should be able to move your arms freely and position your keyboard and mouse without obstruction. Use desk organisers, cable management, and vertical storage to keep frequently used items within easy reach without cluttering the surface.",
    healthImpact: 4,
  },
];

type Answer = 2 | 1 | 0 | null;

function getRating(score: number): { label: string; colorClass: string } {
  if (score >= 18) return { label: "Excellent", colorClass: "bg-green-50 border-green-200 text-green-700" };
  if (score >= 14) return { label: "Good", colorClass: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  if (score >= 10) return { label: "Needs Work", colorClass: "bg-amber-50 border-amber-200 text-amber-700" };
  return { label: "Poor", colorClass: "bg-red-50 border-red-200 text-red-700" };
}

function getDotColor(answer: Answer): string {
  if (answer === 2) return "bg-green-500";
  if (answer === 1) return "bg-amber-500";
  if (answer === 0) return "bg-red-500";
  return "bg-stone-300";
}

export default function DeskErgonomicsCheckerPage() {
  const [answers, setAnswers] = useState<Answer[]>(CHECKLIST.map(() => null));
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function setAnswer(index: number, value: Answer) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
  }

  function handleSubmit() {
    if (answers.some((a) => a === null)) return;
    setSubmitted(true);
  }

  const allAnswered = answers.every((a) => a !== null);
  const totalScore = answers.reduce<number>((s, a) => s + (a ?? 0), 0);
  const rating = getRating(totalScore);

  // Priority fixes: items scored 0 or 1, sorted by health impact
  const priorityFixes = CHECKLIST
    .map((item, i) => ({ ...item, score: answers[i] ?? 2 }))
    .filter((item) => item.score < 2)
    .sort((a, b) => b.healthImpact - a.healthImpact)
    .slice(0, 3);

  const yearlyHours =
    hoursPerDay && Number(hoursPerDay) > 0
      ? Math.round(Number(hoursPerDay) * 365 * 0.71) // ~260 workdays
      : null;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        <p className="text-sm text-stone-600">
          Answer each question honestly based on your current desk setup. Select the option that best
          describes your situation.
        </p>

        {CHECKLIST.map((item, i) => (
          <div key={item.id} className="border border-stone-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${getDotColor(answers[i])}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-700">
                  {item.id}. {item.category}
                </p>
                <p className="text-sm text-stone-600 mt-1">{item.question}</p>
              </div>
            </div>
            <div className="space-y-2 ml-6">
              {item.options.map((option, oi) => {
                const value = (2 - oi) as Answer;
                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      answers[i] === value
                        ? "bg-primary/5 border border-primary/20"
                        : "hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${item.id}`}
                      checked={answers[i] === value}
                      onChange={() => setAnswer(i, value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-stone-600">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Hours per day */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Hours per day at your desk (optional)
          </label>
          <input
            type="number"
            min="0"
            max="24"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            placeholder="8"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            allAnswered
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {allAnswered ? "Check My Ergonomics" : "Answer all questions to continue"}
        </button>
      </div>

      {submitted && (
        <div className="mt-6 space-y-4">
          {/* Score card */}
          <div className={`border rounded-xl p-5 text-center ${rating.colorClass}`}>
            <p className="text-sm font-medium mb-1">Your Ergonomics Score</p>
            <p className="text-5xl font-bold">{totalScore}/20</p>
            <p className="text-sm font-semibold mt-2">{rating.label}</p>
          </div>

          {/* Yearly hours */}
          {yearlyHours && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700">
                You spend approximately{" "}
                <span className="font-bold text-lg">{yearlyHours.toLocaleString()}</span> hours per
                year at your desk. Good ergonomics matter.
              </p>
            </div>
          )}

          {/* Per-item breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">Item-by-item breakdown</p>
            <div className="space-y-2">
              {CHECKLIST.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 py-1">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${getDotColor(answers[i])}`} />
                  <span className="text-sm text-stone-600 flex-1">{item.category}</span>
                  <span className="text-sm font-medium text-stone-700">{answers[i]}/2</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority fixes */}
          {priorityFixes.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-medium text-stone-700">
                Top {priorityFixes.length} Priority Fix{priorityFixes.length > 1 ? "es" : ""}
              </p>
              {priorityFixes.map((item, i) => (
                <div key={item.id} className="border border-stone-100 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${getDotColor(item.score as Answer)}`} />
                    <p className="text-sm font-semibold text-stone-700">
                      {i + 1}. {item.category}
                    </p>
                  </div>
                  <p className="text-sm text-stone-600">{item.fixAdvice}</p>
                </div>
              ))}
            </div>
          )}

          {/* 20-20-20 rule */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-sm font-medium text-emerald-700 mb-1">The 20-20-20 Rule</p>
            <p className="text-sm text-emerald-600">
              Every 20 minutes, look at something 20 feet (6 metres) away for 20 seconds. This
              simple habit reduces eye strain, gives your focusing muscles a break, and encourages
              you to shift your posture regularly. Set a recurring timer to build the habit.
            </p>
          </div>

          {/* Recommendations by problem area */}
          {priorityFixes.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-medium text-stone-700">Recommended Improvements</p>
              <div className="space-y-3">
                {priorityFixes.some((f) => f.category === "Monitor height" || f.category === "Monitor distance") && (
                  <div className="text-sm text-stone-600">
                    <span className="font-medium text-stone-700">Monitor setup:</span> A monitor arm
                    or adjustable stand gives you precise height and distance control. Look for one
                    with gas-spring adjustment for easy repositioning.
                  </div>
                )}
                {priorityFixes.some((f) => f.category === "Chair height" || f.category === "Back support") && (
                  <div className="text-sm text-stone-600">
                    <span className="font-medium text-stone-700">Seating:</span> An ergonomic office
                    chair with adjustable seat height, lumbar support, and armrests is one of the
                    best investments for desk workers. If a new chair is not in budget, a lumbar
                    support cushion and a footrest can make a significant difference.
                  </div>
                )}
                {priorityFixes.some((f) => f.category === "Keyboard position" || f.category === "Mouse position") && (
                  <div className="text-sm text-stone-600">
                    <span className="font-medium text-stone-700">Input devices:</span> An ergonomic
                    keyboard and vertical mouse reduce strain on your wrists and forearms. A keyboard
                    tray can help achieve the correct typing height independently of your desk.
                  </div>
                )}
                {priorityFixes.some((f) => f.category === "Screen glare" || f.category === "Lighting") && (
                  <div className="text-sm text-stone-600">
                    <span className="font-medium text-stone-700">Lighting and glare:</span> A
                    monitor light bar (screen bar) provides even desk illumination without screen
                    glare. Anti-glare screen protectors are an affordable fix for reflective screens.
                  </div>
                )}
                {priorityFixes.some((f) => f.category === "Break habits") && (
                  <div className="text-sm text-stone-600">
                    <span className="font-medium text-stone-700">Movement:</span> Use a break
                    reminder app or a simple recurring timer. Stand-up desks or desk converters
                    encourage alternating between sitting and standing throughout the day.
                  </div>
                )}
                {priorityFixes.some((f) => f.category === "Desk clutter") && (
                  <div className="text-sm text-stone-600">
                    <span className="font-medium text-stone-700">Organisation:</span> Cable
                    management trays, monitor risers with storage, and desk organisers help maintain
                    a clean workspace. A clutter-free desk reduces stress and allows proper equipment
                    positioning.
                  </div>
                )}
              </div>
            </div>
          )}

          {totalScore === 20 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-sm font-medium text-green-700">
                Perfect score. Your desk setup is excellent. Keep up the good habits and remember to
                take regular breaks.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About desk ergonomics</p>
        <p className="mb-2">
          Poor workstation ergonomics are a leading cause of musculoskeletal problems including neck
          pain, lower back pain, carpal tunnel syndrome, and eye strain. Research shows that
          ergonomic interventions reduce workplace injury risk by up to 60% and can improve
          productivity by 10-15%.
        </p>
        <p>
          This checklist covers the most important factors identified by occupational health
          research. Even small adjustments — raising a monitor by a few centimetres, adding lumbar
          support, or taking regular breaks — can make a meaningful difference over weeks and months
          of desk work.
        </p>
      </div>
    </ToolPageLayout>
  );
}
