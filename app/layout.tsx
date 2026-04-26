import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "EE360 — MV Test Power System | KFUPM",
  description:
    "Interactive engineering deliverable: a Medium-Voltage test power system for a 4 kV, 1.551 MW ABB induction motor — designed, simulated, and benchmarked.",
  keywords: [
    "EE360",
    "KFUPM",
    "MV power system",
    "induction motor",
    "ABB AMA 500",
    "VFD",
    "soft starter",
    "step-up transformer",
    "engineering project",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
