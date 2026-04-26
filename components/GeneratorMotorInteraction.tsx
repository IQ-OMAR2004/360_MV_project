"use client";

import { motion } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine,
} from "recharts";
import { Section } from "./ui/Section";
import { TRANSFORMER } from "@/lib/motor";

function dipWaveform(method: "DOL" | "Soft Starter" | "VFD") {
  const params = {
    DOL: { dipMax: 0.45, tau: 1.6 },
    "Soft Starter": { dipMax: 0.18, tau: 4.0 },
    VFD: { dipMax: 0.05, tau: 8.0 },
  }[method];
  return Array.from({ length: 200 }, (_, i) => {
    const t = (i / 200) * 8;
    const v = t < 0.05 ? 1 : 1 - params.dipMax * Math.exp(-Math.max(0, t - 0.05) / params.tau);
    return { t, v };
  });
}

function inrushWaveform() {
  const tau = TRANSFORMER.inrushDecayTau;
  const peak = TRANSFORMER.inrushMultiplier;
  return Array.from({ length: 600 }, (_, i) => {
    const t = (i / 600) * 1.0;
    const env = peak * Math.exp(-t / tau);
    const v = env * (1 + Math.sin(2 * Math.PI * 60 * t - Math.PI / 2)) / 2;
    return { t: t * 1000, i: v };
  });
}

const dipData = (() => {
  const d = dipWaveform("DOL");
  const s = dipWaveform("Soft Starter");
  const v = dipWaveform("VFD");
  return d.map((row, i) => ({ t: row.t, DOL: row.v, "Soft Starter": s[i].v, VFD: v[i].v }));
})();

const inrush = inrushWaveform();

const TOOLTIP = {
  backgroundColor: "#000",
  border: "1px solid #EB1B26",
  borderRadius: "0",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "11px",
};

export function GeneratorMotorInteraction() {
  return (
    <Section
      id="interaction"
      variant="red"
      eyebrow="Generator–Motor Interaction"
      title={<>Two Machines.<br />One Bus.</>}
      subtitle="The diesel generator does not see the motor in isolation. Voltage dip, transformer inrush, and AVR ride-through together decide whether the genset survives the start."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Voltage dip chart */}
        <div className="bg-black/30 border border-white/20 p-6" style={{ borderRadius: "2px" }}>
          <h3 className="font-display font-black text-xl text-white mb-2">Generator terminal voltage dip</h3>
          <p className="text-sm text-white/75 mb-5">
            Dip ≈ Xd″ × S_start / S_gen. VFD stays inside AVR ±5% band throughout.
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dipData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 5" />
                <XAxis dataKey="t" stroke="rgba(255,255,255,0.4)" tickFormatter={(v) => `${(+v).toFixed(0)}s`} fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" domain={[0.5, 1.05]} tickFormatter={(v) => (+v).toFixed(2)} fontSize={10} width={46} />
                <ReferenceLine y={0.9} stroke="rgba(255,255,255,0.5)" strokeDasharray="4 4"
                  label={{ value: "AVR 0.9", fill: "rgba(255,255,255,0.6)", fontSize: 9, position: "right" }} />
                <ReferenceLine y={0.7} stroke="#FF8C42" strokeDasharray="4 4"
                  label={{ value: "Trip 0.7", fill: "#FF8C42", fontSize: 9, position: "right" }} />
                <Tooltip contentStyle={TOOLTIP} labelFormatter={(v) => `t = ${(+v).toFixed(2)} s`} />
                <Line type="monotone" dataKey="DOL" stroke="#EB1B26" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Soft Starter" stroke="#FF8C42" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="VFD" stroke="#FFFFFF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-5 text-xs">
            {[["DOL","#EB1B26"],["Soft Starter","#FF8C42"],["VFD","#FFFFFF"]].map(([m,c]) => (
              <span key={m} className="inline-flex items-center gap-2 text-white/70">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />{m}
              </span>
            ))}
          </div>
        </div>

        {/* Inrush chart */}
        <div className="bg-black/30 border border-white/20 p-6" style={{ borderRadius: "2px" }}>
          <h3 className="font-display font-black text-xl text-white mb-2">Transformer magnetising inrush</h3>
          <p className="text-sm text-white/75 mb-5">
            Independent of motor — peak ≈ 8 × I_rated, decays with τ ≈ 150 ms. Protection 63/87T must be stable.
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inrush} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="inrushFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EB1B26" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#EB1B26" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 5" />
                <XAxis dataKey="t" stroke="rgba(255,255,255,0.4)" tickFormatter={(v) => `${(+v).toFixed(0)}ms`} fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" domain={[0, 9]} fontSize={10} width={40} />
                <Tooltip contentStyle={TOOLTIP} labelFormatter={(v) => `t = ${(+v).toFixed(0)} ms`}
                  formatter={(v: number) => [`${v.toFixed(2)} pu`, "I_inrush"]} />
                <Area type="monotone" dataKey="i" stroke="#EB1B26" fill="url(#inrushFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AVR assessment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-2 bg-black/30 border border-white/20 p-6 lg:p-8"
          style={{ borderRadius: "2px" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-6 h-[2px] bg-white/60" />
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">AVR Ride-through Assessment</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm leading-relaxed">
            <div>
              <div className="font-display font-black text-2xl text-white mb-2">DOL — ❌</div>
              <p className="text-white/75">Terminal voltage collapses below 60% within 50 ms. AVR commands full forcing, but governor can't recover before UV trip drops the breaker. Engine may stall.</p>
            </div>
            <div>
              <div className="font-display font-black text-2xl text-white mb-2">Soft Start — ⚠️</div>
              <p className="text-white/75">Voltage stays above 80% with 50% initial tap, but the 12 s ramp forces the engine to sustain a large step load. Requires a 2.5+ MVA genset upgrade.</p>
            </div>
            <div>
              <div className="font-display font-black text-2xl text-white mb-2">VFD — ✅</div>
              <p className="text-white/75">Drive ramps current at 1.10 × I_n over 8 s. Generator sees a clean, gradual load build. Voltage stays inside ±5% — trivial for any modern AVR/governor pair.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
