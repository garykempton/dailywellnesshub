"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("flexibility-tracker")!;

const BODY_AREAS = [
  "Hamstrings",
  "Hip Flexors",
  "Shoulders",
  "Lower Back",
  "Calves",
  "Quadriceps",
  "Chest",
  "Neck",
] as const;

type BodyArea = (typeof BODY_AREAS)[number];

const RATING_LABELS: Record<number, string> = {
  1: "Very Tight",
  2: "Tight",
  3: "Moderate",
  4: "Good",
  5: "Excellent",
};

const TIPS: Record<BodyArea, string> = {
  Hamstrings:
    "Try standing toe touches and seated forward folds. Hold for 30-60 seconds.",
  "Hip Flexors":
    "Kneeling hip flexor stretches and pigeon pose can help improve hip flexibility.",
  Shoulders:
    "Wall slides and doorway stretches target shoulder mobility effectively.",
  "Lower Back":
    "Cat-cow stretches and child's pose can relieve lower back tightness. Focus on gentle, controlled movements.",
  Calves:
    "Wall calf stretches and downward dog hold are effective. Hold each stretch for 30-60 seconds.",
  Quadriceps:
    "Standing quad stretches and lying side quad stretches can improve front-of-thigh flexibility.",
  Chest:
    "Doorway pec stretches and lying chest openers on a foam roller help open up a tight chest.",
  Neck:
    "Gentle neck tilts, chin tucks, and slow rotations can improve cervical flexibility. Avoid forcing the range.",
};

function getScoreColor(score: number): string {
  if (score >= 4) return "bg-green-500";
  if (score >= 3) return "bg-amber-500";
  if (score >= 2) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreTextColor(score: number): string {
  if (score >= 4) return "text-green-700";
  if (score >= 3) return "text-amber-700";
  if (score >= 2) return "text-orange-700";
  return "text-red-700";
}

export default function FlexibilityTrackerPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  function setRating(area: string, value: number) {
    setRatings((prev) => ({ ...prev, [area]: value }));
    setShowResults(false);
  }

  function handleAssess() {
    if (Object.keys(ratings).length < BODY_AREAS.length) return;
    setShowResults(true);
  }

  const allRated = Object.keys(ratings).length === BODY_AREAS.length;
  const averageScore =
    allRated
      ? Math.round(
          (Object.values(ratings).reduce((a, b) => a + b, 0) /
            BODY_AREAS.length) *
            10
        ) / 10
      : 0;

  const lowAreas = BODY_AREAS.filter(
    (area) => ratings[area] !== undefined && ratings[area] <= 2
  );

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        <p className="text-sm text-stone-500">
          Rate your current flexibility for each body area, then click Assess to
          see your results.
        </p>

        <div className="space-y-4">
          {BODY_AREAS.map((area) => (
            <div key={area}>
              <p className="text-sm font-medium text-stone-700 mb-2">{area}</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(area, value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      ratings[area] === value
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {value} - {RATING_LABELS[value]}
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
          {allRated ? "Assess" : `Rate all ${BODY_AREAS.length} areas to continue`}
        </button>
      </div>

      {showResults && (
        <div className="mt-6 space-y-6">
          {/* Overall Score */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Overall Flexibility Score
            </p>
            <p className={`text-5xl font-bold ${getScoreTextColor(averageScore)}`}>
              {averageScore}
              <span className="text-2xl text-stone-400">/5</span>
            </p>
            <div className="mt-4 w-full bg-stone-200 rounded-full h-3 max-w-md mx-auto">
              <div
                className={`h-3 rounded-full transition-all ${getScoreColor(averageScore)}`}
                style={{ width: `${(averageScore / 5) * 100}%` }}
              />
            </div>
            <p className="text-sm text-stone-500 mt-3">
              {averageScore >= 4
                ? "Great flexibility! Keep up your stretching routine."
                : averageScore >= 3
                ? "Decent flexibility with room for improvement in some areas."
                : averageScore >= 2
                ? "Several areas need attention. A consistent stretching routine will help."
                : "Significant tightness across multiple areas. Start with gentle daily stretching."}
            </p>
          </div>

          {/* Per-area breakdown */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-4">
              Area Breakdown
            </h3>
            <div className="space-y-3">
              {BODY_AREAS.map((area) => {
                const score = ratings[area];
                return (
                  <div key={area} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-700 w-28 shrink-0">
                      {area}
                    </span>
                    <div className="flex-1 bg-stone-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getScoreColor(score)}`}
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold w-24 text-right ${getScoreTextColor(score)}`}
                    >
                      {RATING_LABELS[score]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips for low-rated areas */}
          {lowAreas.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="font-semibold text-stone-800 mb-4">
                Suggestions for Improvement
              </h3>
              <div className="space-y-4">
                {lowAreas.map((area) => (
                  <div
                    key={area}
                    className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
                    <p className="font-medium text-amber-800 mb-1">{area}</p>
                    <p className="text-sm text-amber-700">{TIPS[area]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          About flexibility tracking
        </p>
        <p>
          Flexibility varies from person to person and is influenced by age,
          activity level, and genetics. Self-assessment ratings are subjective and
          best used to track your own progress over time rather than comparing
          with others. Consistency in stretching is the most important factor for
          improvement.
        </p>
      </div>
    </ToolPageLayout>
  );
}
