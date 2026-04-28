"use client";

import { useMemo } from "react";
import {
  PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { useParameters } from "@/store/parameters";
import { snapshot, tradeoffScores } from "@/lib/engineering";
import { simulate } from "@/lib/motorModel";

const METRICS = ["Tech. Feas.", "Gen. Compat.", "Capital Cost", "Install Ease", "Reliability"] as const;

export function RadarPanel() {
  const all = useParameters();
  const params = useMemo(() => ({
    motor: all.motor, generator: all.generator, transformer: all.transformer,
    starter: all.starter, cable: all.cable,
  }), [all.motor, all.generator, all.transformer, all.starter, all.cable]);

  const snap = useMemo(() => snapshot(params), [params]);
  const _trace = useMemo(() => simulate(params), [params]); // re-trigger

  // Score the live current method.
  const liveScores = useMemo(() => tradeoffScores(params, snap), [params, snap]);

  // Score every method using the same params (override starter.method for each).
  const allMethodScores = useMemo(() => {
    const methods = ["DOL","Autotransformer","SoftStarter","VFD"] as const;
    return methods.map((m) => {
      const p2 = { ...params, starter: { ...params.starter, method: m } };
      const snap2 = snapshot(p2);
      const sc = tradeoffScores(p2, snap2);
      return { method: m, scores: sc };
    });
  }, [params]);

  // Build chart data: row per metric, column per method.
  const data = METRICS.map((metric, i) => {
    const keys = ["technicalFeasibility","generatorCompatibility","capitalCost","installationComplexity","reliability"] as const;
    const k = keys[i];
    const row: Record<string, number | string> = { metric };
    for (const m of allMethodScores) row[m.method] = m.scores[k];
    return row;
  });

  const COLORS = { DOL:"#EB1B26", Autotransformer:"#FF6B35", SoftStarter:"#FFB347", VFD:"#FFFFFF" };
  const active = all.starter.method;

  return (
    <div className="bg-[#0D1117] border border-[#1B2026] p-5" style={{ borderRadius: "2px" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-[2px] bg-[#EB1B26]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">Trade-off Radar (live)</h3>
        </div>
        <span className="text-[10px] text-white/40 font-mono">PDF §7.3 — 5 criteria</span>
      </div>
      <p className="text-xs text-white/55 mb-3">
        Active method <span className="text-[#EB1B26] font-black">{active}</span> drawn bold.  All scores recompute as parameters change.
      </p>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#1B2026" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0,10]} tick={{ fill: "#3A4049", fontSize: 9 }} stroke="#1B2026" />
            <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #EB1B26", borderRadius: "0", fontSize: "11px" }}/>
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}/>
            {(["DOL","Autotransformer","SoftStarter","VFD"] as const).map((m) => (
              <Radar key={m} name={m} dataKey={m}
                stroke={COLORS[m]} fill={COLORS[m]}
                fillOpacity={m === active ? 0.28 : 0.08}
                strokeWidth={m === active ? 2.5 : 1} />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {/* Live scores summary */}
      <div className="grid grid-cols-5 gap-1.5 mt-3 text-[10px]">
        {(["technicalFeasibility","generatorCompatibility","capitalCost","installationComplexity","reliability"] as const).map((k, i) => (
          <div key={k} className="bg-black border border-[#1B2026] p-2" style={{ borderRadius: "1px" }}>
            <div className="text-white/40 uppercase tracking-widest text-[8px] mb-1">{METRICS[i]}</div>
            <div className="display-number text-[#EB1B26] text-lg leading-none">
              {liveScores[k].toFixed(1)}<span className="text-white/40 text-[10px]">/10</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
