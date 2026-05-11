"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("cold-plunge-timer")!;

type ExperienceLevel = "beginner" | "intermediate" | "advanced";
type Preset = "quick" | "standard" | "extended" | "custom";
type TempUnit = "C" | "F";

function cToF(c: number): number {
  return Math.round(c * 1.8 + 32);
}

function fToC(f: number): number {
  return Math.round(((f - 32) / 1.8) * 10) / 10;
}

function getRecommendedSeconds(tempC: number, level: ExperienceLevel): number {
  const t = Math.max(0, Math.min(20, tempC));

  if (level === "beginner") {
    // 60s at 15C, scales down to 30s at 5C; min 30s
    const secs = 30 + ((t - 5) / 10) * 30;
    return Math.max(30, Math.round(secs));
  }
  if (level === "intermediate") {
    // 180s at 15C, scales down to 60s at 3C; min 60s
    const secs = 60 + ((t - 3) / 12) * 120;
    return Math.max(60, Math.round(secs));
  }
  // advanced: 600s at 15C, scales down to 120s at 0C; min 120s
  const secs = 120 + (t / 15) * 480;
  return Math.max(120, Math.round(secs));
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getBackgroundClass(tempC: number): string {
  if (tempC <= 5) return "bg-blue-900";
  if (tempC <= 10) return "bg-blue-700";
  if (tempC <= 15) return "bg-blue-500";
  return "bg-blue-400";
}

const MOTIVATIONAL_MESSAGES = [
  "Incredible discipline. You are building mental toughness with every session.",
  "Your body just released a surge of norepinephrine. Enjoy the post-plunge clarity.",
  "Cold exposure complete. You chose discomfort over comfort today.",
  "Well done. Consistency with cold exposure is what drives adaptation.",
  "Session finished. The hardest part was starting, and you did it.",
];

export default function ColdPlungeTimerPage() {
  const [tempC, setTempC] = useState(10);
  const [tempUnit, setTempUnit] = useState<TempUnit>("C");
  const [level, setLevel] = useState<ExperienceLevel>("beginner");
  const [preset, setPreset] = useState<Preset>("standard");
  const [customSeconds, setCustomSeconds] = useState(120);

  const [phase, setPhase] = useState<"config" | "running" | "paused" | "done">("config");
  const [totalDuration, setTotalDuration] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"in" | "out">("in");
  const [motivationalMsg, setMotivationalMsg] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recommended = getRecommendedSeconds(tempC, level);

  function getDuration(): number {
    switch (preset) {
      case "quick":
        return 30;
      case "standard":
        return 120;
      case "extended":
        return 300;
      case "custom":
        return Math.max(10, customSeconds);
    }
  }

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (breathRef.current) {
      clearInterval(breathRef.current);
      breathRef.current = null;
    }
  }, []);

  const startBreathing = useCallback(() => {
    setBreathPhase("in");
    breathRef.current = setInterval(() => {
      setBreathPhase((prev) => (prev === "in" ? "out" : "in"));
    }, 4000);
  }, []);

  function handleStart() {
    const dur = getDuration();
    setTotalDuration(dur);
    setRemaining(dur);
    setPhase("running");
    startBreathing();

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimers();
          setPhase("done");
          setMotivationalMsg(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handlePause() {
    clearTimers();
    setPhase("paused");
  }

  function handleResume() {
    setPhase("running");
    startBreathing();

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimers();
          setPhase("done");
          setMotivationalMsg(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleStop() {
    clearTimers();
    const completed = totalDuration - remaining;
    setTotalDuration(completed);
    setRemaining(0);
    setPhase("done");
    setMotivationalMsg(
      completed > 0
        ? MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
        : "Stopped early. No worries, even showing up matters."
    );
  }

  function handleReset() {
    clearTimers();
    setPhase("config");
    setRemaining(0);
    setTotalDuration(0);
  }

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const progress = totalDuration > 0 ? ((totalDuration - remaining) / totalDuration) * 100 : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const displayTemp = tempUnit === "C" ? `${tempC}\u00B0C` : `${cToF(tempC)}\u00B0F`;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {phase === "config" && (
          <>
            {/* Temperature */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Water Temperature</h2>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-stone-800 w-20 text-right">{displayTemp}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTempUnit("C")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    tempUnit === "C"
                      ? "bg-primary text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Celsius
                </button>
                <button
                  onClick={() => setTempUnit("F")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    tempUnit === "F"
                      ? "bg-primary text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Fahrenheit
                </button>
              </div>
            </div>

            {/* Experience level */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Experience Level</h2>
              <div className="grid grid-cols-3 gap-3">
                {(["beginner", "intermediate", "advanced"] as ExperienceLevel[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`border rounded-lg py-3 px-2 text-sm font-medium capitalize transition-colors ${
                      level === l
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-stone-300 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-sm text-stone-500">
                Recommended duration at {displayTemp}:{" "}
                <strong className="text-stone-700">{formatTime(recommended)}</strong>
              </p>
            </div>

            {/* Duration presets */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Duration</h2>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["quick", "Quick Dip (0:30)"],
                    ["standard", "Standard (2:00)"],
                    ["extended", "Extended (5:00)"],
                    ["custom", "Custom"],
                  ] as [Preset, string][]
                ).map(([p, label]) => (
                  <button
                    key={p}
                    onClick={() => setPreset(p)}
                    className={`border rounded-lg py-3 px-3 text-sm font-medium transition-colors ${
                      preset === p
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-stone-300 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {preset === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    Custom duration (seconds)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1800}
                    value={customSeconds}
                    onChange={(e) => setCustomSeconds(Math.max(10, Number(e.target.value)))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2"
                  />
                  <p className="text-xs text-stone-400 mt-1">{formatTime(customSeconds)}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Start Cold Plunge Timer
            </button>
          </>
        )}

        {(phase === "running" || phase === "paused") && (
          <div className="space-y-6">
            {/* Safety warning */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-center">
              <p className="text-sm font-medium text-amber-800">
                Exit immediately if you feel dizzy, numb, or unwell
              </p>
            </div>

            {/* Timer display */}
            <div
              className={`rounded-xl p-8 text-center text-white transition-colors ${getBackgroundClass(tempC)}`}
            >
              <p className="text-sm opacity-80 mb-1">{displayTemp}</p>

              {/* Progress ring */}
              <div className="relative w-52 h-52 mx-auto my-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold font-mono">{formatTime(remaining)}</span>
                  <span className="text-sm opacity-70 mt-1">remaining</span>
                </div>
              </div>

              {/* Breathing cue */}
              <div className="h-10 flex items-center justify-center">
                {phase === "running" ? (
                  <p className="text-lg font-medium animate-pulse">
                    {breathPhase === "in" ? "Breathe in\u2026" : "Breathe out\u2026"}
                  </p>
                ) : (
                  <p className="text-lg font-medium opacity-60">Paused</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {phase === "running" ? (
                <button
                  onClick={handlePause}
                  className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-lg font-medium hover:bg-stone-300 transition-colors"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Resume
                </button>
              )}
              <button
                onClick={handleStop}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="space-y-6">
            {/* Session summary */}
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-stone-800">Session Complete</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Duration</p>
                  <p className="text-2xl font-bold text-stone-800">{formatTime(totalDuration)}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-xs text-stone-500 uppercase tracking-wide">Water Temp</p>
                  <p className="text-2xl font-bold text-stone-800">{displayTemp}</p>
                </div>
              </div>
              <p className="text-stone-600 italic">{motivationalMsg}</p>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              New Session
            </button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
