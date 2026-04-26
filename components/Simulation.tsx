"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Section } from "./ui/Section";
import dol from "@/data/simulation/dol.json";
import softStarter from "@/data/simulation/soft-starter.json";
import vfd from "@/data/simulation/vfd.json";

type Trace = {
  method: string;
  time_s: number[];
  speed_rpm: number[];
  current_A: number[];
  torque_Nm: number[];
  generator_voltage_pu: number[];
  summary: {
    peak_current_A: number;
    peak_current_per_unit: number;
    time_to_rated_speed_s: number;
    min_generator_voltage_pu: number;
    peak_torque_Nm: number;
  };
};

const TRACES: Record<string, Trace> = {
  DOL: dol as unknown as Trace,
  "Soft Starter": softStarter as unknown as Trace,
  VFD: vfd as unknown as Trace,
};

// Sparkon-aligned colors: DOL=red, SS=orange-red, VFD=white (on dark bg)
const COLORS: Record<string, string> = {
  DOL: "#EB1B26",
  "Soft Starter": "#FF6B35",
  VFD: "#FFFFFF",
};

const PLOTS = [
  { key: "speed_rpm",            title: "Motor speed",           unit: "rpm",  domain: [0, 1900]     as [number,number] },
  { key: "current_A",            title: "Stator current",        unit: "A",    domain: [0, 1700]     as [number,number] },
  { key: "torque_Nm",            title: "Electromagnetic torque",unit: "N·m",  domain: [0, 22000]    as [number,number] },
  { key: "generator_voltage_pu", title: "Generator voltage",     unit: "pu",   domain: [0.5, 1.05]   as [number,number] },
] as const;

function buildSeries(
  visible: string[],
  metric: keyof Pick<Trace,"speed_rpm"|"current_A"|"torque_Nm"|"generator_voltage_pu">,
) {
  const maxLen = Math.max(...visible.map((m) => TRACES[m].time_s.length));
  const points: Array<Record<string,number>> = [];
  for (let i = 0; i < maxLen; i += 4) {
    const row: Record<string,number> = { t: NaN };
    for (const m of visible) {
      const t = TRACES[m];
      if (i < t.time_s.length) {
        if (Number.isNaN(row.t)) row.t = t.time_s[i];
        row[m] = (t[metric] as number[])[i];
      }
    }
    if (!Number.isNaN(row.t)) points.push(row);
  }
  return points;
}

export function Simulation() {
  const [visible, setVisible] = useState<string[]>(["DOL","Soft Starter","VFD"]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(1.0);

  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const start = performance.now();
    const duration = 6000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const series = useMemo(() => PLOTS.map((p) => ({
    ...p,
    data: buildSeries(visible, p.key).filter((row, _i, arr) =>
      row.t <= arr[arr.length-1].t * progress + 0.01
    ),
  })), [visible, progress]);

  const TOOLTIP_STYLE = {
    backgroundColor: "#000",
    border: "1px solid #EB1B26",
    borderRadius: "0px",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "11px",
  };

  return (
    <Section
      id="simulation"
      variant="darker"
      eyebrow="Dynamic Simulation"
      title={<>The Start —<br /><span style={{ color: "#EB1B26" }}>Watched in Motion.</span></>}
      subtitle={<>Pre-computed by <span className="font-mono">simulation/solve.py</span> and exported to JSON. Toggle methods, hit Play, compare peak current, speed ramp, torque, and generator voltage.</>}
    >
      {/* Toggle + play controls */}
      <div className="bg-[#0D1117] border border-[#1B2026] p-5 mb-6 flex flex-wrap items-center gap-4 justify-between" style={{ borderRadius: "2px" }}>
        <div className="flex flex-wrap gap-2">
          {Object.keys(TRACES).map((m) => {
            const on = visible.includes(m);
            return (
              <button
                key={m}
                onClick={() => setVisible((v) => on ? v.filter((x)=>x!==m) : [...v,m])}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border transition-all ${on ? "border-[#EB1B26]/50 bg-[#EB1B26]/10" : "border-[#1B2026] bg-black opacity-50 hover:opacity-100"}`}
                style={{ color: on ? COLORS[m] : "#3A4049", borderRadius: "1px" }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: on ? COLORS[m] : "#3A4049" }} />
                {m}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setPlaying(true)}
          disabled={playing}
          className="btn-red text-xs disabled:opacity-50"
        >
          {playing ? "Playing…" : "▶ Play start sequence"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {series.map((p, idx) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.05 }}
            className="bg-[#0D1117] border border-[#1B2026] p-5"
            style={{ borderRadius: "2px" }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-display font-black text-white text-lg">{p.title}</h3>
              <span className="display-number text-[10px] text-white/40 uppercase tracking-widest">{p.unit}</span>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={p.data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#1B2026" strokeDasharray="3 5" />
                  <XAxis dataKey="t" type="number" domain={["auto","auto"]} stroke="#3A4049"
                    tickFormatter={(v) => `${(+v).toFixed(1)}s`} fontSize={10} />
                  <YAxis stroke="#3A4049" domain={p.domain} fontSize={10} width={56}
                    tickFormatter={(v) => p.unit==="pu" ? (+v).toFixed(2) : (+v).toFixed(0)} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} labelFormatter={(v) => `t = ${(+v).toFixed(2)} s`} />
                  {visible.map((m) => (
                    <Line key={m} type="monotone" dataKey={m} stroke={COLORS[m]}
                      strokeWidth={2} dot={false} isAnimationActive={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary table */}
      <div className="bg-[#0D1117] border border-[#1B2026] mt-8 overflow-hidden" style={{ borderRadius: "2px" }}>
        <div className="px-6 py-4 border-b-2 border-[#EB1B26]/40">
          <h3 className="font-display font-black text-xl text-white">Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1B2026] text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
                <th className="text-left p-4">Method</th>
                <th className="text-right p-4">Peak I (A)</th>
                <th className="text-right p-4">× I_n</th>
                <th className="text-right p-4">t speed (s)</th>
                <th className="text-right p-4">V_gen min</th>
                <th className="text-right p-4">Peak T (N·m)</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(TRACES).map((t) => (
                <tr key={t.method} className="border-b border-[#1B2026] last:border-0">
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 font-black">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[t.method] }} />
                      {t.method}
                    </span>
                  </td>
                  <td className="p-4 text-right display-number text-[#EB1B26]">{t.summary.peak_current_A.toFixed(0)}</td>
                  <td className="p-4 text-right display-number">{t.summary.peak_current_per_unit.toFixed(2)}×</td>
                  <td className="p-4 text-right display-number">{t.summary.time_to_rated_speed_s.toFixed(2)}</td>
                  <td className={`p-4 text-right display-number ${t.summary.min_generator_voltage_pu < 0.7 ? "text-[#EB1B26]" : t.summary.min_generator_voltage_pu < 0.9 ? "text-[#FFB347]" : "text-[#4BA181]"}`}>
                    {t.summary.min_generator_voltage_pu.toFixed(2)}
                  </td>
                  <td className="p-4 text-right display-number">{(t.summary.peak_torque_Nm/1000).toFixed(1)} k</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
