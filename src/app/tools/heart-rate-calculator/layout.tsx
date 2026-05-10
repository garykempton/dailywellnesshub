import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heart Rate Zones Calculator — Training Zone Tool",
  description:
    "Calculate your target heart rate training zones using the Karvonen method or simple percentage. Free tool for cardio workout planning.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
