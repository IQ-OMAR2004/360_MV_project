"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

const STAGES = [
  { n: "01", label: "Design", body: "Sized step-up TX, MV switchgear, and selected ABB ACS6080 VFD." },
  { n: "02", label: "Calculate", body: "Derived all base, starting, dip, and short-circuit quantities from nameplate." },
  { n: "03", label: "Simulate", body: "Compared DOL / SS / VFD dynamic curves: speed, current, torque, V_gen." },
  { n: "04", label: "Compare", body: "Scored 6 criteria; built CAPEX table including required genset upgrade." },
  { n: "05", label: "Recommend", body: "VFD wins decisively — pays for itself in test flexibility." },
];

export function Recommendation() {
  return (
    <Section
      id="recommendation"
      eyebrow="Final Recommendation"
      title={
        <>
          Step-up TX +<br />
          <span className="bg-spark-gradient bg-clip-text text-transparent">MV VFD</span>.
        </>
      }
      subtitle="The recommended architecture turns the workshop's 400 V genset into a true MV test bay — variable speed, low harmonics, and gentle on every machine in the loop."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 card p-8 lg:p-10 border-electric/40 shadow-glow-soft"
        >
          <div className="badge bg-kfupm-glow/15 text-kfupm-glow border border-kfupm-glow/40 mb-5 self-start shadow-glow-green">
            ✓ Selected Architecture
          </div>
          <h3 className="font-display text-3xl lg:text-4xl text-white leading-tight">
            2 500 kVA Diesel Genset → 2 MVA Step-up TX (Dyn11, 6%) → MV Switchgear (12 kV, 25 kA) → ABB ACS6080 VFD → 4 kV Motor
          </h3>

          <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-ink-900 border border-ink-700 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-electric">Start performance</div>
              <div className="display-number text-white text-2xl mt-2">≤ 1.10×</div>
              <div className="text-text-tertiary text-xs">Inrush vs. rated</div>
            </div>
            <div className="bg-ink-900 border border-ink-700 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-electric">Generator dip</div>
              <div className="display-number text-white text-2xl mt-2">≈ 5%</div>
              <div className="text-text-tertiary text-xs">Within AVR band</div>
            </div>
            <div className="bg-ink-900 border border-ink-700 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-electric">CAPEX</div>
              <div className="display-number text-white text-2xl mt-2">≈ $608 k</div>
              <div className="text-text-tertiary text-xs">All-in installed</div>
            </div>
          </div>

          <div className="mt-8 prose prose-invert max-w-none text-text-secondary">
            <h4 className="font-display text-white text-lg mb-2">Executive justification</h4>
            <ol className="space-y-2.5 list-decimal list-inside">
              <li>
                <strong className="text-white">Generator survives.</strong> Starting current capped at 1.10 × I_n
                drops genset terminal-voltage dip to ≈ 5% — a non-event for any modern AVR.
              </li>
              <li>
                <strong className="text-white">Full torque from zero speed.</strong> V/f ramp keeps
                magnetising current healthy throughout acceleration; load can be applied immediately.
              </li>
              <li>
                <strong className="text-white">Doubles as test instrument.</strong> Drive becomes the
                workshop's variable-frequency source — no separate test bench needed.
              </li>
              <li>
                <strong className="text-white">Future-proof.</strong> Same drive can later test other MV
                motors in the 0.3 – 2 MW range; ABB ACS6080 is field-upgradable.
              </li>
              <li>
                <strong className="text-white">Standards-compliant.</strong> All elements meet IEC 60034
                (motors), 60076 (transformers), 62271 (MV switchgear), and IEEE-519 harmonics.
              </li>
            </ol>
          </div>
        </motion.div>

        {/* Project stages */}
        <div className="card-static p-6 lg:p-7">
          <h4 className="font-display text-lg text-white mb-5">Project trajectory</h4>
          <ol className="relative border-l border-electric/30 pl-6 space-y-6">
            {STAGES.map((s) => (
              <li key={s.n} className="relative">
                <span className="absolute -left-[33px] flex w-6 h-6 items-center justify-center rounded-full bg-electric text-ink-950 text-[10px] font-black shadow-glow-electric">
                  {s.n}
                </span>
                <div className="text-xs uppercase tracking-widest text-electric">{s.label}</div>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
