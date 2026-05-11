"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("sauna-timer")!;

type SaunaType = "traditional" | "infrared" | "steam";
type Level = "beginner" | "regular" | "experienced";
type Structure = "single" | "two-rounds" | "three-rounds";
type Phase = "heat" | "cooldown" | "done";

interface SaunaConfig {
  label: string;
  tempRange: string;
  durations: Record<Level, [number, number]>;
}

const SAUNA_TYPES: Record<SaunaType, SaunaConfig> = {
  traditional: {
    label: "Traditional / Finnish",
    tempRange: "80-100\u00B0C",
    durations: {
      beginner: [5, 10],
      regular: [10, 15],
      experienced: [15, 20],
    },
  },
  infrared: {
    label: "Infrared",
    tempRange: "45-65\u00B0C",
    durations: {
      beginner: [15, 15],
      regular: [20, 30],
      experienced: [30, 45],
    },
  },
  steam: {
    label: "Steam Room",
    tempRange: "40-50\u00B0C",
    durations: {
      beginner: [5, 10],
      regular: [10, 15],
      experienced: [15, 20],
    },
  },
};

const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "regular", label: "Regular" },
  { value: "experienced", label: "Experienced" },
];

const STRUCTURES: { value: Structure; label: string; rounds: number }[] = [
  { value: "single", label: "Single session", rounds: 1 },
  { value: "two-rounds", label: "2 rounds with cool-down", rounds: 2 },
  { value: "three-rounds", label: "3 rounds (Finnish style)", rounds: 3 },
];

const COOLDOWN_SECONDS = 5 * 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function SaunaTimerPage() {
  const [saunaType, setSaunaType] = useState<SaunaType>("traditional");
  const [level, setLevel] = useState<Level>("beginner");
  const [structure, setStructure] = useState<Structure>("single");
  const [heatMinutes, setHeatMinutes] = useState(10);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>("heat");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(1);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [totalHeatTime, setTotalHeatTime] = useState(0);
  const [showHydration, setShowHydration] = useState(false);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hydrationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = SAUNA_TYPES[saunaType];
  const recommended = config.durations[level];

  // Update heat minutes when type or level changes
  useEffect(() => {
    const mid = Math.round((recommended[0] + recommended[1]) / 2);
    setHeatMinutes(mid);
  }, [recommended]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (hydrationRef.current) {
      clearInterval(hydrationRef.current);
      hydrationRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  function start() {
    const rounds = STRUCTURES.find((s) => s.value === structure)!.rounds;
    setTotalRounds(rounds);
    setCurrentRound(1);
    setPhase("heat");
    setSecondsLeft(heatMinutes * 60);
    setTotalElapsed(0);
    setTotalHeatTime(0);
    setFinished(false);
    setRunning(true);
    setPaused(false);
    setShowHydration(false);
  }

  function stop() {
    clearTimers();
    setRunning(false);
    setPaused(false);
    setFinished(false);
  }

  function togglePause() {
    setPaused((p) => !p);
  }

  // Main timer
  useEffect(() => {
    if (!running || paused) {
      clearTimers();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTotalElapsed((prev) => prev + 1);

      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Phase ended
        setPhase((currentPhase) => {
          if (currentPhase === "heat") {
            setTotalHeatTime((ht) => ht + heatMinutes * 60);
            setCurrentRound((r) => {
              if (r >= totalRounds) {
                // All rounds done
                clearTimers();
                setRunning(false);
                setFinished(true);
                return r;
              }
              // Start cooldown
              setSecondsLeft(COOLDOWN_SECONDS);
              return r;
            });
            return totalRounds > 1 ? "cooldown" : "done";
          }
          // Cooldown ended, start next heat round
          setCurrentRound((r) => r + 1);
          setSecondsLeft(heatMinutes * 60);
          return "heat";
        });

        return prev;
      });
    }, 1000);

    // Hydration reminder every 5 minutes
    hydrationRef.current = setInterval(() => {
      setShowHydration(true);
      setTimeout(() => setShowHydration(false), 5000);
    }, 5 * 60 * 1000);

    return () => clearTimers();
  }, [running, paused, heatMinutes, totalRounds, clearTimers]);

  const progress =
    phase === "heat"
      ? 1 - secondsLeft / (heatMinutes * 60)
      : 1 - secondsLeft / COOLDOWN_SECONDS;

  const estimatedCalories = Math.round(totalHeatTime / 60 * 1.5 * 70);

  return (
    <ToolPageLayout tool={tool}>
      {!running && !finished && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
          {/* Sauna Type */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Sauna Type</p>
            <select
              value={saunaType}
              onChange={(e) => setSaunaType(e.target.value as SaunaType)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              {(Object.keys(SAUNA_TYPES) as SaunaType[]).map((key) => (
                <option key={key} value={key}>
                  {SAUNA_TYPES[key].label} ({SAUNA_TYPES[key].tempRange})
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Experience Level</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    level === l.value
                      ? "bg-primary text-white border-primary"
                      : "border-stone-300 text-stone-600 hover:border-stone-500"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session Structure */}
          <div>
            <p className="font-medium text-stone-800 mb-2">Session Structure</p>
            <select
              value={structure}
              onChange={(e) => setStructure(e.target.value as Structure)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            >
              {STRUCTURES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Preset */}
          <div>
            <p className="font-medium text-stone-800 mb-2">
              Heat Duration per Round
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {[recommended[0], Math.round((recommended[0] + recommended[1]) / 2), recommended[1]].map(
                (mins) => (
                  <button
                    key={mins}
                    onClick={() => setHeatMinutes(mins)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      heatMinutes === mins
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {mins} min
                  </button>
                )
              )}
            </div>
            <p className="text-xs text-stone-400">
              Recommended: {recommended[0]}-{recommended[1]} min for{" "}
              {level} users
            </p>
          </div>

          <button
            onClick={start}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Start Sauna Session
          </button>
        </div>
      )}

      {running && (
        <div className="space-y-4">
          {/* Hydration popup */}
          {showHydration && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center animate-pulse">
              <p className="text-lg font-semibold text-blue-700">
                Drink water!
              </p>
              <p className="text-sm text-blue-600">
                Stay hydrated during your sauna session.
              </p>
            </div>
          )}

          <div
            className={`rounded-xl p-6 space-y-6 border ${
              phase === "heat"
                ? "bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200"
                : "bg-gradient-to-b from-blue-50 to-cyan-50 border-blue-200"
            }`}
          >
            {/* Phase indicator */}
            <div className="text-center">
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
                  phase === "heat"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {phase === "heat" ? "Heat" : "Cool Down"}
              </span>
              {totalRounds > 1 && (
                <p className="text-sm text-stone-500 mt-1">
                  Round {currentRound} of {totalRounds}
                </p>
              )}
            </div>

            {/* Temperature display */}
            <p className="text-center text-sm text-stone-500">
              {config.label} &mdash; {config.tempRange}
            </p>

            {/* Countdown */}
            <div className="text-center">
              <p className="text-6xl font-bold text-stone-800 font-mono">
                {formatTime(secondsLeft)}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  phase === "heat"
                    ? "bg-gradient-to-r from-amber-400 to-red-500"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500"
                }`}
                style={{ width: `${Math.min(progress * 100, 100)}%` }}
              />
            </div>

            {/* Total elapsed */}
            <p className="text-center text-xs text-stone-400">
              Total session time: {formatTime(totalElapsed)}
            </p>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={togglePause}
                className="flex-1 border border-stone-300 py-3 rounded-lg font-medium text-stone-600 hover:border-stone-500 transition-colors bg-white"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={stop}
                className="flex-1 border border-red-300 py-3 rounded-lg font-medium text-red-600 hover:border-red-500 transition-colors bg-white"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {finished && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
          <div className="text-center">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-green-100 text-green-700">
              Session Complete
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-xs text-stone-500 mb-1">Total Heat Time</p>
              <p className="text-2xl font-bold text-stone-800">
                {formatTime(totalHeatTime)}
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-center">
              <p className="text-xs text-stone-500 mb-1">Rounds Completed</p>
              <p className="text-2xl font-bold text-stone-800">
                {totalRounds}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-xs text-stone-500 mb-1">
                Est. Calories Burned
              </p>
              <p className="text-2xl font-bold text-stone-800">
                ~{estimatedCalories} kcal
              </p>
              <p className="text-xs text-stone-400">Based on ~70 kg</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-stone-500 mb-1">Hydration Reminder</p>
              <p className="text-lg font-bold text-blue-700">
                Drink {totalRounds * 500} ml
              </p>
              <p className="text-xs text-stone-400">~500 ml per round</p>
            </div>
          </div>

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
        <p className="font-semibold text-stone-700 mb-2">About sauna use</p>
        <p>
          Regular sauna bathing has been associated with cardiovascular benefits,
          improved recovery, and stress reduction. Always listen to your body,
          leave if you feel dizzy or unwell, and hydrate before, during, and
          after your session. People with cardiovascular conditions or who are
          pregnant should consult a doctor before using a sauna. Calorie
          estimates are rough approximations and vary by individual. This tool is
          for informational purposes only.
        </p>
      </div>
    </ToolPageLayout>
  );
}
