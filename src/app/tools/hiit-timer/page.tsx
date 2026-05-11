"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("hiit-timer")!;

type Phase = "idle" | "warmup" | "work" | "rest" | "cooldown" | "done";

interface Preset {
  label: string;
  work: number;
  rest: number;
  rounds: number;
  warmup: number;
  cooldown: number;
}

const PRESETS: Preset[] = [
  { label: "Tabata (20/10 x 8)", work: 20, rest: 10, rounds: 8, warmup: 60, cooldown: 60 },
  { label: "30/30 x 10", work: 30, rest: 30, rounds: 10, warmup: 60, cooldown: 60 },
  { label: "45/15 x 8", work: 45, rest: 15, rounds: 8, warmup: 60, cooldown: 60 },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function phaseColor(phase: Phase): string {
  switch (phase) {
    case "warmup":
      return "bg-yellow-50 border-yellow-300";
    case "work":
      return "bg-green-50 border-green-300";
    case "rest":
      return "bg-red-50 border-red-300";
    case "cooldown":
      return "bg-blue-50 border-blue-300";
    case "done":
      return "bg-stone-50 border-stone-300";
    default:
      return "bg-white border-stone-200";
  }
}

function phaseTextColor(phase: Phase): string {
  switch (phase) {
    case "warmup":
      return "text-yellow-700";
    case "work":
      return "text-green-700";
    case "rest":
      return "text-red-700";
    case "cooldown":
      return "text-blue-700";
    case "done":
      return "text-stone-700";
    default:
      return "text-stone-700";
  }
}

function phaseLabel(phase: Phase): string {
  switch (phase) {
    case "warmup":
      return "WARMUP";
    case "work":
      return "WORK";
    case "rest":
      return "REST";
    case "cooldown":
      return "COOLDOWN";
    case "done":
      return "DONE";
    default:
      return "";
  }
}

export default function HiitTimerPage() {
  const [workSeconds, setWorkSeconds] = useState(30);
  const [restSeconds, setRestSeconds] = useState(30);
  const [rounds, setRounds] = useState(8);
  const [warmupSeconds, setWarmupSeconds] = useState(60);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentRound, setCurrentRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Snapshot settings at start so mid-workout changes don't break things
  const settingsRef = useRef({
    work: workSeconds,
    rest: restSeconds,
    rounds,
    warmup: warmupSeconds,
    cooldown: cooldownSeconds,
  });

  const totalWorkoutTime =
    warmupSeconds + rounds * (workSeconds + restSeconds) - restSeconds + cooldownSeconds;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  function applyPreset(index: number) {
    const p = PRESETS[index];
    setWorkSeconds(p.work);
    setRestSeconds(p.rest);
    setRounds(p.rounds);
    setWarmupSeconds(p.warmup);
    setCooldownSeconds(p.cooldown);
    setActivePreset(index);
  }

  function startWorkout() {
    const s = {
      work: workSeconds,
      rest: restSeconds,
      rounds,
      warmup: warmupSeconds,
      cooldown: cooldownSeconds,
    };
    settingsRef.current = s;
    setTotalElapsed(0);
    setPaused(false);

    if (s.warmup > 0) {
      setPhase("warmup");
      setSecondsLeft(s.warmup);
      setCurrentRound(0);
    } else {
      setPhase("work");
      setSecondsLeft(s.work);
      setCurrentRound(1);
    }
  }

  function stopWorkout() {
    clearTimer();
    setPhase("idle");
    setPaused(false);
    setTotalElapsed(0);
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
      setTotalElapsed((e) => e + 1);
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        const s = settingsRef.current;

        // Transition logic
        if (phase === "warmup") {
          setPhase("work");
          setCurrentRound(1);
          return s.work;
        }

        if (phase === "work") {
          setCurrentRound((r) => {
            if (r >= s.rounds) {
              // Last round done, go to cooldown or done
              if (s.cooldown > 0) {
                setPhase("cooldown");
                setSecondsLeft(s.cooldown);
              } else {
                setPhase("done");
                clearTimer();
              }
              return r;
            }
            // Go to rest
            setPhase("rest");
            setSecondsLeft(s.rest);
            return r;
          });
          return prev;
        }

        if (phase === "rest") {
          setPhase("work");
          setCurrentRound((r) => r + 1);
          return s.work;
        }

        if (phase === "cooldown") {
          setPhase("done");
          clearTimer();
          return 0;
        }

        return prev;
      });
    }, 1000);

    return () => clearTimer();
  }, [phase, paused, clearTimer]);

  // Calculate progress
  const snapshotTotal =
    settingsRef.current.warmup +
    settingsRef.current.rounds *
      (settingsRef.current.work + settingsRef.current.rest) -
    settingsRef.current.rest +
    settingsRef.current.cooldown;
  const progress = snapshotTotal > 0 ? Math.min(totalElapsed / snapshotTotal, 1) : 0;

  return (
    <ToolPageLayout tool={tool}>
      {phase === "idle" && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          {/* Preset buttons */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activePreset === i
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 text-stone-600 hover:border-stone-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => setActivePreset(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activePreset === null
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 text-stone-600 hover:border-stone-500"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Work interval */}
          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Work Interval: {workSeconds}s
            </label>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={workSeconds}
              onChange={(e) => {
                setWorkSeconds(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>5s</span>
              <span>120s</span>
            </div>
          </div>

          {/* Rest interval */}
          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Rest Interval: {restSeconds}s
            </label>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={restSeconds}
              onChange={(e) => {
                setRestSeconds(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>5s</span>
              <span>120s</span>
            </div>
          </div>

          {/* Rounds */}
          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Rounds: {rounds}
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={rounds}
              onChange={(e) => {
                setRounds(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>1</span>
              <span>30</span>
            </div>
          </div>

          {/* Warmup */}
          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Warmup: {warmupSeconds}s
            </label>
            <input
              type="range"
              min={0}
              max={300}
              step={15}
              value={warmupSeconds}
              onChange={(e) => {
                setWarmupSeconds(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>0s</span>
              <span>300s</span>
            </div>
          </div>

          {/* Cooldown */}
          <div>
            <label className="block font-medium text-stone-800 mb-1">
              Cooldown: {cooldownSeconds}s
            </label>
            <input
              type="range"
              min={0}
              max={300}
              step={15}
              value={cooldownSeconds}
              onChange={(e) => {
                setCooldownSeconds(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>0s</span>
              <span>300s</span>
            </div>
          </div>

          {/* Total workout time */}
          <p className="text-center text-sm text-stone-500">
            Total workout time: <span className="font-semibold text-stone-700">{formatTime(totalWorkoutTime)}</span>
          </p>

          <button
            onClick={startWorkout}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Start Workout
          </button>
        </div>
      )}

      {phase !== "idle" && phase !== "done" && (
        <div
          className={`border rounded-xl p-6 space-y-6 transition-colors duration-300 ${phaseColor(phase)}`}
        >
          {/* Phase indicator */}
          <p
            className={`text-center text-lg font-bold tracking-widest ${phaseTextColor(phase)}`}
          >
            {phaseLabel(phase)}
          </p>

          {/* Large countdown */}
          <p className="text-center text-8xl font-bold text-stone-800 tabular-nums">
            {secondsLeft}
          </p>

          {/* Round counter */}
          {(phase === "work" || phase === "rest") && (
            <p className="text-center text-stone-600 font-medium">
              Round {currentRound} of {settingsRef.current.rounds}
            </p>
          )}

          {/* Elapsed time */}
          <p className="text-center text-sm text-stone-500">
            Elapsed: {formatTime(totalElapsed)}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
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
              onClick={stopWorkout}
              className="flex-1 border border-red-300 bg-white py-3 rounded-lg font-medium text-red-600 hover:border-red-500 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center space-y-4">
          <p className="text-4xl font-bold text-green-600">Workout Complete!</p>
          <p className="text-stone-600">
            You completed {settingsRef.current.rounds} rounds in{" "}
            {formatTime(totalElapsed)}.
          </p>
          <button
            onClick={stopWorkout}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Start New Workout
          </button>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About HIIT training</p>
        <p>
          High-intensity interval training alternates short bursts of intense
          exercise with recovery periods. Research shows HIIT can improve
          cardiovascular fitness, boost metabolism, and burn calories efficiently
          in shorter sessions compared to steady-state cardio. Tabata, one of the
          most popular protocols, uses 20 seconds of all-out effort followed by 10
          seconds of rest for 8 rounds. Adjust work-to-rest ratios based on your
          fitness level and goals. This tool is for informational purposes only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
