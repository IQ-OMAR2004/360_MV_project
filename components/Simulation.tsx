"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

const COLORS: Record<string, string> = {
  DOL: "#FF7A00",
  "Soft Starter": "#FFB347",
  VFD: "#00E0FF",
};

const PLOTS = [
  { key: "speed_rpm", title: "Speed", unit: "rpm", domain: [0, 1900] as [number, number] },
  { key: "current_A", title: "Stator current", unit: "A", domain: [0, 1700] as [number, number] },
  { key: "torque_Nm", title: "Electromagnetic torque", unit: "N·m", domain: [0, 22000] as [number, number] },
  { key: "generator_voltage_pu", title: "Generator terminal voltage", unit: "pu", domain: [0.5, 1.05] as [number, number] },
] as const;

function downsample<T>(arr: T[], stride: number): T[] {
  return arr.filter((_, i) => i % stride === 0);
}

function buildSeries(
  visible: string[],
  metric: keyof Pick<Trace, "speed_rpm" | "current_A" | "torque_Nm" | "generator_voltage_pu">,
) {
  // Build merged dataset: union of timestamps with separate columns per method.
  // Downsample for chart performance; quality stays high.
  const points: Array<Record<string, number>> = [];
  const maxLen = Math.max(...visible.map((m) => TRACES[m].time_s.length));
  for (let i = 0; i < maxLen; i += 4) {
    const row: Record<string, number> = { t: NaN };
    for (const m of visible) {
      const trace = TRACES[m];
      if (i < trace.time_s.length) {
        if (Number.isNaN(row.t)) row.t = trace.time_s[i];
        row[m] = (trace[metric] as number[])[i];
      }
    }
    if (!Number.isNaN(row.t)) points.push(row);
  }
  return points;
}

export function Simulation() {
  const [visible, setVisible] = useState<string[]>(["DOL", "Soft Starter", "VFD"]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(1.0); // 0..1 fraction of simulation timeline shown

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

  const series = useMemo(() => {
    return PLOTS.map((p) => ({
      ...p,
      data: buildSeries(visible, p.key).filter((row, _i, arr) => row.t <= arr[arr.length - 1].t * progress + 0.01),
    }));
  }, [visible, progress]);

  return (
    <Section
      id="simulation"
      eyebrow="Dynamic Simulation"
      title={
        <>
          The Start —<br />
          <span className="text-electric glow-text">Watched in Slow Motion.</span>
        </>
      }
      subtitle={
        <>
          Pre-computed in <span className="font-mono">/simulation/solve.py</span> and exported to JSON.
          Toggle methods on/off, hit play to animate the start sequence, and read off the peak current,
          time-to-speed, and voltage dip.
        </>
      }
    >
      {/* Controls */}
      <div className="card-static p-5 mb-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {Object.keys(TRACES).map((m) => {
            const on = visible.includes(m);
            return (
              <button
                key={m}
                onClick={() =>
                  setVisible((v) => (on ? v.filter((x) => x !== m) : [...v, m]))
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition ${
                  on
                    ? "bg-ink-900 border-ink-600"
                    : "bg-transparent border-ink-700 opacity-50 hover:opacity-100"
                }`}
                style={{ color: on ? COLORS[m] : "#7A828D" }}
              >
                <span
                  className="block w-3 h-3 rounded-full"
                  style={{ backgroundColor: on ? COLORS[m] : "#3A4049" }}
                />
                {m}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setPlaying(true)}
          disabled={playing}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-electric text-ink-950 disabled:opacity-50 hover:bg-electric-300 transition shadow-glow-electric"
        >
          {playing ? "Playing…" : "▶ Play start sequence"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {series.map((p, idx) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.06 }}
            className="card-static p-5"
          >
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-display text-lg text-white">{p.title}</h3>
              <span className="text-[11px] uppercase tracking-widest text-text-tertiary">
                {p.unit}
              </span>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={p.data} margin={{ top: 6, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#262A30" strokeDasharray="2 4" />
                  <XAxis
                    dataKey="t"
                    type="number"
                    domain={["auto", "auto"]}
                    stroke="#7A828D"
                    tickFormatter={(v) => `${(+v).toFixed(1)}s`}
                    fontSize={11}
                  />
                  <YAxis
                    stroke="#7A828D"
                    domain={p.domain}
                    fontSize={11}
                    width={60}
                    tickFormatter={(v) =>
                      p.unit === "pu" ? (+v).toFixed(2) : (+v).toFixed(0)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #262A30",
                      borderRadius: 8,
                      fontFamily: "JetBrains Mono",
                    }}
                    labelFormatter={(v) => `t = ${(+v).toFixed(2)} s`}
                  />
                  {visible.map((m) => (
                    <Line
                      key={m}
                      type="monotone"
                      dataKey={m}
                      stroke={COLORS[m]}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary table */}
      <div className="card-static mt-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-700">
          <h3 className="font-display text-lg text-white">Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-widest text-text-tertiary">
              <tr className="border-b border-ink-700">
                <th className="text-left p-4">Method</th>
                <th className="text-right p-4">Peak I (A)</th>
                <th className="text-right p-4">× I_n</th>
                <th className="text-right p-4">t to N_rated (s)</th>
                <th className="text-right p-4">V_gen min (pu)</th>
                <th className="text-right p-4">Peak T (N·m)</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(TRACES).map((t) => (
                <tr key={t.method} className="border-b border-ink-700 last:border-b-0">
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <span
                        className="block w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[t.method] }}
                      />
                      {t.method}
                    </span>
                  </td>
                  <td className="p-4 text-right display-number text-electric">
                    {t.summary.peak_current_A.toFixed(0)}
                  </td>
                  <td className="p-4 text-right display-number">
                    {t.summary.peak_current_per_unit.toFixed(2)}×
                  </td>
                  <td className="p-4 text-right display-number">
                    {t.summary.time_to_rated_speed_s.toFixed(2)}
                  </td>
                  <td
                    className={`p-4 text-right display-number ${
                      t.summary.min_generator_voltage_pu < 0.7
                        ? "text-spark-orange"
                        : t.summary.min_generator_voltage_pu < 0.9
                          ? "text-spark-amber"
                          : "text-kfupm-glow"
                    }`}
                  >
                    {t.summary.min_generator_voltage_pu.toFixed(2)}
                  </td>
                  <td className="p-4 text-right display-number">
                    {(t.summary.peak_torque_Nm / 1000).toFixed(1)} k
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
