"use client";

import { motion } from "framer-motion";
import { MOTOR } from "@/lib/motor";

const STATS = [
  { value: "4",    unit: "kV",   label: "Motor Voltage" },
  { value: "1551", unit: "kW",   label: "Shaft Power" },
  { value: "261",  unit: "A",    label: "Rated Current" },
  { value: "6",    unit: "×",    label: "DOL Inrush" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen pt-[70px] pb-0 overflow-hidden bg-black bg-grid"
    >
      {/* Red glow at top */}
      <div className="pointer-events-none absolute -top-60 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#EB1B26]/18 blur-[140px]" />

      {/* Grid overlay at very low opacity for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(235,27,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(235,27,38,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center min-h-[calc(100vh-70px)] py-20">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="block w-8 h-[2px] bg-[#EB1B26]" />
          <span className="text-[#EB1B26] text-xs font-black tracking-[0.2em] uppercase">
            EE360 — Term 252 · KFUPM Electrical Engineering
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="font-display font-black text-white leading-[0.92] tracking-[-0.03em]"
          style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}
        >
          From{" "}
          <span className="text-[#EB1B26]" style={{ textShadow: "0 0 40px rgba(235,27,38,0.4)" }}>
            400 V
          </span>
          <br />
          to{" "}
          <span
            className="relative"
            style={{
              WebkitTextStroke: "2px #EB1B26",
              color: "transparent",
            }}
          >
            4 kV
          </span>
          {" "}—
          <br />
          <span className="text-white">Engineered.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 text-white/70 max-w-2xl leading-[1.65]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
        >
          A complete medium-voltage test-power system for the{" "}
          <span className="text-white font-bold">{MOTOR.manufacturer} {MOTOR.model}</span>{" "}
          induction motor — bridging the workshop's 400 V diesel generator to 4 kV.
          Designed, simulated, costed, and delivered.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#challenge" className="btn-red text-sm">
            Explore the Design <span aria-hidden>→</span>
          </a>
          <a href="#recommendation" className="btn-ghost-red text-sm">
            See the Verdict
          </a>
        </motion.div>

        {/* ── Stats bar — Sparkon counter style ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.5 }}
          className="mt-20 border-t-2 border-[#EB1B26]/60 grid grid-cols-2 md:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`py-8 px-6 lg:px-10 ${i < STATS.length - 1 ? "border-r border-white/10" : ""}`}
            >
              <div className="stat-number text-white">
                {s.value}
                <span className="stat-unit">{s.unit}</span>
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/50 font-bold">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-12 flex items-center gap-3"
        >
          <span className="block w-10 h-[2px] bg-[#EB1B26]" />
          <span className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-bold">
            Where Power Meets Precision
          </span>
        </motion.div>
      </div>
    </section>
  );
}
