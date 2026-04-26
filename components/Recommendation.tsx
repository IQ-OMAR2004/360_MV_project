"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

const STAGES = [
  { n: "01", label: "Design",    body: "Sized step-up TX, MV switchgear, and selected ABB ACS6080 VFD." },
  { n: "02", label: "Calculate", body: "Derived all base, starting, dip, and short-circuit quantities from nameplate." },
  { n: "03", label: "Simulate",  body: "Compared DOL / SS / VFD dynamic curves: speed, current, torque, V_gen." },
  { n: "04", label: "Compare",   body: "Scored 6 criteria; built CAPEX table with required genset upgrade included." },
  { n: "05", label: "Recommend", body: "VFD wins decisively — pays for itself in test flexibility." },
];

export function Recommendation() {
  return (
    <Section
      id="recommendation"
      variant="red"
      eyebrow="Final Recommendation"
      title={<>Step-up TX +<br />MV VFD.</>}
      subtitle="The recommended architecture turns the workshop's 400 V genset into a true MV test bay — variable speed, low harmonics, and gentle on every machine in the loop."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main verdict card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-2 bg-black/30 border-2 border-white/30 p-8 lg:p-10"
          style={{ borderRadius: "2px" }}
        >
          <div className="inline-flex items-center gap-2 bg-white text-[#EB1B26] px-4 py-2 mb-6 font-black text-xs uppercase tracking-[0.15em]">
            ✓ Selected Architecture
          </div>

          <h3 className="font-display font-black text-white leading-tight" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
            2 500 kVA Diesel Genset → 2 MVA Step-up TX (Dyn11, 6%) → MV Switchgear (12 kV, 25 kA) → ABB ACS6080 VFD → 4 kV Motor
          </h3>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { label: "Start inrush",  val: "≤ 1.10×", sub: "vs. rated" },
              { label: "Generator dip", val: "≈ 5%",    sub: "within AVR band" },
              { label: "CAPEX",         val: "≈ $608 k", sub: "all-in installed" },
            ].map(({ label, val, sub }) => (
              <div key={label} className="bg-black/25 border border-white/20 p-4" style={{ borderRadius: "1px" }}>
                <div className="text-[9px] font-black uppercase tracking-[0.15em] text-white/60">{label}</div>
                <div className="stat-number text-white mt-1" style={{ fontSize: "2rem" }}>{val}</div>
                <div className="text-[10px] text-white/50 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="text-[11px] font-black uppercase tracking-[0.15em] text-white/60 mb-3">Executive justification</div>
            <ol className="space-y-2.5 text-sm text-white/80 leading-relaxed list-decimal list-inside">
              <li><strong className="text-white font-black">Generator survives.</strong> VFD caps inrush at 1.10 × I_n → genset voltage dip stays ≈ 5%.</li>
              <li><strong className="text-white font-black">Full torque from zero speed.</strong> V/f ramp keeps magnetising current healthy throughout.</li>
              <li><strong className="text-white font-black">Doubles as test instrument.</strong> Variable-speed commissioning at no extra cost.</li>
              <li><strong className="text-white font-black">Future-proof.</strong> ABB ACS6080 handles any 0.3–2 MW MV motor in the workshop.</li>
              <li><strong className="text-white font-black">Fully compliant.</strong> IEC 60034, 60076, 62271, 61800-4, IEEE-519.</li>
            </ol>
          </div>
        </motion.div>

        {/* Project timeline — Sparkon dashed-line style */}
        <div className="bg-black/30 border border-white/20 p-6 lg:p-7" style={{ borderRadius: "2px" }}>
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60 mb-6">Project trajectory</div>
          <ol className="relative border-l-2 border-dashed border-white/30 pl-7 space-y-7">
            {STAGES.map((s) => (
              <li key={s.n} className="relative">
                <span className="absolute -left-[29px] flex w-7 h-7 items-center justify-center bg-[#EB1B26] text-white text-[10px] font-black" style={{ borderRadius: "1px" }}>
                  {s.n}
                </span>
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-white">{s.label}</div>
                <p className="text-sm text-white/65 mt-0.5 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
