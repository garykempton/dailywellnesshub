"use client";

import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools";

const tool = getToolBySlug("blood-pressure-checker")!;

interface BPCategory {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  barColor: string;
}

function classifyBP(
  systolic: number,
  diastolic: number
): BPCategory & { urgent: boolean } {
  if (systolic > 180 || diastolic > 120) {
    return {
      label: "Hypertensive Crisis",
      color: "text-red-900",
      bgColor: "bg-red-100",
      borderColor: "border-red-400",
      textColor: "text-red-900",
      barColor: "bg-red-800",
      urgent: true,
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      label: "High Blood Pressure Stage 2",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      barColor: "bg-red-500",
      urgent: false,
    };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return {
      label: "High Blood Pressure Stage 1",
      color: "text-orange-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-800",
      barColor: "bg-orange-500",
      urgent: false,
    };
  }
  if (systolic >= 120 && diastolic < 80) {
    return {
      label: "Elevated",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      barColor: "bg-amber-500",
      urgent: false,
    };
  }
  return {
    label: "Normal",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    barColor: "bg-green-500",
    urgent: false,
  };
}

function getRecommendations(label: string): string[] {
  switch (label) {
    case "Normal":
      return [
        "Maintain a healthy diet rich in fruits, vegetables, and whole grains.",
        "Stay physically active with at least 150 minutes of moderate exercise per week.",
        "Continue monitoring your blood pressure annually.",
        "Keep a healthy weight and limit sodium intake.",
      ];
    case "Elevated":
      return [
        "Reduce sodium intake to less than 1,500 mg per day.",
        "Increase physical activity to at least 150 minutes of moderate exercise per week.",
        "Maintain a healthy weight or lose weight if overweight.",
        "Limit alcohol consumption and avoid tobacco products.",
        "Monitor your blood pressure regularly and consult your doctor if it rises further.",
      ];
    case "High Blood Pressure Stage 1":
      return [
        "Schedule an appointment with your healthcare provider.",
        "Follow the DASH diet (Dietary Approaches to Stop Hypertension).",
        "Reduce sodium to less than 1,500 mg per day.",
        "Exercise regularly, at least 30 minutes most days of the week.",
        "Manage stress through relaxation techniques, meditation, or deep breathing.",
        "Your doctor may consider medication depending on your cardiovascular risk.",
      ];
    case "High Blood Pressure Stage 2":
      return [
        "See your healthcare provider promptly for evaluation and treatment.",
        "You will likely need blood pressure medication in addition to lifestyle changes.",
        "Follow a low-sodium, heart-healthy diet (DASH diet recommended).",
        "Limit alcohol, quit smoking, and manage stress.",
        "Monitor your blood pressure at home and keep a log for your doctor.",
        "Take all prescribed medications as directed.",
      ];
    case "Hypertensive Crisis":
      return [
        "Seek immediate medical attention. Call your doctor or go to the emergency room.",
        "Do not wait to see if your pressure comes down on its own.",
        "If you experience symptoms like chest pain, shortness of breath, vision changes, or severe headache, call emergency services immediately.",
        "Do not take extra doses of medication without medical guidance.",
      ];
    default:
      return [];
  }
}

function getDoctorGuidance(label: string): string {
  switch (label) {
    case "Normal":
      return "Routine check-ups with blood pressure screening at least once a year are recommended. See your doctor sooner if you notice any changes or develop risk factors such as weight gain, increased stress, or a family history of hypertension.";
    case "Elevated":
      return "Discuss lifestyle changes with your doctor at your next visit. If elevated readings persist over several weeks, your healthcare provider may want to monitor you more closely or order additional tests.";
    case "High Blood Pressure Stage 1":
      return "Make an appointment with your healthcare provider within the next few weeks. If you also have risk factors like diabetes, kidney disease, or a history of heart disease, treatment may be more urgent.";
    case "High Blood Pressure Stage 2":
      return "Contact your healthcare provider as soon as possible for evaluation. Stage 2 hypertension significantly increases your risk for heart attack, stroke, and kidney damage and usually requires medication.";
    case "Hypertensive Crisis":
      return "This is a medical emergency. If your reading is above 180/120 mmHg, wait 5 minutes and test again. If it remains this high, seek emergency medical care immediately, especially if you have symptoms like chest pain, shortness of breath, numbness, or vision problems.";
    default:
      return "";
  }
}

interface Results {
  systolic: number;
  diastolic: number;
  category: BPCategory & { urgent: boolean };
  recommendations: string[];
  doctorGuidance: string;
}

export default function BloodPressureCheckerPage() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  function check() {
    const sys = Number(systolic);
    const dia = Number(diastolic);
    if (!sys || !dia || sys < 70 || sys > 250 || dia < 40 || dia > 150) return;

    const category = classifyBP(sys, dia);
    const recommendations = getRecommendations(category.label);
    const doctorGuidance = getDoctorGuidance(category.label);

    setResults({ systolic: sys, diastolic: dia, category, recommendations, doctorGuidance });
  }

  // Calculate gauge position (0-100%)
  function getGaugePosition(systolic: number): number {
    // Map systolic 70-200+ to 0-100%
    const min = 70;
    const max = 200;
    return Math.min(100, Math.max(0, ((systolic - min) / (max - min)) * 100));
  }

  const ahaCategories = [
    { label: "Normal", systolic: "Less than 120", diastolic: "Less than 80", operator: "AND", color: "bg-green-100 text-green-800" },
    { label: "Elevated", systolic: "120 - 129", diastolic: "Less than 80", operator: "AND", color: "bg-amber-100 text-amber-800" },
    { label: "High BP Stage 1", systolic: "130 - 139", diastolic: "80 - 89", operator: "OR", color: "bg-orange-100 text-orange-800" },
    { label: "High BP Stage 2", systolic: "140 or higher", diastolic: "90 or higher", operator: "OR", color: "bg-red-100 text-red-800" },
    { label: "Hypertensive Crisis", systolic: "Higher than 180", diastolic: "Higher than 120", operator: "AND/OR", color: "bg-red-200 text-red-900" },
  ];

  return (
    <ToolPageLayout tool={tool}>
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Systolic (top number)
            </label>
            <input
              type="number"
              min="70"
              max="250"
              placeholder="e.g. 120"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">mmHg (70&ndash;250)</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Diastolic (bottom number)
            </label>
            <input
              type="number"
              min="40"
              max="150"
              placeholder="e.g. 80"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-stone-400 mt-1">mmHg (40&ndash;150)</p>
          </div>
        </div>

        <button
          onClick={check}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Check Blood Pressure
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {/* Category result */}
          <div
            className={`${results.category.bgColor} border ${results.category.borderColor} rounded-xl p-5 text-center`}
          >
            {results.category.urgent && (
              <p className="text-sm font-bold text-red-900 mb-2 uppercase tracking-wide">
                Seek immediate medical attention
              </p>
            )}
            <p className={`text-sm font-medium mb-1 ${results.category.color}`}>
              Your Blood Pressure
            </p>
            <p className={`text-3xl font-bold ${results.category.textColor}`}>
              {results.systolic}/{results.diastolic}{" "}
              <span className="text-lg font-normal">mmHg</span>
            </p>
            <p className={`text-xl font-semibold mt-2 ${results.category.color}`}>
              {results.category.label}
            </p>
          </div>

          {/* Visual gauge */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Where your reading falls
            </p>
            <div className="relative h-8 rounded-full overflow-hidden flex">
              <div className="bg-green-400 h-full" style={{ width: "38%" }} />
              <div className="bg-amber-400 h-full" style={{ width: "8%" }} />
              <div className="bg-orange-400 h-full" style={{ width: "8%" }} />
              <div className="bg-red-400 h-full" style={{ width: "31%" }} />
              <div className="bg-red-700 h-full" style={{ width: "15%" }} />
            </div>
            {/* Marker */}
            <div className="relative h-6">
              <div
                className="absolute -top-1 transform -translate-x-1/2"
                style={{ left: `${getGaugePosition(results.systolic)}%` }}
              >
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-stone-800" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-stone-400">
              <span>Normal</span>
              <span>Elevated</span>
              <span>Stage 1</span>
              <span>Stage 2</span>
              <span>Crisis</span>
            </div>
          </div>

          {/* What the numbers mean */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Understanding your numbers
            </p>
            <div className="space-y-3 text-sm text-stone-600">
              <div className="flex gap-3">
                <span className="font-semibold text-stone-700 shrink-0 w-20">
                  Systolic
                </span>
                <p>
                  The top number ({results.systolic} mmHg) measures the pressure
                  in your arteries when your heart beats and pumps blood. It is
                  generally considered the more important number for assessing
                  cardiovascular risk.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-stone-700 shrink-0 w-20">
                  Diastolic
                </span>
                <p>
                  The bottom number ({results.diastolic} mmHg) measures the
                  pressure in your arteries between heartbeats, when your heart
                  is resting and refilling with blood.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <p className="text-sm font-medium text-stone-700 mb-3">
              Lifestyle Recommendations
            </p>
            <ul className="space-y-2">
              {results.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-600">
                  <span className="text-stone-400 shrink-0">&#8226;</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* When to see a doctor */}
          <div
            className={`${
              results.category.urgent
                ? "bg-red-50 border-red-300"
                : "bg-blue-50 border-blue-200"
            } border rounded-xl p-5`}
          >
            <p
              className={`text-sm font-medium mb-2 ${
                results.category.urgent ? "text-red-800" : "text-blue-800"
              }`}
            >
              When to See a Doctor
            </p>
            <p
              className={`text-sm ${
                results.category.urgent ? "text-red-700" : "text-blue-700"
              }`}
            >
              {results.doctorGuidance}
            </p>
          </div>
        </div>
      )}

      {/* AHA Reference Table */}
      <div className="mt-6 bg-white border border-stone-200 rounded-xl p-5">
        <p className="text-sm font-medium text-stone-700 mb-3">
          AHA Blood Pressure Categories
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-stone-500">
                <th className="pb-2 pr-3 font-medium">Category</th>
                <th className="pb-2 pr-3 font-medium">Systolic (mmHg)</th>
                <th className="pb-2 pr-3 font-medium" />
                <th className="pb-2 font-medium">Diastolic (mmHg)</th>
              </tr>
            </thead>
            <tbody>
              {ahaCategories.map((cat, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="py-2 pr-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cat.color}`}
                    >
                      {cat.label}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-stone-700">{cat.systolic}</td>
                  <td className="py-2 pr-3 text-stone-400 text-xs">
                    {cat.operator}
                  </td>
                  <td className="py-2 text-stone-700">{cat.diastolic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-stone-400 mt-3">
          Source: American Heart Association (AHA) guidelines. When systolic and
          diastolic fall into different categories, the higher category applies.
        </p>
      </div>

      <div className="mt-8 bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm text-stone-500">
        <p className="font-semibold text-stone-700 mb-2">
          How blood pressure classification works
        </p>
        <p className="mb-2">
          Blood pressure is measured in millimeters of mercury (mmHg) and is
          recorded as two numbers: systolic (the pressure when your heart beats)
          over diastolic (the pressure when your heart rests between beats).
        </p>
        <p className="mb-2">
          The American Heart Association defines five blood pressure categories.
          A reading is classified based on whichever number (systolic or
          diastolic) places it in the higher category. For example, a reading of
          135/75 is classified as Stage 1 hypertension because the systolic value
          falls in that range, even though the diastolic is normal.
        </p>
        <p>
          A single high reading does not necessarily mean you have high blood
          pressure. Blood pressure fluctuates throughout the day and can be
          affected by stress, caffeine, physical activity, and other factors.
          Your doctor will typically take multiple readings over time before
          making a diagnosis.
        </p>
      </div>

      {/* Health disclaimer */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">Medical Disclaimer</p>
        <p>
          This tool is for informational purposes only and does not constitute
          medical advice. Blood pressure should be measured using a validated
          device with proper technique. Always consult a qualified healthcare
          professional for diagnosis and treatment of blood pressure conditions.
        </p>
      </div>
    </ToolPageLayout>
  );
}
