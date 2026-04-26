"use client";

import { motion } from "framer-motion";
import { MOTOR } from "@/lib/motor";

const STATS = [
  { value: "4", unit: "kV", label: "Motor Voltage" },
  { value: "1551", unit: "kW", label: "Shaft Power" },
  { value: "261", unit: "A", label: "Rated Current" },
  { value: "6×", unit: "I_n", label: "Inrush" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen pt-20 pb-12 px-6 lg:px-12 overflow-hidden bg-grid"
    >
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-electric/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-kfupm-glow/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-spark-orange/8 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto flex flex-col justify-center min-h-[calc(100vh-5rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="badge bg-ink-800 text-electric border border-electric/30 self-start"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
          EE360 — Term 252 · KFUPM Electrical Engineering
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display mt-6 text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
        >
          From <span className="text-electric glow-text">400 V</span>
          <br />
          to <span className="bg-spark-gradient bg-clip-text text-transparent">4 kV</span> —
          <br />
          <span className="text-white">Engineered.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed"
        >
          A complete medium-voltage test-power system for an{" "}
          <span className="text-white font-medium">{MOTOR.manufacturer} {MOTOR.model}</span>{" "}
          induction motor — bridging the workshop's 400 V diesel generator to the motor's
          4 kV terminals. Designed, simulated, costed, and recommended.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#challenge"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider bg-electric text-ink-950 hover:bg-electric-300 transition-all shadow-glow-electric hover:shadow-glow-soft"
          >
            Explore the Design
            <span aria-hidden>→</span>
          </a>
          <a
            href="#recommendation"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider bg-ink-800 text-white border border-ink-600 hover:border-electric/50 transition-colors"
          >
            See the Verdict
          </a>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-600 rounded-2xl overflow-hidden border border-ink-600"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink-900/80 backdrop-blur p-6 lg:p-8">
              <div className="display-number text-4xl md:text-5xl lg:text-6xl text-white">
                {s.value}
                <span className="text-electric text-2xl md:text-3xl ml-1">{s.unit}</span>
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-text-tertiary">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex items-center gap-3 text-text-tertiary text-xs uppercase tracking-widest"
        >
          <span className="block w-12 h-px bg-electric/40" />
          Where Power Meets Precision
        </motion.div>
      </div>
    </section>
  );
}
