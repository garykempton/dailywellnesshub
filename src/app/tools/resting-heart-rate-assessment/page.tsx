"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("resting-heart-rate-assessment")!;

type Sex = "male" | "female";

interface RhrResult {
  rhr: number;
  rating: string;
  ratingColor: string;
  ratingBg: string;
  percentile: string;
  estimatedVo2Max: number;
  hrMax: number;
  heartBeatsPerDay: number;
  heartBeatsPerYear: number;
  tips: string[];
}

const RATING_THRESHOLDS_MALE = [
  { max: 49, rating: "Athlete", color: "text-blue-700", bg: "bg-blue-50", percentile: "Top 1%" },
  { max: 54, rating: "Excellent", color: "text-green-700", bg: "bg-green-50", percentile: "Top 5%" },
  { max: 61, rating: "Good", color: "text-green-600", bg: "bg-green-50", percentile: "Top 20%" },
  { max: 66, rating: "Above Average", color: "text-lime-700", bg: "bg-lime-50", percentile: "Top 40%" },
  { max: 71, rating: "Average", color: "text-amber-700", bg: "bg-amber-50", percentile: "50th percentile" },
  { max: 78, rating: "Below Average", color: "text-orange-700", bg: "bg-orange-50", percentile: "Bottom 30%" },
  { max: 89, rating: "Poor", color: "text-red-600", bg: "bg-red-50", percentile: "Bottom 15%" },
  { max: 999, rating: "Very Poor", color: "text-red-700", bg: "bg-red-50", percentile: "Bottom 5%" },
];

const RATING_THRESHOLDS_FEMALE = [
  { max: 53, rating: "Athlete", color: "text-blue-700", bg: "bg-blue-50", percentile: "Top 1%" },
  { max: 58, rating: "Excellent", color: "text-green-700", bg: "bg-green-50", percentile: "Top 5%" },
  { max: 65, rating: "Good", color: "text-green-600", bg: "bg-green-50", percentile: "Top 20%" },
  { max: 70, rating: "Above Average", color: "text-lime-700", bg: "bg-lime-50", percentile: "Top 40%" },
  { max: 75, rating: "Average", color: "text-amber-700", bg: "bg-amber-50", percentile: "50th percentile" },
  { max: 83, rating: "Below Average", color: "text-orange-700", bg: "bg-orange-50", percentile: "Bottom 30%" },
  { max: 93, rating: "Poor", color: "text-red-600", bg: "bg-red-50", percentile: "Bottom 15%" },
  { max: 999, rating: "Very Poor", color: "text-red-700", bg: "bg-red-50", percentile: "Bottom 5%" },
];

export default function RestingHeartRateAssessmentPage() {
  const [rhr, setRhr] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [result, setResult] = useState<RhrResult | null>(null);

  function calculate() {
    const bpm = parseInt(rhr);
    const a = parseInt(age);
    if (!bpm || bpm < 20 || bpm > 200) return;
    if (!a || a < 10 || a > 120) return;

    const thresholds = sex === "male" ? RATING_THRESHOLDS_MALE : RATING_THRESHOLDS_FEMALE;
    const match = thresholds.find((t) => bpm <= t.max) || thresholds[thresholds.length - 1];

    // Estimated HRmax using Tanaka formula
    const hrMax = Math.round(208 - 0.7 * a);

    // Uth formula for VO2max estimation
    const estimatedVo2Max = parseFloat((15.3 * (hrMax / bpm)).toFixed(1));

    const heartBeatsPerDay = bpm * 60 * 24;
    const heartBeatsPerYear = heartBeatsPerDay * 365;

    const tips: string[] = [];
    if (bpm > 75) {
      tips.push("Regular aerobic exercise (walking, jogging, cycling) 150+ minutes per week can lower RHR by 5-15 BPM over 3-6 months.");
    }
    if (bpm > 70) {
      tips.push("Practice deep breathing or meditation daily. Studies show regular breathwork can reduce RHR by 3-5 BPM.");
    }
    if (bpm > 65) {
      tips.push("Ensure adequate sleep (7-9 hours). Poor sleep elevates resting heart rate and stress hormones.");
    }
    tips.push("Reduce caffeine and alcohol intake, both of which can elevate resting heart rate.");
    tips.push("Stay hydrated. Dehydration forces your heart to work harder, raising RHR.");
    if (bpm < 55) {
      tips.push("Your low RHR suggests excellent cardiovascular fitness. Continue your training and monitor for symptoms like dizziness.");
    }

    setResult({
      rhr: bpm,
      rating: match.rating,
      ratingColor: match.color,
      ratingBg: match.bg,
      percentile: match.percentile,
      estimatedVo2Max,
      hrMax,
      heartBeatsPerDay,
      heartBeatsPerYear,
      tips,
    });
  }

  // Gauge position (map 30-110 BPM to 0-100%)
  const gaugePercent = result
    ? Math.min(100, Math.max(0, ((result.rhr - 30) / 80) * 100))
    : 0;

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        {/* How to measure */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">How to Measure Your Resting Heart Rate</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Sit quietly for 5 minutes before measuring</li>
            <li>Place two fingers on your wrist (radial pulse) or neck (carotid pulse)</li>
            <li>Count heartbeats for 30 seconds and multiply by 2</li>
            <li>Best measured first thing in the morning before getting out of bed</li>
          </ol>
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium mb-2">Sex</label>
          <div className="flex gap-4">
            {(["male", "female"] as Sex[]).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sex"
                  checked={sex === s}
                  onChange={() => setSex(s)}
                  className="accent-primary"
                />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* RHR */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Resting Heart Rate (BPM)
          </label>
          <input
            type="number"
            value={rhr}
            onChange={(e) => setRhr(e.target.value)}
            placeholder="68"
            className="w-full border border-stone-300 rounded-lg px-3 py-2"
          />
          <p className="text-xs text-stone-400 mt-1">
            Normal range: 60-100 BPM. Athletes may be 40-60 BPM.
          </p>
        </div>

        {/* Calculate */}
        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Assess My Heart Rate
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Rating card */}
          <div className={`${result.ratingBg} border border-stone-200 rounded-xl p-6 text-center`}>
            <p className="text-sm text-stone-500 mb-1">Your Resting Heart Rate</p>
            <p className="text-5xl font-bold text-stone-800">{result.rhr} <span className="text-2xl">BPM</span></p>
            <p className={`text-xl font-semibold mt-2 ${result.ratingColor}`}>
              {result.rating}
            </p>
            <p className="text-sm text-stone-500 mt-1">{result.percentile}</p>
          </div>

          {/* Visual gauge */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Heart Rate Scale</h3>
            <div className="relative">
              {/* Gradient bar */}
              <div className="h-6 rounded-full overflow-hidden flex">
                <div className="bg-blue-400 flex-1" />
                <div className="bg-green-400 flex-1" />
                <div className="bg-lime-400 flex-1" />
                <div className="bg-amber-400 flex-1" />
                <div className="bg-orange-400 flex-1" />
                <div className="bg-red-400 flex-1" />
              </div>
              {/* Pointer */}
              <div
                className="absolute -top-1 w-0 h-0 transition-all duration-500"
                style={{ left: `${gaugePercent}%` }}
              >
                <div className="relative -left-2">
                  <div className="w-4 h-4 bg-stone-800 rounded-full border-2 border-white shadow-md" />
                </div>
              </div>
              {/* Labels */}
              <div className="flex justify-between mt-2 text-xs text-stone-500">
                <span>30</span>
                <span>Athlete</span>
                <span>Good</span>
                <span>Average</span>
                <span>Below Avg</span>
                <span>110+</span>
              </div>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500">Est. VO2 Max</p>
              <p className="text-2xl font-bold text-primary">{result.estimatedVo2Max}</p>
              <p className="text-xs text-stone-400">ml/kg/min</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500">Max Heart Rate</p>
              <p className="text-2xl font-bold text-stone-700">{result.hrMax}</p>
              <p className="text-xs text-stone-400">BPM (Tanaka formula)</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-500">Heartbeats/Day</p>
              <p className="text-2xl font-bold text-stone-700">
                {result.heartBeatsPerDay.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400">
                ~{(result.heartBeatsPerYear / 1_000_000).toFixed(1)}M per year
              </p>
            </div>
          </div>

          {/* VO2 Max context */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-3">
              Estimated VO2 Max: {result.estimatedVo2Max} ml/kg/min
            </h3>
            <p className="text-sm text-stone-600 mb-3">
              VO2 max measures your body&apos;s maximum oxygen uptake during exercise.
              This estimate is derived from the Uth formula using your resting heart rate.
            </p>
            <div className="space-y-2 text-sm">
              {[
                { label: "Elite", range: "> 60", color: "bg-blue-200" },
                { label: "Excellent", range: "50-60", color: "bg-green-200" },
                { label: "Good", range: "40-49", color: "bg-lime-200" },
                { label: "Average", range: "30-39", color: "bg-amber-200" },
                { label: "Below Average", range: "< 30", color: "bg-red-200" },
              ].map((level) => (
                <div key={level.label} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${level.color} shrink-0`} />
                  <span className="font-medium w-32">{level.label}</span>
                  <span className="text-stone-500">{level.range} ml/kg/min</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips to improve */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-3">
              {result.rhr > 70 ? "Tips to Lower Your Resting Heart Rate" : "Heart Health Tips"}
            </h3>
            <ul className="space-y-3">
              {result.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-stone-600">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RHR over lifespan */}
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <h3 className="font-semibold text-stone-800 mb-3">
              Understanding Resting Heart Rate
            </h3>
            <div className="space-y-3 text-sm text-stone-600">
              <p>
                Resting heart rate (RHR) is one of the simplest yet most powerful indicators of
                cardiovascular health. A lower RHR generally indicates a more efficient heart that
                pumps more blood with each beat.
              </p>
              <p>
                <strong>Factors that affect RHR:</strong> fitness level, age, body size, medications,
                air temperature, body position, emotional state, caffeine, and overall health.
              </p>
              <p>
                <strong>When to see a doctor:</strong> Consistently above 100 BPM at rest
                (tachycardia) or below 40 BPM with symptoms like dizziness or fainting warrants
                medical evaluation.
              </p>
              <p>
                <strong>Tracking trends matters:</strong> A sudden increase in RHR (5-10 BPM above
                baseline) can indicate illness, overtraining, stress, or dehydration. Track your
                RHR daily for the most useful insights.
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
