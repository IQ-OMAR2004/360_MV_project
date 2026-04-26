"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip,
} from "recharts";
import { Section } from "./ui/Section";

const SCORES = [
  { metric: "Tech. Feasibility", Autotransformer: 5, "Soft Starter": 6, VFD: 10 },
  { metric: "Genset Compat.",    Autotransformer: 5, "Soft Starter": 6, VFD: 10 },
  { metric: "Capital Cost",      Autotransformer: 9, "Soft Starter": 8, VFD: 5 },
  { metric: "Install Ease",      Autotransformer: 6, "Soft Starter": 8, VFD: 7 },
  { metric: "Reliability",       Autotransformer: 8, "Soft Starter": 7, VFD: 9 },
  { metric: "Test Capability",   Autotransformer: 3, "Soft Starter": 4, VFD: 10 },
];

const CAPEX = [
  { item: "Step-up TX (2 MVA, 0.4/4 kV, Dyn11)",       auto: "$48 k",  soft: "$48 k",  vfd: "$48 k"  },
  { item: "MV Switchgear (12 kV, 25 kA, 1 panel)",      auto: "$70 k",  soft: "$70 k",  vfd: "$70 k"  },
  { item: "Starter equipment",                          auto: "$180 k", soft: "$260 k", vfd: "$350 k" },
  { item: "Genset upgrade (ΔCAPEX vs. 1 MVA unit)",     auto: "$180 k", soft: "$80 k",  vfd: "$80 k"  },
  { item: "Civil + cabling + commissioning",            auto: "$60 k",  soft: "$60 k",  vfd: "$60 k"  },
  { item: "TOTAL (indicative)",                         auto: "$538 k", soft: "$518 k", vfd: "$608 k" },
];

const COLORS = { Autotransformer: "#FF6B35", "Soft Starter": "#FFB347", VFD: "#EB1B26" };

export function CapexMatrix() {
  return (
    <Section
      id="capex"
      variant="dark"
      eyebrow="Trade-off Matrix"
      title={<>Score &amp; Cost.<br /><span style={{ color: "#EB1B26" }}>The Numbers Decide.</span></>}
      subtitle="Six engineering criteria scored 0–10 (higher = better). The VFD wins on five of six and trails only on capital cost."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Radar */}
        <div className="bg-[#0D1117] border border-[#1B2026] p-6 lg:p-8" style={{ borderRadius: "2px" }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-4 h-[2px] bg-[#EB1B26]" />
            <h3 className="font-display font-black text-xl text-white">Capability Radar</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SCORES} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <PolarGrid stroke="#1B2026" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#3A4049", fontSize: 10 }} stroke="#1B2026" />
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #EB1B26", borderRadius: "0", fontSize: "11px" }} />
                <Radar name="Autotransformer" dataKey="Autotransformer" stroke={COLORS.Autotransformer} fill={COLORS.Autotransformer} fillOpacity={0.12} strokeWidth={1.5} />
                <Radar name="Soft Starter" dataKey="Soft Starter" stroke={COLORS["Soft Starter"]} fill={COLORS["Soft Starter"]} fillOpacity={0.12} strokeWidth={1.5} />
                <Radar name="VFD" dataKey="VFD" stroke={COLORS.VFD} fill={COLORS.VFD} fillOpacity={0.2} strokeWidth={2.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-5 justify-center text-xs">
            {(Object.entries(COLORS) as [keyof typeof COLORS, string][]).map(([k, c]) => (
              <span key={k} className="inline-flex items-center gap-2 text-white/60">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />{k}
              </span>
            ))}
          </div>
        </div>

        {/* CAPEX table */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="bg-[#0D1117] border border-[#1B2026] overflow-hidden"
          style={{ borderRadius: "2px" }}
        >
          <div className="px-6 py-5 border-b-2 border-[#EB1B26]/50">
            <h3 className="font-display font-black text-xl text-white">CAPEX Comparison</h3>
            <p className="text-sm text-white/50 mt-1">Indicative 2026 USD — ±15% install margin.</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1B2026] text-[9px] font-black uppercase tracking-[0.15em] text-white/35">
                <th className="text-left p-4">Item</th>
                <th className="text-right p-4">Auto-TX</th>
                <th className="text-right p-4">SS</th>
                <th className="text-right p-4 text-[#EB1B26]">VFD</th>
              </tr>
            </thead>
            <tbody>
              {CAPEX.map((row) => {
                const isTotal = row.item.startsWith("TOTAL");
                return (
                  <tr key={row.item} className={`border-b border-[#1B2026] last:border-0 ${isTotal ? "bg-[#EB1B26]/8" : ""}`}>
                    <td className={`p-4 text-sm ${isTotal ? "font-black text-white" : "text-white/60"}`}>{row.item}</td>
                    <td className={`p-4 text-right display-number ${isTotal ? "text-white/60 text-base font-black" : "text-white/50"}`}>{row.auto}</td>
                    <td className={`p-4 text-right display-number ${isTotal ? "text-white/60 text-base font-black" : "text-white/50"}`}>{row.soft}</td>
                    <td className={`p-4 text-right display-number ${isTotal ? "text-[#EB1B26] text-base font-black" : "text-[#EB1B26]/70"}`}>{row.vfd}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-6 border-t border-[#1B2026] text-sm text-white/55 leading-relaxed">
            VFD adds ~$90 k at total-system level vs. soft starter — but unlocks variable-speed testing, kinder genset interaction, and longer motor insulation life under PWM. Repaid in the first commissioning campaign.
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
