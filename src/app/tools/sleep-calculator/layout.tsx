import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sleep Calculator — Find Your Ideal Bedtime & Wake Time",
  description:
    "Calculate optimal bedtimes and wake-up times based on 90-minute sleep cycles. Wake between cycles to feel more rested.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
