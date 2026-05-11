"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("vo2-max-calculator")!;

type TestMethod = "cooper" | "rockport";
type Sex = "male" | "female";
type DistUnit = "metres" | "miles";
type WeightUnit = "kg" | "lbs";

interface ClassEntry {
  label: string;
  color: string;
  bg: string;
}

const AGE_RANGES = ["20-29", "30-39", "40-49", "50-59", "60+"] as const;

// Thresholds: [superior_min, excellent_min, good_min, fair_min]
const MALE_THRESHOLDS: Record<string, number[]> = {
  "20-29": [51.4, 46.8, 42.5, 36.5],
  "30-39": [48.2, 44.0, 39.2, 35.5],
  "40-49": [45.0, 41.8, 36.7, 33.0],
  "50-59": [43.4, 39.2, 34.2, 30.2],
  "60+": [41.2, 36.4, 31.2, 26.1],
};

const FEMALE_THRESHOLDS: Record<string, number[]> = {
  "20-29": [49.0, 43.9, 39.0, 33.1],
  "30-39": [45.3, 40.9, 36.0, 31.6],
  "40-49": [42.4, 36.9, 33.0, 29.0],
  "50-59": [39.2, 33.8, 30.0, 25.1],
  "60+": [35.2, 31.0, 27.5, 23.7],
};

function getAgeRange(age: number): string {
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  return "60+";
}

function classify(vo2: number, sex: Sex, age: number): ClassEntry {
  const range = getAgeRange(age);
  const thresholds =
    sex === "male" ? MALE_THRESHOLDS[range] : FEMALE_THRESHOLDS[range];

  if (vo2 >= thresholds[0])
    return {
      label: "Superior",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
    };
  if (vo2 >= thresholds[1])
    return {
      label: "Excellent",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
    };
  if (vo2 >= thresholds[2])
    return {
      label: "Good",
      color: "text-green-700",
      bg: "bg-green-50 border-green-200",
    };
  if (vo2 >= thresholds[3])
    return {
      label: "Fair",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    };
  return {
    label: "Poor",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  };
}

interface VO2Result {
  vo2: number;
  classification: ClassEntry;
  method: TestMethod;
}

export default function VO2MaxCalculatorPage() {
  const [method, setMethod] = useState<TestMethod>("cooper");

  // Cooper inputs
  const [cooperDist, setCooperDist] = useState("");
  const [cooperDistUnit, setCooperDistUnit] = useState<DistUnit>("metres");

  // Rockport inputs
  const [rpWeight, setRpWeight] = useState("");
  const [rpWeightUnit, setRpWeightUnit] = useState<WeightUnit>("kg");
  const [rpAge, setRpAge] = useState("");
  const [rpSex, setRpSex] = useState<Sex>("male");
  const [rpTimeStr, setRpTimeStr] = useState("");
  const [rpHR, setRpHR] = useState("");

  // Shared for classification when using Cooper
  const [cooperAge, setCooperAge] = useState("");
  const [cooperSex, setCooperSex] = useState<Sex>("male");

  const [result, setResult] = useState<VO2Result | null>(null);

  function calculate() {
    if (method === "cooper") {
      const dist = parseFloat(cooperDist);
      if (!dist || dist <= 0) return;
      const distMetres =
        cooperDistUnit === "miles" ? dist * 1609.34 : dist;
      const vo2 = (distMetres - 504.9) / 44.73;
      const age = parseInt(cooperAge) || 30;
      const sex = cooperSex;
      setResult({
        vo2: Math.round(vo2 * 10) / 10,
        classification: classify(vo2, sex, age),
        method: "cooper",
      });
    } else {
      const weight = parseFloat(rpWeight);
      const age = parseInt(rpAge);
      const hr = parseInt(rpHR);
      if (!weight || !age || !hr) return;

      const weightKg =
        rpWeightUnit === "lbs" ? weight * 0.453592 : weight;

      // Parse MM:SS time
      const parts = rpTimeStr.split(":").map((p) => parseFloat(p));
      let timeMinutes: number;
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        timeMinutes = parts[0] + parts[1] / 60;
      } else if (parts.length === 1 && !isNaN(parts[0])) {
        timeMinutes = parts[0];
      } else {
        return;
      }
      if (timeMinutes <= 0) return;

      const sexFactor = rpSex === "male" ? 1 : 0;
      const vo2 =
        132.853 -
        0.1692 * weightKg -
        0.3877 * age +
        6.315 * sexFactor -
        3.2649 * timeMinutes -
        0.1565 * hr;

      setResult({
        vo2: Math.round(vo2 * 10) / 10,
        classification: classify(vo2, rpSex, age),
        method: "rockport",
      });
    }
  }

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        {/* Method Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Test Method</label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "cooper", label: "Cooper 12-Min Run" },
                { key: "rockport", label: "Rockport 1-Mile Walk" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setMethod(key);
                  setResult(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  method === key
                    ? "bg-primary text-white border-primary"
                    : "border-stone-300 hover:border-stone-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {method === "cooper" ? (
          <>
            {/* Cooper: Distance */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Distance covered in 12 minutes
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={cooperDist}
                  onChange={(e) => setCooperDist(e.target.value)}
                  placeholder={cooperDistUnit === "metres" ? "2400" : "1.5"}
                  className="flex-1 border border-stone-300 rounded-lg px-3 py-2"
                />
                <div className="flex gap-1">
                  {(["metres", "miles"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setCooperDistUnit(u)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                        cooperDistUnit === u
                          ? "bg-primary text-white border-primary"
                          : "border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cooper: Age & Sex for classification */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={cooperAge}
                  onChange={(e) => setCooperAge(e.target.value)}
                  placeholder="30"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Sex</label>
                <div className="flex gap-1">
                  {(["male", "female"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setCooperSex(s)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                        cooperSex === s
                          ? "bg-primary text-white border-primary"
                          : "border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {s === "male" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Rockport inputs */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Weight ({rpWeightUnit})
                </label>
                <input
                  type="number"
                  value={rpWeight}
                  onChange={(e) => setRpWeight(e.target.value)}
                  placeholder={rpWeightUnit === "kg" ? "70" : "154"}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex-none">
                <label className="block text-sm font-medium mb-1">&nbsp;</label>
                <div className="flex gap-1">
                  {(["kg", "lbs"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setRpWeightUnit(u)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                        rpWeightUnit === u
                          ? "bg-primary text-white border-primary"
                          : "border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={rpAge}
                  onChange={(e) => setRpAge(e.target.value)}
                  placeholder="30"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Sex</label>
                <div className="flex gap-1">
                  {(["male", "female"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setRpSex(s)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                        rpSex === s
                          ? "bg-primary text-white border-primary"
                          : "border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {s === "male" ? "Male" : "Female"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Time to walk 1 mile (MM:SS)
              </label>
              <input
                type="text"
                value={rpTimeStr}
                onChange={(e) => setRpTimeStr(e.target.value)}
                placeholder="15:30"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Heart rate at finish (bpm)
              </label>
              <input
                type="number"
                value={rpHR}
                onChange={(e) => setRpHR(e.target.value)}
                placeholder="140"
                className="w-full border border-stone-300 rounded-lg px-3 py-2"
              />
            </div>
          </>
        )}

        <button
          onClick={calculate}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Calculate VO2 Max
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* VO2 Max Value */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 text-center">
            <p className="text-sm text-stone-500 mb-1">
              Estimated VO2 Max
            </p>
            <p className="text-5xl font-bold">{result.vo2}</p>
            <p className="text-sm text-stone-400 mt-1">ml/kg/min</p>
          </div>

          {/* Classification */}
          <div
            className={`border rounded-xl p-5 text-center ${result.classification.bg}`}
          >
            <p className="text-sm text-stone-500 mb-1">Fitness Classification</p>
            <p className={`text-3xl font-bold ${result.classification.color}`}>
              {result.classification.label}
            </p>
            <p className="text-sm text-stone-500 mt-2">
              Based on age and sex norms
            </p>
          </div>

          {/* Classification Table */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 overflow-x-auto">
            <h3 className="text-sm font-medium text-stone-700 mb-3">
              VO2 Max Classification Table (
              {(method === "cooper" ? cooperSex : rpSex) === "male"
                ? "Men"
                : "Women"}
              )
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-2 pr-3 text-stone-500 font-medium">
                    Age
                  </th>
                  <th className="py-2 px-2 text-emerald-600 font-medium">
                    Superior
                  </th>
                  <th className="py-2 px-2 text-blue-600 font-medium">
                    Excellent
                  </th>
                  <th className="py-2 px-2 text-green-600 font-medium">Good</th>
                  <th className="py-2 px-2 text-amber-600 font-medium">Fair</th>
                  <th className="py-2 px-2 text-red-600 font-medium">Poor</th>
                </tr>
              </thead>
              <tbody>
                {AGE_RANGES.map((range) => {
                  const sex =
                    method === "cooper" ? cooperSex : rpSex;
                  const t =
                    sex === "male"
                      ? MALE_THRESHOLDS[range]
                      : FEMALE_THRESHOLDS[range];
                  return (
                    <tr key={range} className="border-b border-stone-100">
                      <td className="py-2 pr-3 font-medium text-stone-600">
                        {range}
                      </td>
                      <td className="py-2 px-2 text-center text-emerald-700">
                        &gt;{t[0]}
                      </td>
                      <td className="py-2 px-2 text-center text-blue-700">
                        {t[1]}-{t[0]}
                      </td>
                      <td className="py-2 px-2 text-center text-green-700">
                        {t[2]}-{(t[1] - 0.1).toFixed(1)}
                      </td>
                      <td className="py-2 px-2 text-center text-amber-700">
                        {t[3]}-{(t[2] - 0.1).toFixed(1)}
                      </td>
                      <td className="py-2 px-2 text-center text-red-700">
                        &lt;{t[3]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-stone-400 mt-2">
              Values in ml/kg/min. Based on normative data from the American
              College of Sports Medicine.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">About These Tests</p>
        <p className="mb-2">
          <strong>Cooper 12-Minute Run:</strong> Run as far as possible in 12
          minutes on a flat surface. Best performed on a track. Warm up for 5-10
          minutes before the test.
        </p>
        <p>
          <strong>Rockport 1-Mile Walk:</strong> Walk 1 mile as fast as you can
          (no running). Record your time and immediately measure your heart rate.
          This test is ideal for people who cannot run or are new to fitness
          testing.
        </p>
      </div>
    </ToolPageLayout>
  );
}
