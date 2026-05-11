"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("plank-timer")!;

type Variation =
  | "standard"
  | "high"
  | "side-left"
  | "side-right"
  | "reverse"
  | "shoulder-taps";

type Phase = "idle" | "plank" | "rest" | "done";

const VARIATIONS: { value: Variation; label: string; tip: string }[] = [
  {
    value: "standard",
    label: "Standard / Forearm Plank",
    tip: "Keep your body in a straight line from head to heels. Engage your core and squeeze your glutes.",
  },
  {
    value: "high",
    label: "High Plank (Arms Extended)",
    tip: "Arms straight, hands under shoulders. Don't let your hips sag or pike up.",
  },
  {
    value: "side-left",
    label: "Side Plank (Left)",
    tip: "Stack your feet or stagger them. Lift hips high, straight line from head to feet.",
  },
  {
    value: "side-right",
    label: "Side Plank (Right)",
    tip: "Stack your feet or stagger them. Lift hips high, straight line from head to feet.",
  },
  {
    value: "reverse",
    label: "Reverse Plank",
    tip: "Hands behind you, fingers toward feet. Lift hips to create straight line.",
  },
  {
    value: "shoulder-taps",
    label: "Plank with Shoulder Taps",
    tip: "From high plank, alternate tapping opposite shoulder. Keep hips still.",
  },
];

const DURATION_PRESETS = [
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "90s", value: 90 },
  { label: "2min", value: 120 },
  { label: "3min", value: 180 },
  { label: "5min", value: 300 },
];

function getMotivation(progress: number): string {
  if (progress >= 1) return "You did it!";
  if (progress >= 0.75) return "Almost done! Hold it!";
  if (progress >= 0.5) return "Halfway there!";
  if (progress >= 0.25) return "25% done!";
  return "Hold strong!";
}

function getFitnessLevel(totalSeconds: number): {
  level: string;
  color: string;
} {
  if (totalSeconds >= 180) return { level: "Elite", color: "text-purple-600" };
  if (totalSeconds >= 90) return { level: "Advanced", color: "text-green-600" };
  if (totalSeconds >= 30)
    return { level: "Intermediate", color: "text-blue-600" };
  return { level: "Beginner", color: "text-stone-600" };
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}`;
}

export default function PlankTimerPage() {
  const [variation, setVariation] = useState<Variation>("standard");
  const [targetSeconds, setTargetSeconds] = useState(60);
  const [customTarget, setCustomTarget] = useState("60");
  const [sets, setSets] = useState(1);
  const [restSeconds, setRestSeconds] = useState(60);

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentSet, setCurrentSet] = useState(1);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  // Snapshot settings at start
  const settingsRef = useRef({
    target: targetSeconds,
    sets,
    rest: restSeconds,
    variation,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Completed stats
  const [completedSets, setCompletedSets] = useState(0);
  const [totalHoldTime, setTotalHoldTime] = useState(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  function handlePreset(value: number) {
    setTargetSeconds(value);
    setCustomTarget(String(value));
  }

  function handleCustomTarget(val: string) {
    setCustomTarget(val);
    const n = parseInt(val, 10);
    if (n >= 10 && n <= 600) {
      setTargetSeconds(n);
    }
  }

  function startTimer() {
    const s = {
      target: targetSeconds,
      sets,
      rest: restSeconds,
      variation,
    };
    settingsRef.current = s;
    setCompletedSets(0);
    setTotalHoldTime(0);
    setCurrentSet(1);
    setSecondsElapsed(0);
    setPaused(false);
    setPhase("plank");
  }

  function stopTimer() {
    clearTimer();
    setPhase("idle");
    setPaused(false);
  }

  function togglePause() {
    setPaused((p) => !p);
  }

  // Timer tick
  useEffect(() => {
    if (phase === "idle" || phase === "done" || paused) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;
        const s = settingsRef.current;

        if (phase === "plank" && next >= s.target) {
          // Set complete
          setTotalHoldTime((t) => t + s.target);
          setCompletedSets((c) => c + 1);

          if (currentSet >= s.sets) {
            // All sets done
            setPhase("done");
            clearTimer();
          } else {
            // Go to rest
            setPhase("rest");
            setSecondsElapsed(0);
          }
          return 0;
        }

        if (phase === "rest" && next >= s.rest) {
          // Rest done, start next set
          setCurrentSet((c) => c + 1);
          setPhase("plank");
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearTimer();
  }, [phase, paused, currentSet, clearTimer]);

  const s = settingsRef.current;
  const currentVariation = VARIATIONS.find((v) => v.value === s.variation);

  // Progress for current phase
  const phaseTarget = phase === "plank" ? s.target : s.rest;
  const progress = phaseTarget > 0 ? Math.min(secondsElapsed / phaseTarget, 1) : 0;
  const remaining =
    phase === "plank"
      ? Math.max(s.target - secondsElapsed, 0)
      : Math.max(s.rest - secondsElapsed, 0);

  return (
    <ToolPageLayout tool={tool}>
      {phase === "idle" && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          {/* Variation */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Plank Variation
            </label>
            <select
              value={variation}
              onChange={(e) => setVariation(e.target.value as Variation)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              {VARIATIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration target */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration Target (seconds)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DURATION_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    targetSeconds === p.value
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 text-stone-600 hover:border-stone-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={10}
              max={600}
              value={customTarget}
              onChange={(e) => handleCustomTarget(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
              placeholder="Custom (10-600)"
            />
          </div>

          {/* Sets */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Sets: {sets}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>1</span>
              <span>5</span>
            </div>
          </div>

          {/* Rest between sets */}
          {sets > 1 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Rest Between Sets: {restSeconds}s
              </label>
              <input
                type="range"
                min={30}
                max={120}
                step={5}
                value={restSeconds}
                onChange={(e) => setRestSeconds(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-stone-400">
                <span>30s</span>
                <span>120s</span>
              </div>
            </div>
          )}

          {/* Summary */}
          <p className="text-center text-sm text-stone-500">
            Total:{" "}
            <span className="font-semibold text-stone-700">
              {sets} set{sets > 1 ? "s" : ""} x {formatTime(targetSeconds)}
              {sets > 1 ? ` (${restSeconds}s rest)` : ""}
            </span>
          </p>

          <button
            onClick={startTimer}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {(phase === "plank" || phase === "rest") && (
        <div
          className={`border rounded-xl p-6 space-y-5 transition-colors duration-300 ${
            phase === "plank"
              ? "bg-green-50 border-green-300"
              : "bg-blue-50 border-blue-300"
          }`}
        >
          {/* Form tip */}
          {phase === "plank" && currentVariation && (
            <div className="bg-white/70 rounded-lg p-3 text-sm text-stone-600">
              <span className="font-semibold text-stone-700">Form tip: </span>
              {currentVariation.tip}
            </div>
          )}

          {/* Phase label */}
          <p
            className={`text-center text-lg font-bold tracking-widest ${
              phase === "plank" ? "text-green-700" : "text-blue-700"
            }`}
          >
            {phase === "plank" ? "PLANK" : "REST"}
          </p>

          {/* Set indicator */}
          {s.sets > 1 && (
            <p className="text-center text-stone-600 font-medium">
              Set {currentSet} of {s.sets}
            </p>
          )}

          {/* Large countdown */}
          <p className="text-center text-8xl font-bold text-stone-800 tabular-nums">
            {remaining}
          </p>

          {/* Motivational message */}
          {phase === "plank" && (
            <p className="text-center text-green-600 font-medium">
              {getMotivation(progress)}
            </p>
          )}

          {/* Progress bar (filling up) */}
          <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                phase === "plank" ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={togglePause}
              className="flex-1 border border-stone-300 bg-white py-3 rounded-lg font-medium text-stone-600 hover:border-stone-500 transition-colors"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={stopTimer}
              className="flex-1 border border-red-300 bg-white py-3 rounded-lg font-medium text-red-600 hover:border-red-500 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {phase === "done" && (() => {
        const fitness = getFitnessLevel(totalHoldTime);
        const doneVariation = VARIATIONS.find(
          (v) => v.value === s.variation
        );
        return (
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center space-y-5">
            <p className="text-4xl font-bold text-green-600">
              Great Work!
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="text-xs text-stone-500">Total Hold Time</p>
                <p className="text-2xl font-bold">
                  {formatTime(totalHoldTime)}
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="text-xs text-stone-500">Sets Completed</p>
                <p className="text-2xl font-bold">
                  {completedSets} / {s.sets}
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="text-xs text-stone-500">Variation</p>
                <p className="text-sm font-semibold">
                  {doneVariation?.label}
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="text-xs text-stone-500">Fitness Level</p>
                <p className={`text-lg font-bold ${fitness.color}`}>
                  {fitness.level}
                </p>
              </div>
            </div>

            <div className="text-sm text-stone-500">
              {totalHoldTime < 30 && (
                <p>
                  Keep practicing! Aim for 30 seconds to reach intermediate
                  level. Consistency is key.
                </p>
              )}
              {totalHoldTime >= 30 && totalHoldTime < 90 && (
                <p>
                  Solid hold! Try increasing your time by 10 seconds each
                  week to build toward the advanced range.
                </p>
              )}
              {totalHoldTime >= 90 && totalHoldTime < 180 && (
                <p>
                  Impressive core strength! You are well above average. Try
                  harder variations to keep progressing.
                </p>
              )}
              {totalHoldTime >= 180 && (
                <p>
                  Elite-level plank hold! Your core stability is
                  exceptional. Consider adding weight or trying dynamic
                  plank variations.
                </p>
              )}
            </div>

            <button
              onClick={stopTimer}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Start New Session
            </button>
          </div>
        );
      })()}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About Plank Exercises</p>
        <p>
          The plank is one of the most effective isometric core exercises,
          engaging the abdominals, obliques, lower back, shoulders, and glutes
          simultaneously. Regular plank training improves posture, reduces back
          pain risk, and builds the deep core stability needed for virtually
          every other exercise. Start with a time you can hold with good form
          and gradually increase. Quality always trumps quantity; a 30-second
          plank with perfect form is better than two minutes of sagging hips.
          This tool is for informational purposes only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
