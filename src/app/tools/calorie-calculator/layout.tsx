import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calorie & TDEE Calculator — Estimate Daily Energy Needs",
  description:
    "Calculate your BMR and Total Daily Energy Expenditure using the Mifflin-St Jeor equation. Free calorie calculator with weight loss and gain estimates.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
