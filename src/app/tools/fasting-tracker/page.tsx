"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("fasting-tracker")!;

interface Protocol {
  label: string;
  fastHours: number;
  eatHours: number;
}

const PROTOCOLS: Protocol[] = [
  { label: "16:8", fastHours: 16, eatHours: 8 },
  { label: "18:6", fastHours: 18, eatHours: 6 },
  { label: "20:4", fastHours: 20, eatHours: 4 },
];

function padTwo(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${padTwo(h)}:${padTwo(m)}:${padTwo(s)}`;
}

export default function FastingTrackerPage() {
  const [selectedProtocol, setSelectedProtocol] = useState<string>("16:8");
  const [customFastHours, setCustomFastHours] = useState(16);
  const [customEatHours, setCustomEatHours] = useState(8);
  const [isActive, setIsActive] = useState(false);
  const [fastStartTime, setFastStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fastHours =
    selectedProtocol === "Custom"
      ? customFastHours
      : PROTOCOLS.find((p) => p.label === selectedProtocol)!.fastHours;
  const eatHours =
    selectedProtocol === "Custom"
      ? customEatHours
      : PROTOCOLS.find((p) => p.label === selectedProtocol)!.eatHours;

  const totalCycleSeconds = (fastHours + eatHours) * 3600;
  const fastSeconds = fastHours * 3600;
  const progress = Math.min(elapsed / fastSeconds, 1);
  const isFasting = elapsed < fastSeconds;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive && fastStartTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - fastStartTime.getTime()) / 1000);
        if (diff >= totalCycleSeconds) {
          setElapsed(totalCycleSeconds);
          setIsActive(false);
          setCompleted(true);
          clearTimer();
        } else {
          setElapsed(diff);
        }
      }, 1000);
    }
    return clearTimer;
  }, [isActive, fastStartTime, totalCycleSeconds, clearTimer]);

  function startFast() {
    setFastStartTime(new Date());
    setElapsed(0);
    setIsActive(true);
    setCompleted(false);
  }

  function endFast() {
    setIsActive(false);
    setCompleted(true);
    clearTimer();
  }

  function resetTracker() {
    setIsActive(false);
    setFastStartTime(null);
    setElapsed(0);
    setCompleted(false);
    clearTimer();
  }

  // SVG progress ring values
  const ringSize = 220;
  const strokeWidth = 14;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  const remainingFastSeconds = Math.max(0, fastSeconds - elapsed);
  const remainingTotalSeconds = Math.max(0, totalCycleSeconds - elapsed);

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        {/* Protocol Selector */}
        {!isActive && !completed && (
          <>
            <div>
              <p className="text-sm font-medium text-stone-700 mb-3">
                Select fasting protocol
              </p>
              <div className="flex flex-wrap gap-2">
                {[...PROTOCOLS.map((p) => p.label), "Custom"].map((label) => (
                  <button
                    key={label}
                    onClick={() => setSelectedProtocol(label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedProtocol === label
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {selectedProtocol === "Custom" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    Fast hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={23}
                    value={customFastHours}
                    onChange={(e) =>
                      setCustomFastHours(
                        Math.max(1, Math.min(23, Number(e.target.value)))
                      )
                    }
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-stone-600 mb-1">
                    Eat hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={23}
                    value={customEatHours}
                    onChange={(e) =>
                      setCustomEatHours(
                        Math.max(1, Math.min(23, Number(e.target.value)))
                      )
                    }
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="text-center text-sm text-stone-500">
              {fastHours}h fasting / {eatHours}h eating window
            </div>

            <button
              onClick={startFast}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Start Fast
            </button>
          </>
        )}

        {/* Active Fast */}
        {(isActive || (completed && elapsed > 0)) && (
          <div className="space-y-6">
            {/* Progress Ring */}
            <div className="flex justify-center">
              <div className="relative" style={{ width: ringSize, height: ringSize }}>
                <svg
                  width={ringSize}
                  height={ringSize}
                  className="transform -rotate-90"
                >
                  {/* Background circle */}
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke="#e7e5e4"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={isFasting ? "#f59e0b" : "#22c55e"}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-stone-800">
                    {formatHMS(elapsed)}
                  </span>
                  <span className="text-xs text-stone-400 mt-1">elapsed</span>
                  {isFasting && isActive && (
                    <>
                      <span className="text-sm font-medium text-stone-600 mt-2">
                        remaining: {formatHMS(remainingFastSeconds)}
                      </span>
                    </>
                  )}
                  {!isFasting && isActive && (
                    <span className="text-sm font-medium text-stone-600 mt-2">
                      remaining: {formatHMS(remainingTotalSeconds)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            {!completed && (
              <div className="text-center">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                    isFasting
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isFasting ? "Fasting" : "Eating Window"}
                </span>
              </div>
            )}

            {/* Timeline Bar */}
            <div className="space-y-2">
              <p className="text-xs text-stone-400 font-medium">Timeline</p>
              <div className="w-full h-6 rounded-full overflow-hidden flex bg-stone-100">
                <div
                  className="h-full bg-amber-400 relative"
                  style={{
                    width: `${(fastHours / (fastHours + eatHours)) * 100}%`,
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-amber-900">
                    Fast ({fastHours}h)
                  </span>
                </div>
                <div
                  className="h-full bg-green-400 relative"
                  style={{
                    width: `${(eatHours / (fastHours + eatHours)) * 100}%`,
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-green-900">
                    Eat ({eatHours}h)
                  </span>
                </div>
              </div>
              {/* Progress marker */}
              <div className="relative w-full h-1">
                <div
                  className="absolute top-0 w-2 h-2 bg-stone-700 rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${Math.min(
                      (elapsed / totalCycleSeconds) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Completed Message */}
            {completed && (
              <div className="text-center bg-green-50 border border-green-200 rounded-xl p-6 space-y-2">
                <p className="text-2xl font-bold text-green-700">
                  Fast Complete!
                </p>
                <p className="text-sm text-stone-600">
                  Total duration: {formatHMS(elapsed)}
                </p>
                <p className="text-sm text-stone-600">
                  Protocol: {selectedProtocol === "Custom" ? `Custom ${fastHours}:${eatHours}` : selectedProtocol}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isActive && (
                <button
                  onClick={endFast}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  End Fast
                </button>
              )}
              {completed && (
                <button
                  onClick={resetTracker}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Start New Fast
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
