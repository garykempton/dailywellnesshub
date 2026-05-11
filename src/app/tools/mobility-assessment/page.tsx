"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("mobility-assessment")!;

type Rating = "pass" | "partial" | "fail";

interface MobilityTest {
  name: string;
  instruction: string;
  recommendation: string;
}

const TESTS: MobilityTest[] = [
  {
    name: "Ankle Dorsiflexion",
    instruction:
      "Kneel facing a wall, foot 10cm away. Can your knee touch the wall without your heel lifting?",
    recommendation:
      "Try wall-facing ankle stretches and calf raises with a slow eccentric phase. Foam rolling the calves can also help.",
  },
  {
    name: "Hip Flexion",
    instruction:
      "Lie on your back. Pull one knee to your chest. Does it reach comfortably?",
    recommendation:
      "Deep squat holds, knee-to-chest stretches, and hip circles can improve hip flexion range.",
  },
  {
    name: "Hip Internal Rotation",
    instruction:
      "Sit on a chair, feet flat. Rotate your foot outward (knee stays still). How far does it go?",
    recommendation:
      "90/90 hip stretches and seated internal rotation holds target this movement pattern effectively.",
  },
  {
    name: "Thoracic Rotation",
    instruction:
      "Sit cross-legged. Cross arms on chest. Rotate to each side. Can you rotate 45+ degrees?",
    recommendation:
      "Open books (lying rotation), thread-the-needle, and foam roller thoracic extensions improve upper back rotation.",
  },
  {
    name: "Shoulder Flexion",
    instruction:
      "Stand with back against wall. Raise arms overhead. Can your thumbs touch the wall?",
    recommendation:
      "Wall slides, lat stretches, and shoulder dislocates with a band or stick improve overhead reach.",
  },
  {
    name: "Shoulder External Rotation",
    instruction:
      "Arm at side, elbow at 90 degrees. Rotate forearm outward. Does it reach 90 degrees from your body?",
    recommendation:
      "Side-lying external rotation stretches and band pull-aparts help restore shoulder external rotation.",
  },
  {
    name: "Wrist Extension",
    instruction:
      "Press palms together in a prayer position. Can you lower your hands to waist level while keeping palms together?",
    recommendation:
      "Prayer stretches, wrist flexor stretches on the floor, and gentle wrist circles improve wrist extension.",
  },
  {
    name: "Cervical Rotation",
    instruction:
      "Look over each shoulder. Can you see directly behind you (or close to it)?",
    recommendation:
      "Gentle neck rotations, chin tucks, and levator scapulae stretches can improve cervical range of motion.",
  },
];

const RATING_OPTIONS: { value: Rating; label: string }[] = [
  { value: "pass", label: "Pass" },
  { value: "partial", label: "Partial" },
  { value: "fail", label: "Fail" },
];

const SCORE_MAP: Record<Rating, number> = {
  pass: 3,
  partial: 2,
  fail: 1,
};

function ratingStyle(rating: Rating): string {
  switch (rating) {
    case "pass":
      return "bg-green-100 text-green-700 border-green-200";
    case "partial":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "fail":
      return "bg-red-100 text-red-700 border-red-200";
  }
}

function ratingBadgeStyle(rating: Rating): string {
  switch (rating) {
    case "pass":
      return "bg-green-100 text-green-700";
    case "partial":
      return "bg-amber-100 text-amber-700";
    case "fail":
      return "bg-red-100 text-red-700";
  }
}

function getOverallColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.8) return "bg-green-500";
  if (pct >= 0.6) return "bg-amber-500";
  if (pct >= 0.4) return "bg-orange-500";
  return "bg-red-500";
}

function getOverallTextColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.8) return "text-green-700";
  if (pct >= 0.6) return "text-amber-700";
  if (pct >= 0.4) return "text-orange-700";
  return "text-red-700";
}

export default function MobilityAssessmentPage() {
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [showResults, setShowResults] = useState(false);

  function setRating(index: number, value: Rating) {
    setRatings((prev) => ({ ...prev, [index]: value }));
    setShowResults(false);
  }

  const allRated = Object.keys(ratings).length === TESTS.length;
  const MAX_SCORE = TESTS.length * 3; // 24

  const totalScore = allRated
    ? Object.values(ratings).reduce((sum, r) => sum + SCORE_MAP[r], 0)
    : 0;

  const limitedAreas = TESTS.filter(
    (_, i) => ratings[i] === "partial" || ratings[i] === "fail"
  );

  function handleAssess() {
    if (!allRated) return;
    setShowResults(true);
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        <p className="text-sm text-stone-500">
          Complete each of the 8 joint mobility tests below. Follow the
          instructions and rate your result, then click Assess to see your
          mobility score.
        </p>

        <div className="space-y-4">
          {TESTS.map((test, index) => (
            <div
              key={index}
              className="border border-stone-200 rounded-xl p-4 space-y-3"
            >
              <div>
                <p className="font-medium text-stone-800">
                  {index + 1}. {test.name}
                </p>
                <p className="text-sm text-stone-500 mt-1">
                  {test.instruction}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {RATING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRating(index, opt.value)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      ratings[index] === opt.value
                        ? ratingStyle(opt.value)
                        : "border-stone-300 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAssess}
          disabled={!allRated}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            allRated
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {allRated
            ? "Assess"
            : `Complete all ${TESTS.length} tests to continue`}
        </button>
      </div>

      {showResults && (
        <div className="mt-6 space-y-6">
          {/* Overall Score */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Overall Mobility Score
            </p>
            <p
              className={`text-5xl font-bold ${getOverallTextColor(totalScore, MAX_SCORE)}`}
            >
              {totalScore}
              <span className="text-2xl text-stone-400">/{MAX_SCORE}</span>
            </p>
            <div className="mt-4 w-full bg-stone-200 rounded-full h-3 max-w-md mx-auto">
              <div
                className={`h-3 rounded-full transition-all ${getOverallColor(totalScore, MAX_SCORE)}`}
                style={{ width: `${(totalScore / MAX_SCORE) * 100}%` }}
              />
            </div>
            <p className="text-sm text-stone-500 mt-3">
              {totalScore >= 20
                ? "Excellent mobility across all tested joints. Maintain your current routine."
                : totalScore >= 16
                ? "Good overall mobility with a few areas that could benefit from targeted work."
                : totalScore >= 12
                ? "Moderate mobility. A dedicated mobility routine will help address limitations."
                : "Several significant limitations detected. Prioritise daily mobility work on the areas below."}
            </p>
          </div>

          {/* Per-test breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-4">
              Results by Test
            </h3>
            <div className="space-y-3">
              {TESTS.map((test, index) => {
                const rating = ratings[index];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-medium text-stone-700">
                      {test.name}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${ratingBadgeStyle(rating)}`}
                    >
                      {rating === "pass"
                        ? "Pass"
                        : rating === "partial"
                        ? "Partial"
                        : "Fail"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority areas */}
          {limitedAreas.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="font-semibold text-stone-800 mb-4">
                Priority Areas to Work On
              </h3>
              <div className="space-y-4">
                {limitedAreas.map((test) => {
                  const index = TESTS.indexOf(test);
                  const rating = ratings[index];
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${
                        rating === "fail"
                          ? "bg-red-50 border-red-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className={`font-medium ${
                            rating === "fail"
                              ? "text-red-800"
                              : "text-amber-800"
                          }`}
                        >
                          {test.name}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ratingBadgeStyle(rating)}`}
                        >
                          {rating === "fail" ? "Fail" : "Partial"}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          rating === "fail"
                            ? "text-red-700"
                            : "text-amber-700"
                        }`}
                      >
                        {test.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {limitedAreas.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="font-medium text-green-800">
                All tests passed! You have excellent joint mobility across all
                tested areas.
              </p>
              <p className="text-sm text-green-700 mt-1">
                Continue your mobility routine to maintain these results.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          About this assessment
        </p>
        <p>
          This is a simplified self-assessment and does not replace a
          professional movement screen. Results are based on your own perception
          of each test. For persistent pain or significant limitations, consult a
          physiotherapist or qualified movement professional.
        </p>
      </div>
    </ToolPageLayout>
  );
}
