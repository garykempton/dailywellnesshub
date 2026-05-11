"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("meditation-timer")!;

type TimerState = "config" | "countdown" | "meditating" | "complete";

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

const INTERVAL_OPTIONS = [
  { label: "None", value: 0 },
  { label: "Every 5 min", value: 5 },
  { label: "Every 10 min", value: 10 },
  { label: "Every 15 min", value: 15 },
  { label: "Halfway", value: -1 },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MeditationTimerPage() {
  const [state, setState] = useState<TimerState>("config");
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [customDuration, setCustomDuration] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [intervalBell, setIntervalBell] = useState(0);

  const [countdownLeft, setCountdownLeft] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sessionNote, setSessionNote] = useState("");
  const [bellFlash, setBellFlash] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsRef = useRef({ duration: 0, interval: 0 });

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  function startSession() {
    const mins = useCustom ? Number(customDuration) || 10 : durationMinutes;
    const total = mins * 60;
    settingsRef.current = { duration: total, interval: intervalBell };
    setTotalSeconds(total);
    setSecondsLeft(total);
    setElapsed(0);
    setPaused(false);
    setCountdownLeft(3);
    setState("countdown");
  }

  function endSession() {
    clearTimer();
    setState("complete");
  }

  function resetToConfig() {
    clearTimer();
    setState("config");
    setPaused(false);
    setSessionNote("");
  }

  // Countdown effect
  useEffect(() => {
    if (state !== "countdown") return;

    intervalRef.current = setInterval(() => {
      setCountdownLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setState("meditating");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [state, clearTimer]);

  // Meditation timer effect
  useEffect(() => {
    if (state !== "meditating" || paused) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setState("complete");
          return 0;
        }

        const newElapsed = settingsRef.current.duration - prev + 1;
        const bellInterval = settingsRef.current.interval;

        // Check for interval bell
        if (bellInterval > 0 && newElapsed > 0 && newElapsed % (bellInterval * 60) === 0) {
          setBellFlash(true);
          setTimeout(() => setBellFlash(false), 1500);
        } else if (
          bellInterval === -1 &&
          newElapsed === Math.floor(settingsRef.current.duration / 2)
        ) {
          setBellFlash(true);
          setTimeout(() => setBellFlash(false), 1500);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [state, paused, clearTimer]);

  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;

  // SVG circle dimensions
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  return (
    <ToolPageLayout tool={tool}>
      {state === "config" && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-6">
          {/* Duration selection */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Session Duration</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDurationMinutes(d);
                    setUseCustom(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    !useCustom && durationMinutes === d
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-stone-300 text-stone-600 hover:border-indigo-400"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-stone-500">Custom:</span>
              <input
                type="number"
                min={1}
                max={120}
                placeholder="min"
                value={customDuration}
                onChange={(e) => {
                  setCustomDuration(e.target.value);
                  setUseCustom(true);
                }}
                onFocus={() => setUseCustom(true)}
                className="w-20 border border-stone-300 rounded-lg px-3 py-2 text-sm"
              />
              <span className="text-sm text-stone-400">minutes</span>
            </div>
          </div>

          {/* Interval bell */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Interval Bell</p>
            <div className="flex flex-wrap gap-2">
              {INTERVAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setIntervalBell(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    intervalBell === opt.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-stone-300 text-stone-600 hover:border-indigo-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start */}
          <button
            onClick={startSession}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Begin Session
          </button>
        </div>
      )}

      {state === "countdown" && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-10 text-center space-y-6">
          <p className="text-indigo-500 text-lg font-medium">Preparing...</p>
          <p className="text-8xl font-bold text-indigo-700 tabular-nums">
            {countdownLeft}
          </p>
          <p className="text-indigo-400 text-sm">Find a comfortable position and close your eyes</p>
        </div>
      )}

      {state === "meditating" && (
        <div
          className={`bg-indigo-50 border border-indigo-200 rounded-xl p-8 space-y-6 transition-colors duration-500 ${
            bellFlash ? "bg-indigo-100" : ""
          }`}
        >
          <p className="text-center text-indigo-500 text-lg font-medium tracking-wide">
            Breathe...
          </p>

          {/* Circular progress ring */}
          <div className="flex justify-center">
            <div className="relative">
              <svg width="220" height="220" className="-rotate-90">
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="#e0e7ff"
                  strokeWidth="8"
                />
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-stone-800 tabular-nums">
                  {formatTime(secondsLeft)}
                </p>
                <p className="text-sm text-stone-500 mt-1">remaining</p>
              </div>
            </div>
          </div>

          {/* Elapsed */}
          <p className="text-center text-sm text-stone-400">
            Elapsed: {formatTime(elapsed)}
          </p>

          {bellFlash && (
            <p className="text-center text-indigo-600 font-medium animate-pulse">
              Interval bell
            </p>
          )}

          {/* Controls */}
          <div className="flex gap-3 max-w-sm mx-auto">
            <button
              onClick={() => setPaused((p) => !p)}
              className="flex-1 border border-indigo-300 bg-white py-3 rounded-lg font-medium text-indigo-600 hover:border-indigo-500 transition-colors"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={endSession}
              className="flex-1 border border-stone-300 bg-white py-3 rounded-lg font-medium text-stone-600 hover:border-stone-500 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      )}

      {state === "complete" && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-3xl font-bold text-indigo-600">Session Complete</p>
            <p className="text-stone-500">
              You meditated for{" "}
              <span className="font-semibold text-stone-700">{formatTime(elapsed)}</span>
            </p>
          </div>

          {/* Session summary */}
          <div className="bg-indigo-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Duration completed</span>
              <span className="font-medium text-stone-700">{formatTime(elapsed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Target duration</span>
              <span className="font-medium text-stone-700">{formatTime(totalSeconds)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Completion</span>
              <span className="font-medium text-stone-700">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="font-medium text-stone-700 mb-1 text-sm">Session notes</p>
            <textarea
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              placeholder="How did the session feel? Any observations..."
              rows={3}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>

          <button
            onClick={resetToConfig}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Start New Session
          </button>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About meditation practice</p>
        <p>
          Regular meditation has been shown to reduce stress, improve focus, and
          support emotional well-being. Even short sessions of 5 to 10 minutes
          can make a meaningful difference when practiced consistently. There is
          no single correct way to meditate; simply sitting quietly, focusing on
          your breath, and gently returning your attention when it wanders is a
          solid foundation. This tool is for informational purposes only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
