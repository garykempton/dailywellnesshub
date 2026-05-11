"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("gym-rest-timer")!;

type TimerState = "idle" | "resting" | "ready";
type Preset = "strength" | "hypertrophy" | "endurance" | "power" | "custom";

const PRESET_DURATIONS: Record<Exclude<Preset, "custom">, { min: number; max: number; default: number }> = {
  strength: { min: 180, max: 300, default: 240 },
  hypertrophy: { min: 60, max: 90, default: 75 },
  endurance: { min: 30, max: 45, default: 35 },
  power: { min: 120, max: 180, default: 150 },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function GymRestTimerPage() {
  const [preset, setPreset] = useState<Preset>("hypertrophy");
  const [customDuration, setCustomDuration] = useState(90);
  const [autoStart, setAutoStart] = useState(false);

  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [setCount, setSetCount] = useState(0);
  const [workoutElapsed, setWorkoutElapsed] = useState(0);
  const [flash, setFlash] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const workoutIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getDuration = useCallback((): number => {
    if (preset === "custom") return customDuration;
    return PRESET_DURATIONS[preset].default;
  }, [preset, customDuration]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (workoutIntervalRef.current) clearInterval(workoutIntervalRef.current);
    };
  }, []);

  // Timer tick
  useEffect(() => {
    if (timerState === "resting") {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setSetCount((c) => c + 1);
            setFlash(true);
            setTimeout(() => setFlash(false), 1500);

            if (autoStart) {
              // Auto-restart after a brief flash
              setTimeout(() => {
                const dur = getDuration();
                setTotalDuration(dur);
                setTimeRemaining(dur);
                setTimerState("resting");
              }, 1600);
              setTimerState("ready");
            } else {
              setTimerState("ready");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [timerState, autoStart, getDuration]);

  // Workout elapsed timer
  useEffect(() => {
    if (timerState !== "idle" || setCount > 0) {
      if (!workoutIntervalRef.current) {
        workoutIntervalRef.current = setInterval(() => {
          setWorkoutElapsed((prev) => prev + 1);
        }, 1000);
      }
    }
    return () => {};
  }, [timerState, setCount]);

  function startTimer() {
    const dur = getDuration();
    setTotalDuration(dur);
    setTimeRemaining(dur);
    setTimerState("resting");
    if (!workoutIntervalRef.current) {
      workoutIntervalRef.current = setInterval(() => {
        setWorkoutElapsed((prev) => prev + 1);
      }, 1000);
    }
  }

  function pauseResume() {
    if (timerState === "resting") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setTimerState("idle");
    } else if (timerState === "idle" && timeRemaining > 0) {
      setTimerState("resting");
    }
  }

  function resetTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (workoutIntervalRef.current) clearInterval(workoutIntervalRef.current);
    intervalRef.current = null;
    workoutIntervalRef.current = null;
    setTimerState("idle");
    setTimeRemaining(0);
    setTotalDuration(0);
    setSetCount(0);
    setWorkoutElapsed(0);
    setFlash(false);
  }

  function adjustTime(delta: number) {
    setTimeRemaining((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > 600) return 600;
      return next;
    });
    setTotalDuration((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 600) return 600;
      return next;
    });
  }

  // Color coding based on time remaining
  function getTimerColor(): string {
    if (timerState === "ready") return "text-green-500";
    if (totalDuration === 0) return "text-stone-800";
    const fraction = timeRemaining / totalDuration;
    if (fraction > 0.5) return "text-green-500";
    if (fraction > 0.25) return "text-amber-500";
    return "text-red-500";
  }

  function getRingColor(): string {
    if (totalDuration === 0) return "stroke-stone-200";
    const fraction = timeRemaining / totalDuration;
    if (fraction > 0.5) return "stroke-green-500";
    if (fraction > 0.25) return "stroke-amber-500";
    return "stroke-red-500";
  }

  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Configuration */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Training Goal</h2>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "strength", label: "Strength (3-5 min)" },
                { key: "hypertrophy", label: "Hypertrophy (60-90s)" },
                { key: "endurance", label: "Endurance (30-45s)" },
                { key: "power", label: "Power (2-3 min)" },
                { key: "custom", label: "Custom" },
              ] as { key: Preset; label: string }[]
            ).map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  preset === p.key
                    ? "bg-primary text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {preset === "custom" && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Custom Duration (seconds): {customDuration}s
              </label>
              <input
                type="range"
                min={10}
                max={600}
                step={5}
                value={customDuration}
                onChange={(e) => setCustomDuration(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-stone-400">
                <span>10s</span>
                <span>{formatTime(customDuration)}</span>
                <span>10:00</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-700">Auto-start next rest period</span>
            <button
              onClick={() => setAutoStart(!autoStart)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                autoStart ? "bg-primary" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoStart ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div
          className={`bg-white border border-stone-200 rounded-xl p-6 space-y-6 transition-colors ${
            flash ? "bg-yellow-100 border-yellow-400" : ""
          }`}
        >
          {/* Progress Ring */}
          <div className="flex justify-center">
            <div className="relative w-52 h-52">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#e7e5e4"
                  strokeWidth="8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  className={`${getRingColor()} transition-colors`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 0.3s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold tabular-nums ${getTimerColor()}`}>
                  {timerState === "ready" ? "GO!" : formatTime(timeRemaining)}
                </span>
                {timerState === "resting" && (
                  <span className="text-sm text-stone-400 mt-1">resting</span>
                )}
                {timerState === "ready" && !autoStart && (
                  <span className="text-sm text-green-600 mt-1">time to lift</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Adjust */}
          {(timerState === "resting" || (timerState === "idle" && timeRemaining > 0)) && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => adjustTime(-15)}
                className="px-3 py-1.5 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                -15s
              </button>
              <button
                onClick={() => adjustTime(15)}
                className="px-3 py-1.5 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                +15s
              </button>
              <button
                onClick={() => adjustTime(30)}
                className="px-3 py-1.5 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                +30s
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {timerState === "idle" && timeRemaining === 0 && (
              <button
                onClick={startTimer}
                className="bg-primary text-white py-3 px-8 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Start Rest Timer
              </button>
            )}
            {timerState === "resting" && (
              <button
                onClick={pauseResume}
                className="bg-amber-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                Pause
              </button>
            )}
            {timerState === "idle" && timeRemaining > 0 && (
              <button
                onClick={pauseResume}
                className="bg-primary text-white py-3 px-8 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Resume
              </button>
            )}
            {timerState === "ready" && !autoStart && (
              <button
                onClick={startTimer}
                className="bg-primary text-white py-3 px-8 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Start Next Rest
              </button>
            )}
            {(timerState !== "idle" || timeRemaining > 0 || setCount > 0) && (
              <button
                onClick={resetTimer}
                className="bg-stone-200 text-stone-700 py-3 px-8 rounded-lg font-medium hover:bg-stone-300 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t border-stone-100">
            <div>
              <p className="text-2xl font-bold text-stone-800">{setCount}</p>
              <p className="text-xs text-stone-500">Sets Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{formatTime(getDuration())}</p>
              <p className="text-xs text-stone-500">Rest Duration</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{formatTime(workoutElapsed)}</p>
              <p className="text-xs text-stone-500">Workout Time</p>
            </div>
          </div>
        </div>

        {/* Rest Period Guide */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Rest Period Guide</h2>
          <div className="space-y-3">
            {[
              {
                goal: "Strength (1-5 reps)",
                rest: "3-5 minutes",
                reason: "Full phosphocreatine recovery allows maximum force production on the next set.",
              },
              {
                goal: "Hypertrophy (6-12 reps)",
                rest: "60-90 seconds",
                reason: "Shorter rest maintains metabolic stress and muscle tension, key drivers of muscle growth.",
              },
              {
                goal: "Muscular Endurance (15+ reps)",
                rest: "30-45 seconds",
                reason: "Minimal rest builds fatigue tolerance and improves the muscle's ability to sustain work.",
              },
              {
                goal: "Power / Olympic Lifts",
                rest: "2-3 minutes",
                reason: "Adequate recovery preserves movement quality and explosive output for technical lifts.",
              },
            ].map((item) => (
              <div key={item.goal} className="bg-stone-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-stone-800">{item.goal}</span>
                  <span className="text-sm font-medium text-primary">{item.rest}</span>
                </div>
                <p className="text-xs text-stone-500">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
