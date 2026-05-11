"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("tai-chi-breathing-timer")!;

type Technique = "natural" | "reverse" | "flowing";
type Pace = "slow" | "standard" | "fast";
type Phase = "inhale" | "pause-in" | "exhale" | "pause-out";

interface TechniqueConfig {
  label: string;
  phases: { phase: Phase; baseDuration: number }[];
  inhaleNote: string;
  exhaleNote: string;
  description: string;
}

const TECHNIQUES: Record<Technique, TechniqueConfig> = {
  natural: {
    label: "Natural Breathing",
    phases: [
      { phase: "inhale", baseDuration: 6 },
      { phase: "exhale", baseDuration: 6 },
    ],
    inhaleNote: "Inhale... belly rises",
    exhaleNote: "Exhale... belly falls",
    description:
      "Breathe naturally through the nose. On the inhale, allow your belly to expand gently. On the exhale, let it contract. Keep the breath smooth and unhurried.",
  },
  reverse: {
    label: "Reverse Breathing",
    phases: [
      { phase: "inhale", baseDuration: 6 },
      { phase: "exhale", baseDuration: 6 },
    ],
    inhaleNote: "Inhale... belly draws in",
    exhaleNote: "Exhale... belly expands",
    description:
      "An advanced Taoist technique. On the inhale, gently contract the abdomen inward. On the exhale, allow the belly to expand outward. This is the opposite of natural breathing.",
  },
  flowing: {
    label: "Flowing Breath",
    phases: [
      { phase: "inhale", baseDuration: 8 },
      { phase: "pause-in", baseDuration: 2 },
      { phase: "exhale", baseDuration: 8 },
      { phase: "pause-out", baseDuration: 2 },
    ],
    inhaleNote: "Inhale... slow and deep",
    exhaleNote: "Exhale... release fully",
    description:
      "A four-part breath with brief pauses. Inhale deeply, hold gently at the top, exhale slowly, then rest at the bottom before the next cycle. Ideal for moving forms.",
  },
};

const PACE_MULTIPLIERS: Record<Pace, { label: string; multiplier: number }> = {
  slow: { label: "Slow", multiplier: 1.5 },
  standard: { label: "Standard", multiplier: 1 },
  fast: { label: "Slightly Fast", multiplier: 0.75 },
};

const SESSION_DURATIONS = [5, 10, 15, 20];

function getPhaseLabel(phase: Phase, technique: Technique): string {
  const config = TECHNIQUES[technique];
  if (phase === "inhale") return config.inhaleNote;
  if (phase === "exhale") return config.exhaleNote;
  if (phase === "pause-in") return "Hold... be still";
  return "Rest... be still";
}

function getPhaseColor(phase: Phase): string {
  if (phase === "inhale") return "bg-emerald-100";
  if (phase === "exhale") return "bg-sky-100";
  return "bg-amber-50";
}

function getPhaseScale(phase: Phase, progress: number): number {
  if (phase === "inhale") return 1 + 0.3 * progress;
  if (phase === "exhale") return 1.3 - 0.3 * progress;
  if (phase === "pause-in") return 1.3;
  return 1;
}

export default function TaiChiBreathingTimerPage() {
  const [technique, setTechnique] = useState<Technique>("natural");
  const [pace, setPace] = useState<Pace>("standard");
  const [sessionMinutes, setSessionMinutes] = useState(10);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = TECHNIQUES[technique];
  const paceMultiplier = PACE_MULTIPLIERS[pace].multiplier;
  const totalSessionSeconds = sessionMinutes * 60;

  const currentPhase = config.phases[currentPhaseIndex];
  const phaseDuration = currentPhase
    ? currentPhase.baseDuration * paceMultiplier
    : 1;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopSession = useCallback(() => {
    clearTimer();
    setRunning(false);
    setPaused(false);
    setCurrentPhaseIndex(0);
    setPhaseElapsed(0);
    setTotalElapsed(0);
    setCycleCount(0);
  }, [clearTimer]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  useEffect(() => {
    if (!running || paused) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTotalElapsed((prev) => {
        const next = prev + 1;
        if (next >= totalSessionSeconds) {
          stopSession();
          return prev;
        }
        return next;
      });

      setPhaseElapsed((prev) => {
        const next = prev + 1;
        const phases = TECHNIQUES[technique].phases;
        const mult = PACE_MULTIPLIERS[pace].multiplier;
        const dur = phases[currentPhaseIndex].baseDuration * mult;

        if (next >= dur) {
          const nextIndex = currentPhaseIndex + 1;
          if (nextIndex >= phases.length) {
            setCurrentPhaseIndex(0);
            setCycleCount((c) => c + 1);
          } else {
            setCurrentPhaseIndex(nextIndex);
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return clearTimer;
  }, [
    running,
    paused,
    technique,
    pace,
    currentPhaseIndex,
    totalSessionSeconds,
    clearTimer,
    stopSession,
  ]);

  const startSession = () => {
    setCurrentPhaseIndex(0);
    setPhaseElapsed(0);
    setTotalElapsed(0);
    setCycleCount(0);
    setPaused(false);
    setRunning(true);
  };

  const remainingSession = totalSessionSeconds - totalElapsed;
  const remainingMin = Math.floor(remainingSession / 60);
  const remainingSec = remainingSession % 60;

  const phaseRemaining = Math.max(0, Math.ceil(phaseDuration - phaseElapsed));

  const progress = phaseDuration > 0 ? phaseElapsed / phaseDuration : 0;
  const scale = currentPhase
    ? getPhaseScale(currentPhase.phase, progress)
    : 1;
  const circleColor = currentPhase
    ? getPhaseColor(currentPhase.phase)
    : "bg-stone-100";
  const phaseLabel = currentPhase
    ? getPhaseLabel(currentPhase.phase, technique)
    : "";

  return (
    <ToolPageLayout tool={tool}>
      {!running ? (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          {/* Technique Selector */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">
              Breathing Technique
            </h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TECHNIQUES) as Technique[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTechnique(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    technique === t
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {TECHNIQUES[t].label}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-2">
              {config.description}
            </p>
          </div>

          {/* Pace Selector */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Pace</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PACE_MULTIPLIERS) as Pace[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPace(p)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    pace === p
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {PACE_MULTIPLIERS[p].label}
                </button>
              ))}
            </div>
          </div>

          {/* Session Duration */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">
              Session Duration
            </h3>
            <div className="flex flex-wrap gap-2">
              {SESSION_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSessionMinutes(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    sessionMinutes === d
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800">
            <p>
              <strong>{config.label}</strong> at{" "}
              <strong>{PACE_MULTIPLIERS[pace].label}</strong> pace for{" "}
              <strong>{sessionMinutes} minutes</strong>.
            </p>
            <p className="text-xs mt-1 text-emerald-600">
              Each cycle:{" "}
              {config.phases
                .map(
                  (p) =>
                    `${p.phase === "pause-in" || p.phase === "pause-out" ? "Pause" : p.phase.charAt(0).toUpperCase() + p.phase.slice(1)} ${Math.round(p.baseDuration * paceMultiplier)}s`
                )
                .join(" → ")}
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={startSession}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Begin Session
          </button>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          {/* Breathing Circle */}
          <div className="flex flex-col items-center py-8">
            <div
              className={`w-56 h-56 rounded-full mx-auto flex flex-col items-center justify-center border-2 border-stone-200 ${circleColor}`}
              style={{
                transform: `scale(${scale})`,
                transition: `all ${phaseDuration}s ease-in-out`,
              }}
            >
              <p className="text-lg font-semibold text-stone-700 text-center px-4">
                {phaseLabel}
              </p>
              <p className="text-3xl font-bold text-stone-800 mt-2">
                {phaseRemaining}
              </p>
            </div>
          </div>

          {/* Session Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-stone-500">
              Cycle{" "}
              <span className="font-semibold text-stone-700">
                {cycleCount + 1}
              </span>
            </p>
            <p className="text-sm text-stone-500">
              Time remaining:{" "}
              <span className="font-semibold text-stone-700">
                {remainingMin}:{remainingSec.toString().padStart(2, "0")}
              </span>
            </p>
            <p className="text-xs text-stone-400 italic max-w-md mx-auto">
              {config.description}
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={togglePause}
              className="px-6 py-3 rounded-lg font-medium transition-colors bg-sky-100 text-sky-700 hover:bg-sky-200"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={stopSession}
              className="px-6 py-3 rounded-lg font-medium transition-colors bg-stone-100 text-stone-600 hover:bg-stone-200"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
