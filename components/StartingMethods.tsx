"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

interface MethodCard {
  key: string;
  title: string;
  subtitle: string;
  badge: { label: string; tone: "ok" | "warn" | "bad" };
  pros: string[];
  cons: string[];
  start_current: string;
  torque: string;
  voltage_dip: string;
  capex: string;
  verdict: string;
}

const METHODS: MethodCard[] = [
  {
    key: "auto",
    title: "Autotransformer",
    subtitle: "Tap-switched start (Korndörfer)",
    badge: { label: "Heavy & Mechanical", tone: "warn" },
    pros: [
      "Largest line-current reduction per torque retained (∝ α²)",
      "Mature, robust, no power electronics",
      "Bypass contactor at full speed → no losses in run",
    ],
    cons: [
      "Bulky 3-position MV switching gear",
      "Open transition causes re-acceleration current spike",
      "Step start, not smooth",
      "Cannot do variable-speed no-load testing",
    ],
    start_current: "≈ 661 A line @ 65% tap",
    torque: "≈ 42% of locked-rotor",
    voltage_dip: "≈ 14% at MV bus",
    capex: "≈ $180 k installed",
    verdict: "Old-school. Works but inflexible.",
  },
  {
    key: "soft",
    title: "MV Soft Starter",
    subtitle: "Back-to-back thyristors, voltage ramp",
    badge: { label: "Smooth Start Only", tone: "warn" },
    pros: [
      "Smooth voltage ramp 30 → 100% — no torque steps",
      "Compact, indoor-rated",
      "Built-in motor protection (49, 50/51)",
      "Low CAPEX vs. VFD",
    ],
    cons: [
      "Line current = motor current (no isolation transformer benefit)",
      "Reduced torque: T ∝ V² → may stall heavy loads",
      "Harmonic injection during ramp",
      "No variable-speed test capability",
    ],
    start_current: "≈ 783 A line @ 50% V",
    torque: "≈ 25% of locked-rotor",
    voltage_dip: "≈ 17% at MV bus",
    capex: "≈ $260 k installed",
    verdict: "Cheap & smooth — but a one-trick pony.",
  },
  {
    key: "vfd",
    title: "MV VFD",
    subtitle: "Variable frequency, V/f ramp",
    badge: { label: "Recommended", tone: "ok" },
    pros: [
      "Full torque from zero speed (V/f constant)",
      "Current capped at ~110% rated → tiny generator dip",
      "Variable-speed no-load test inherently supported",
      "Active front end → near-unity input PF, low THD",
      "Soft stop, ride-through, regen capability",
    ],
    cons: [
      "Highest CAPEX (~$350 k)",
      "Footprint of MV cabinet",
      "Requires output filter on long cable runs",
    ],
    start_current: "≈ 287 A line (1.10 × I_n)",
    torque: "100% available from zero",
    voltage_dip: "≈ 5% at MV bus",
    capex: "≈ $350 k installed",
    verdict: "The right answer. Doubles as the test instrument.",
  },
];

const TONE_CLASS: Record<MethodCard["badge"]["tone"], string> = {
  ok: "bg-kfupm-green/15 text-kfupm-glow border-kfupm-glow/40 shadow-glow-green",
  warn: "bg-spark-amber/15 text-spark-amber border-spark-amber/40",
  bad: "bg-spark-orange/15 text-spark-orange border-spark-orange/40 shadow-glow-amber",
};

export function StartingMethods() {
  return (
    <Section
      id="methods"
      eyebrow="Starting Method Comparison"
      title={
        <>
          Three Roads.<br />
          <span className="text-electric glow-text">One Verdict.</span>
        </>
      }
      subtitle="Pros, cons, key numbers, and a one-line verdict for each candidate. Direct online start is excluded — generator collapse precludes it on a workshop genset."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {METHODS.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`card p-6 lg:p-8 flex flex-col ${m.key === "vfd" ? "border-kfupm-glow/40 shadow-glow-green" : ""}`}
          >
            <div className={`badge border ${TONE_CLASS[m.badge.tone]} self-start mb-4`}>
              {m.badge.label}
            </div>
            <h3 className="font-display text-2xl text-white">{m.title}</h3>
            <p className="text-sm text-text-secondary mt-1">{m.subtitle}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-ink-900 border border-ink-700 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-widest text-text-tertiary">Line current</div>
                <div className="display-number text-electric text-base mt-1">{m.start_current}</div>
              </div>
              <div className="bg-ink-900 border border-ink-700 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-widest text-text-tertiary">Start torque</div>
                <div className="display-number text-electric text-base mt-1">{m.torque}</div>
              </div>
              <div className="bg-ink-900 border border-ink-700 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-widest text-text-tertiary">MV dip</div>
                <div className="display-number text-electric text-base mt-1">{m.voltage_dip}</div>
              </div>
              <div className="bg-ink-900 border border-ink-700 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-widest text-text-tertiary">CAPEX</div>
                <div className="display-number text-electric text-base mt-1">{m.capex}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-kfupm-glow mb-2">Pros</div>
                <ul className="space-y-1.5">
                  {m.pros.map((p) => (
                    <li key={p} className="text-sm text-text-secondary flex gap-2">
                      <span className="text-kfupm-glow mt-0.5">+</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-spark-orange mb-2">Cons</div>
                <ul className="space-y-1.5">
                  {m.cons.map((c) => (
                    <li key={c} className="text-sm text-text-secondary flex gap-2">
                      <span className="text-spark-orange mt-0.5">−</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-ink-700 text-sm">
              <span className="text-[10px] uppercase tracking-widest text-text-tertiary block mb-1">
                Verdict
              </span>
              <p className="text-white font-medium">{m.verdict}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
