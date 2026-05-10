import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hydration Calculator — Daily Water Intake Tool",
  description:
    "Estimate your daily water intake based on weight, activity level, and climate. Free hydration calculator for general guidance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
