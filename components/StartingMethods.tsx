"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

interface MethodCard {
  key: string;
  title: string;
  subtitle: string;
  isRecommended: boolean;
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
    isRecommended: false,
    pros: [
      "Largest line-current reduction per torque retained (∝ α²)",
      "Mature, robust, no power electronics",
      "Bypass contactor at full speed — no run losses",
    ],
    cons: [
      "Bulky 3-position MV switching arrangement",
      "Open transition causes re-acceleration spike",
      "Step start, not smooth — mechanical stress",
      "Cannot do variable-speed no-load testing",
    ],
    start_current: "≈ 661 A line @ 65% tap",
    torque:        "≈ 42% of locked-rotor",
    voltage_dip:   "≈ 14% at MV bus",
    capex:         "≈ $180 k",
    verdict: "Old-school. Works for starting — inflexible for testing.",
  },
  {
    key: "soft",
    title: "MV Soft Starter",
    subtitle: "Back-to-back thyristors, voltage ramp",
    isRecommended: false,
    pros: [
      "Smooth voltage ramp 30 → 100% — no torque steps",
      "Compact, indoor-rated cabinet",
      "Built-in motor protection (49, 50/51)",
      "Lower CAPEX than VFD",
    ],
    cons: [
      "Line current = motor current (no transformer isolation)",
      "Reduced torque: T ∝ V² — may stall heavy loads",
      "Harmonic injection during ramp phase",
      "No variable-speed test capability",
    ],
    start_current: "≈ 783 A line @ 50% V",
    torque:        "≈ 25% of locked-rotor",
    voltage_dip:   "≈ 17% at MV bus",
    capex:         "≈ $260 k",
    verdict: "Cheap and smooth — but a one-trick pony.",
  },
  {
    key: "vfd",
    title: "MV VFD",
    subtitle: "Variable frequency, V/f ramp",
    isRecommended: true,
    pros: [
      "Full torque from zero speed (V/f constant)",
      "Current capped at ~1.10 × rated → tiny generator dip",
      "Variable-speed no-load test inherently supported",
      "Active front end → near-unity PF, low THD",
      "Soft stop, ride-through, regen capability",
    ],
    cons: [
      "Highest CAPEX (~$350 k for the drive alone)",
      "Larger cabinet footprint vs. soft starter",
    ],
    start_current: "≈ 287 A line (1.10 × I_n)",
    torque:        "100% available from zero",
    voltage_dip:   "≈ 5% at MV bus",
    capex:         "≈ $350 k",
    verdict: "The right answer. Doubles as the commissioning instrument.",
  },
];

export function StartingMethods() {
  return (
    <Section
      id="methods"
      variant="dark"
      eyebrow="Starting Method Comparison"
      title={<>Three Roads.<br /><span style={{ color: "#EB1B26" }}>One Verdict.</span></>}
      subtitle="Pros, cons, key numbers, and a one-line verdict for each candidate. DOL is excluded — generator collapse precludes it on a workshop genset."
    >
      <div className="grid md:grid-cols-3 gap-5">
        {METHODS.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className={`flex flex-col border ${m.isRecommended ? "border-[#EB1B26]" : "border-[#1B2026]"} bg-[#0D1117]`}
            style={{
              borderRadius: "2px",
              boxShadow: m.isRecommended ? "0 0 40px rgba(235,27,38,0.25)" : undefined,
            }}
          >
            {m.isRecommended && (
              <div className="bg-[#EB1B26] px-5 py-2.5 flex items-center gap-2">
                <span className="text-white font-black text-xs uppercase tracking-[0.15em]">✓ Recommended</span>
              </div>
            )}
            {!m.isRecommended && (
              <div className="bg-[#1B2026] px-5 py-2.5">
                <span className="text-white/40 font-black text-xs uppercase tracking-[0.15em]">Candidate</span>
              </div>
            )}

            <div className="p-6 lg:p-7 flex flex-col flex-1">
              <h3 className="font-display font-black text-2xl text-white">{m.title}</h3>
              <p className="text-sm text-white/50 mt-1">{m.subtitle}</p>

              {/* Key metrics */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  { label: "Line current", val: m.start_current },
                  { label: "Start torque",  val: m.torque },
                  { label: "MV dip",        val: m.voltage_dip },
                  { label: "CAPEX",         val: m.capex },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-black border border-[#1B2026] p-3" style={{ borderRadius: "1px" }}>
                    <div className="text-[9px] font-black uppercase tracking-[0.12em] text-white/35">{label}</div>
                    <div className="display-number text-[#EB1B26] text-sm mt-1 leading-tight">{val}</div>
                  </div>
                ))}
              </div>

              {/* Pros */}
              <div className="mt-6">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#4BA181] mb-2">Pros</div>
                <ul className="space-y-1.5">
                  {m.pros.map((p) => (
                    <li key={p} className="text-sm text-white/65 flex gap-2">
                      <span className="text-[#4BA181] mt-0.5 flex-shrink-0">+</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mt-4">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#EB1B26] mb-2">Cons</div>
                <ul className="space-y-1.5">
                  {m.cons.map((c) => (
                    <li key={c} className="text-sm text-white/65 flex gap-2">
                      <span className="text-[#EB1B26] mt-0.5 flex-shrink-0">−</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verdict */}
              <div className="mt-auto pt-6 border-t border-[#1B2026]">
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/35 mb-1">Verdict</div>
                <p className="text-white font-black text-sm">{m.verdict}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
