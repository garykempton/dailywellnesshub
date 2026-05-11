"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("breathing-timer")!;

interface Technique {
  id: string;
  label: string;
  phases: { name: string; duration: number }[];
}

const TECHNIQUES: Technique[] = [
  {
    id: "box",
    label: "Box Breathing",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Exhale", duration: 4 },
      { name: "Hold", duration: 4 },
    ],
  },
  {
    id: "478",
    label: "4-7-8 Breathing",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 7 },
      { name: "Exhale", duration: 8 },
    ],
  },
  {
    id: "belly",
    label: "Deep Belly",
    phases: [
      { name: "Inhale", duration: 5 },
      { name: "Exhale", duration: 5 },
    ],
  },
];

const DURATIONS = [2, 5, 10];

function getCycleLength(technique: Technique): number {
  return technique.phases.reduce((sum, p) => sum + p.duration, 0);
}

function getPhaseStyle(phaseName: string): { bg: string; scale: number } {
  switch (phaseName) {
    case "Inhale":
      return { bg: "bg-blue-100", scale: 1.15 };
    case "Hold":
      return { bg: "bg-amber-100", scale: 1.0 };
    case "Exhale":
      return { bg: "bg-green-100", scale: 0.85 };
    default:
      return { bg: "bg-stone-100", scale: 1.0 };
  }
}

export default function BreathingTimerPage() {
  const [techniqueId, setTechniqueId] = useState("box");
  const [sessionMinutes, setSessionMinutes] = useState(5);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  // Timer state
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(0);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const technique = TECHNIQUES.find((t) => t.id === techniqueId)!;
  const cycleLen = getCycleLength(technique);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  function start() {
    const cycles = Math.floor((sessionMinutes * 60) / cycleLen);
    setTotalCycles(cycles < 1 ? 1 : cycles);
    setCurrentCycle(1);
    setPhaseIndex(0);
    setSecondsLeft(technique.phases[0].duration);
    setFinished(false);
    setRunning(true);
    setPaused(false);
  }

  function stop() {
    clearTimer();
    setRunning(false);
    setPaused(false);
    setFinished(false);
  }

  function togglePause() {
    setPaused((p) => !p);
  }

  // Main timer effect
  useEffect(() => {
    if (!running || paused) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Phase ended, move to next phase
        setPhaseIndex((prevPhase) => {
          const nextPhase = prevPhase + 1;

          if (nextPhase >= technique.phases.length) {
            // Cycle ended
            setCurrentCycle((prevCycle) => {
              setTotalCycles((tc) => {
                if (prevCycle >= tc) {
                  // Session complete
                  clearTimer();
                  setRunning(false);
                  setFinished(true);
                  return tc;
                }
                // Start next cycle
                setSecondsLeft(technique.phases[0].duration);
                return tc;
              });
              return prevCycle + 1;
            });
            return 0;
          }

          // Next phase in current cycle
          setSecondsLeft(technique.phases[nextPhase].duration);
          return nextPhase;
        });

        return prev;
      });
    }, 1000);

    return () => clearTimer();
  }, [running, paused, technique, clearTimer]);

  const currentPhase = technique.phases[phaseIndex] || technique.phases[0];
  const phaseStyle = getPhaseStyle(currentPhase.name);

  return (
    <ToolPageLayout tool={tool}>
      {!running && !finished && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          {/* Technique selector */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Technique</p>
            <div className="flex flex-wrap gap-2">
              {TECHNIQUES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTechniqueId(t.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    techniqueId === t.id
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 text-stone-600 hover:border-stone-500"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-2">
              {technique.phases.map((p) => `${p.name} ${p.duration}s`).join(" → ")}
            </p>
          </div>

          {/* Duration selector */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Session Duration</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSessionMinutes(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    sessionMinutes === d
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 text-stone-600 hover:border-stone-500"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-2">
              ~{Math.max(1, Math.floor((sessionMinutes * 60) / cycleLen))} cycles
            </p>
          </div>

          <button
            onClick={start}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {running && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          {/* Visual circle */}
          <div className="flex justify-center">
            <div
              className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${phaseStyle.bg}`}
              style={{ transform: `scale(${phaseStyle.scale})` }}
            >
              <p className="text-2xl font-bold text-stone-800">
                {currentPhase.name}
              </p>
              <p className="text-5xl font-bold text-stone-700 mt-1">
                {secondsLeft}
              </p>
            </div>
          </div>

          {/* Cycle counter */}
          <p className="text-center text-sm text-stone-500 font-medium">
            Cycle {currentCycle} of {totalCycles}
          </p>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={togglePause}
              className="flex-1 border border-stone-300 py-3 rounded-lg font-medium text-stone-600 hover:border-stone-500 transition-colors"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={stop}
              className="flex-1 border border-red-300 py-3 rounded-lg font-medium text-red-600 hover:border-red-500 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {finished && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center space-y-4">
          <div className="w-48 h-48 rounded-full bg-green-100 flex flex-col items-center justify-center mx-auto">
            <p className="text-2xl font-bold text-green-700">Done</p>
            <p className="text-sm text-green-600 mt-1">Session complete</p>
          </div>
          <p className="text-stone-600">
            You completed {totalCycles} cycles of {technique.label} in {sessionMinutes} minutes.
          </p>
          <button
            onClick={() => {
              setFinished(false);
            }}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Start New Session
          </button>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About breathing exercises</p>
        <p>
          Controlled breathing activates the parasympathetic nervous system,
          lowering heart rate and reducing stress hormones. Box breathing is
          popular with athletes and military personnel, 4-7-8 is ideal for
          relaxation and sleep, and deep belly breathing is a simple
          foundation for mindfulness practice. This tool is for informational
          purposes only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
