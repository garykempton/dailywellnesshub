"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("contraction-timer")!;

interface Contraction {
  startTime: number;
  endTime: number | null;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTimeOfDay(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m}:${s} ${ampm}`;
}

function checkPattern(
  contractions: Contraction[],
  freqMinutes: number
): { match: boolean; label: string } {
  const completed = contractions.filter((c) => c.endTime !== null);
  if (completed.length < 3) return { match: false, label: "" };

  const recent = completed.slice(-10);

  // Check if last 3+ contractions match: ~freqMinutes apart, ~1 min long
  let matchCount = 0;
  for (let i = recent.length - 1; i >= 1; i--) {
    const duration = (recent[i].endTime! - recent[i].startTime) / 1000 / 60;
    const freq = (recent[i].startTime - recent[i - 1].startTime) / 1000 / 60;
    const durationMatch = duration >= 0.75 && duration <= 1.5;
    const freqMatch = freq >= freqMinutes - 1.5 && freq <= freqMinutes + 1.5;
    if (durationMatch && freqMatch) {
      matchCount++;
    } else {
      break;
    }
  }

  if (matchCount < 2) return { match: false, label: "" };

  // Check if this has been going for 1+ hour
  const first = recent[recent.length - matchCount - 1];
  const last = recent[recent.length - 1];
  const spanMinutes = (last.startTime - first.startTime) / 1000 / 60;

  if (spanMinutes >= 60) {
    return { match: true, label: `${freqMinutes}-1-1` };
  }
  return { match: false, label: "" };
}

export default function ContractionTimerPage() {
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeContraction =
    contractions.length > 0 && contractions[contractions.length - 1].endTime === null
      ? contractions[contractions.length - 1]
      : null;

  const tick = useCallback(() => {
    if (activeContraction) {
      setElapsed(Date.now() - activeContraction.startTime);
    }
  }, [activeContraction]);

  useEffect(() => {
    if (activeContraction) {
      tickRef.current = setInterval(tick, 1000);
      tick();
      return () => {
        if (tickRef.current) clearInterval(tickRef.current);
      };
    } else {
      setElapsed(0);
    }
  }, [activeContraction, tick]);

  function startContraction() {
    setContractions((prev) => [...prev, { startTime: Date.now(), endTime: null }]);
  }

  function endContraction() {
    setContractions((prev) => {
      const updated = [...prev];
      if (updated.length > 0 && updated[updated.length - 1].endTime === null) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          endTime: Date.now(),
        };
      }
      return updated;
    });
  }

  function clearHistory() {
    if (activeContraction) return;
    setContractions([]);
  }

  const completed = contractions.filter((c) => c.endTime !== null);
  const lastTen = completed.slice(-10).reverse();

  // Stats
  const avgDuration =
    completed.length > 0
      ? completed.reduce((sum, c) => sum + (c.endTime! - c.startTime), 0) /
        completed.length
      : 0;

  let avgFrequency = 0;
  if (completed.length >= 2) {
    let freqSum = 0;
    for (let i = 1; i < completed.length; i++) {
      freqSum += completed[i].startTime - completed[i - 1].startTime;
    }
    avgFrequency = freqSum / (completed.length - 1);
  }

  const pattern511 = checkPattern(contractions, 5);
  const pattern411 = checkPattern(contractions, 4);

  return (
    <ToolPageLayout tool={tool}>
      {/* Pattern Alert */}
      {(pattern511.match || pattern411.match) && (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5 mb-4">
          <p className="text-green-800 font-bold text-lg mb-1">
            {pattern411.match ? "4-1-1" : "5-1-1"} Pattern Detected
          </p>
          <p className="text-green-700 text-sm">
            Your contractions match the{" "}
            {pattern411.match ? "4-1-1" : "5-1-1"} pattern. Consider
            contacting your healthcare provider or heading to your hospital or
            birthing centre.
          </p>
        </div>
      )}

      {/* Main Button */}
      <div className="flex flex-col items-center">
        {activeContraction ? (
          <div className="w-full">
            <div className="bg-white border-2 border-rose-400 rounded-xl p-8 text-center animate-pulse">
              <p className="text-sm text-rose-600 font-medium mb-2">
                Contraction In Progress
              </p>
              <p className="text-5xl font-bold text-rose-700 font-mono">
                {formatDuration(elapsed)}
              </p>
            </div>
            <button
              onClick={endContraction}
              className="w-full mt-4 bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contraction Ended
            </button>
          </div>
        ) : (
          <button
            onClick={startContraction}
            className="w-full bg-rose-500 text-white py-6 rounded-xl text-xl font-medium hover:bg-rose-600 transition-colors"
          >
            Tap When Contraction Starts
          </button>
        )}
      </div>

      {/* Summary Stats */}
      {completed.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-500 mb-1">Total Tracked</p>
            <p className="text-2xl font-bold">{completed.length}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-500 mb-1">Avg Duration</p>
            <p className="text-2xl font-bold">{formatDuration(avgDuration)}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-500 mb-1">Avg Frequency</p>
            <p className="text-2xl font-bold">
              {avgFrequency > 0 ? formatDuration(avgFrequency) : "--"}
            </p>
          </div>
        </div>
      )}

      {/* Contraction History */}
      {lastTen.length > 0 && (
        <div className="mt-6 bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-stone-700">
              Recent Contractions
            </h3>
            {!activeContraction && (
              <button
                onClick={clearHistory}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Clear History
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 px-2 text-stone-500">#</th>
                  <th className="text-left py-2 px-2 text-stone-500">Time</th>
                  <th className="text-right py-2 px-2 text-stone-500">Duration</th>
                  <th className="text-right py-2 px-2 text-stone-500">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {lastTen.map((c) => {
                  const idx = completed.indexOf(c);
                  const duration = c.endTime! - c.startTime;
                  let frequency: number | null = null;
                  if (idx > 0) {
                    frequency = c.startTime - completed[idx - 1].startTime;
                  }
                  return (
                    <tr key={c.startTime} className="border-b border-stone-100">
                      <td className="py-2 px-2 text-stone-600">{idx + 1}</td>
                      <td className="py-2 px-2 text-stone-600">
                        {formatTimeOfDay(c.startTime)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono">
                        {formatDuration(duration)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono">
                        {frequency !== null ? formatDuration(frequency) : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">How to Use</p>
        <p className="mb-2">
          Tap the button when a contraction starts, then tap again when it ends. The
          timer tracks duration (how long each contraction lasts) and frequency (time
          from the start of one contraction to the start of the next).
        </p>
        <p className="font-semibold text-stone-700 mb-2 mt-4">When to Go to Hospital</p>
        <p>
          The <strong>5-1-1 rule</strong>: contractions 5 minutes apart, lasting 1 minute
          each, for 1 hour. Some providers use the <strong>4-1-1 rule</strong> for
          first-time mothers. Always follow your specific provider&apos;s guidance. If
          your water breaks, you have heavy bleeding, or something feels wrong, call your
          provider immediately regardless of contraction pattern.
        </p>
      </div>
    </ToolPageLayout>
  );
}
