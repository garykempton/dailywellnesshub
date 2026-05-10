import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator — Free Body Mass Index Tool",
  description:
    "Calculate your BMI instantly with our free Body Mass Index calculator. Supports metric and imperial units. For educational purposes only.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
