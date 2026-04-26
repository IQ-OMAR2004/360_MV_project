"use client";

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Section } from "./ui/Section";

interface ScoreRow {
  metric: string;
  Autotransformer: number;
  "Soft Starter": number;
  VFD: number;
}

const SCORES: ScoreRow[] = [
  { metric: "Tech. Feasibility", Autotransformer: 5, "Soft Starter": 6, VFD: 10 },
  { metric: "Genset Compatibility", Autotransformer: 5, "Soft Starter": 6, VFD: 10 },
  { metric: "Capital Cost", Autotransformer: 9, "Soft Starter": 8, VFD: 5 },
  { metric: "Install Complexity", Autotransformer: 6, "Soft Starter": 8, VFD: 7 },
  { metric: "Reliability", Autotransformer: 8, "Soft Starter": 7, VFD: 9 },
  { metric: "Test Capability", Autotransformer: 3, "Soft Starter": 4, VFD: 10 },
];

interface CapexRow {
  item: string;
  auto: string;
  soft: string;
  vfd: string;
}

const CAPEX: CapexRow[] = [
  { item: "Step-up Transformer (2 MVA, 0.4/4 kV, Dyn11)", auto: "$48 k", soft: "$48 k", vfd: "$48 k" },
  { item: "MV Switchgear (12 kV, 25 kA, 1 panel)", auto: "$70 k", soft: "$70 k", vfd: "$70 k" },
  { item: "Starter equipment", auto: "$180 k", soft: "$260 k", vfd: "$350 k" },
  { item: "Genset upgrade (1 → 2.5 MVA, ΔCAPEX)", auto: "$180 k", soft: "$80 k", vfd: "$80 k" },
  { item: "Civil + cabling + commissioning", auto: "$60 k", soft: "$60 k", vfd: "$60 k" },
  { item: "TOTAL (indicative)", auto: "$538 k", soft: "$518 k", vfd: "$608 k" },
];

const COLORS = {
  Autotransformer: "#FFB347",
  "Soft Starter": "#FF7A00",
  VFD: "#00E0FF",
};

export function CapexMatrix() {
  return (
    <Section
      id="capex"
      eyebrow="Trade-off Matrix"
      title={
        <>
          The Numbers Decide.<br />
          <span className="text-electric glow-text">Score & Cost.</span>
        </>
      }
      subtitle="Six engineering criteria, scored 0–10 (higher is better). The VFD wins on five of six and ties or trails only on capital cost."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* RADAR */}
        <div className="card-static p-6 lg:p-8">
          <h3 className="font-display text-xl text-white mb-4">Capability radar</h3>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SCORES} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <PolarGrid stroke="#262A30" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#B8BFC7", fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#7A828D", fontSize: 10 }} stroke="#3A4049" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #262A30",
                    borderRadius: 8,
                  }}
                />
                <Radar
                  name="Autotransformer"
                  dataKey="Autotransformer"
                  stroke={COLORS.Autotransformer}
                  fill={COLORS.Autotransformer}
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Radar
                  name="Soft Starter"
                  dataKey="Soft Starter"
                  stroke={COLORS["Soft Starter"]}
                  fill={COLORS["Soft Starter"]}
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Radar
                  name="VFD"
                  dataKey="VFD"
                  stroke={COLORS.VFD}
                  fill={COLORS.VFD}
                  fillOpacity={0.22}
                  strokeWidth={2.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs justify-center">
            {(Object.entries(COLORS) as [keyof typeof COLORS, string][]).map(([k, color]) => (
              <span key={k} className="inline-flex items-center gap-2 text-text-secondary">
                <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* CAPEX TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-static overflow-hidden"
        >
          <div className="p-6 lg:p-7 border-b border-ink-700">
            <h3 className="font-display text-xl text-white">CAPEX comparison</h3>
            <p className="text-sm text-text-secondary mt-1">
              Indicative pricing in 2026 USD. ±15% margin for regional installation costs.
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-widest text-text-tertiary">
              <tr className="border-b border-ink-700">
                <th className="text-left p-4">Item</th>
                <th className="text-right p-4 text-spark-amber">Auto-TX</th>
                <th className="text-right p-4 text-spark-orange">SS</th>
                <th className="text-right p-4 text-electric">VFD</th>
              </tr>
            </thead>
            <tbody>
              {CAPEX.map((row, i) => {
                const isTotal = row.item.startsWith("TOTAL");
                return (
                  <tr
                    key={row.item}
                    className={`border-b border-ink-700 last:border-b-0 ${isTotal ? "bg-ink-900" : ""}`}
                  >
                    <td className={`p-4 ${isTotal ? "font-semibold text-white" : "text-text-secondary"}`}>
                      {row.item}
                    </td>
                    <td className={`p-4 text-right display-number ${isTotal ? "text-spark-amber text-base" : ""}`}>
                      {row.auto}
                    </td>
                    <td className={`p-4 text-right display-number ${isTotal ? "text-spark-orange text-base" : ""}`}>
                      {row.soft}
                    </td>
                    <td className={`p-4 text-right display-number ${isTotal ? "text-electric text-base" : ""}`}>
                      {row.vfd}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-6 border-t border-ink-700 text-sm text-text-secondary leading-relaxed">
            VFD adds ~$70 k over the soft starter at total-system level — and unlocks variable-speed
            no-load testing, kinder genset interaction, and longer motor insulation life under PWM.
            The premium is repaid in test flexibility within the first commissioning campaign.
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
