"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useParameters } from "@/store/parameters";
import { simulate, simulateAll, torqueSpeedCurve, type Trace } from "@/lib/motorModel";
import type { StartingMethod } from "@/store/parameters";

const COLOR: Record<StartingMethod, string> = {
  DOL: "#EB1B26",
  Autotransformer: "#FF6B35",
  SoftStarter: "#FFB347",
  VFD: "#FFFFFF",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#000",
  border: "1px solid #EB1B26",
  borderRadius: "0",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "11px",
  padding: "6px 10px",
};

interface PlotConfig {
  title: string;
  unit: string;
  field: keyof Pick<Trace, "N" | "I" | "T" | "Vgen">;
  domain: [number, number];
  pdfRef: string;
  refLines?: { y: number; stroke: string; label: string }[];
}

function buildSeries(traces: Record<StartingMethod, Trace>, field: PlotConfig["field"], visibleSet: Set<StartingMethod>, progress: number) {
  // Take a uniform time grid across all visible traces, sampled at 0.04 s.
  const all = (Object.keys(traces) as StartingMethod[]).filter((m) => visibleSet.has(m));
  if (all.length === 0) return [];

  const tMax = Math.max(...all.map((m) => traces[m].t[traces[m].t.length-1])) * progress;
  const points: Array<Record<string, number>> = [];
  const stride = 0.04;

  for (let t = 0; t <= tMax + 1e-6; t += stride) {
    const row: Record<string, number> = { t };
    for (const m of all) {
      const tr = traces[m];
      // linear interp at time t
      const idx = Math.min(Math.floor(t / 0.02), tr.t.length - 1);
      row[m] = (tr[field] as number[])[idx];
    }
    points.push(row);
  }
  return points;
}

export function SimulationPlots() {
  const all = useParameters();
  const params = useMemo(() => ({
    motor: all.motor,
    generator: all.generator,
    transformer: all.transformer,
    starter: all.starter,
    cable: all.cable,
  }), [all.motor, all.generator, all.transformer, all.starter, all.cable]);

  const traces = useMemo(() => simulateAll(params), [params]);
  const tnCurve = useMemo(() => torqueSpeedCurve(all.motor), [all.motor]);
  const _activeTrace = useMemo(() => simulate(params), [params]); // ensures the active method always recomputed

  const [visible, setVisible] = useState<Set<StartingMethod>>(new Set([all.starter.method]));
  // When the user selects a method via the parameters panel, ensure it's visible.
  useEffect(() => {
    setVisible((prev) => new Set([...prev, all.starter.method]));
  }, [all.starter.method]);

  // Animation state
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(1.0);
  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const t0 = performance.now();
    const dur = 6000;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const plots: PlotConfig[] = [
    { title: "Speed", unit: "rpm", field: "N", domain: [0, all.motor.ratedSpeedRpm * 1.05], pdfRef: "PDF §6 — speed vs t" },
    { title: "Stator current", unit: "A", field: "I", domain: [0, all.motor.ratedCurrentA * 7], pdfRef: "PDF §6 — I vs t" },
    { title: "EM torque", unit: "N·m", field: "T", domain: [0, 22000], pdfRef: "PDF §6 — T vs t" },
    {
      title: "Generator voltage", unit: "pu", field: "Vgen",
      domain: [0.5, 1.05], pdfRef: "PDF §4.3.1 — V_gen dip",
      refLines: [
        { y: 1 - all.generator.allowableDipPct/100, stroke: "#FFB347", label: `Allowable ${all.generator.allowableDipPct}% dip` },
        { y: 0.7, stroke: "#EB1B26", label: "0.70 — UV trip" },
      ],
    },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-[2px] bg-[#EB1B26]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">
            Time-Domain Simulation
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(COLOR) as StartingMethod[]).map((m) => {
            const on = visible.has(m);
            return (
              <button
                key={m}
                onClick={() => {
                  setVisible((prev) => {
                    const next = new Set(prev);
                    on ? next.delete(m) : next.add(m);
                    return next;
                  });
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest border transition ${
                  on ? "border-[#EB1B26]/50" : "border-[#1B2026] opacity-50 hover:opacity-100"
                }`}
                style={{
                  color: on ? COLOR[m] : "#3A4049",
                  backgroundColor: on ? "rgba(235,27,38,0.06)" : "#000",
                  borderRadius: "1px",
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: on ? COLOR[m] : "#3A4049" }} />
                {m === "SoftStarter" ? "Soft" : m}
              </button>
            );
          })}
          <button
            onClick={() => setPlaying(true)}
            disabled={playing}
            className="btn-red text-[10px] disabled:opacity-50 px-3 py-1.5"
          >
            {playing ? "▶" : "▶ Play"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        {plots.map((p, i) => {
          const data = buildSeries(traces, p.field, visible, progress);
          return (
            <motion.div
              key={p.field}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="bg-[#0D1117] border border-[#1B2026] p-4"
              style={{ borderRadius: "2px" }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="font-display font-black text-base text-white">{p.title}</h4>
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">{p.unit}</span>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#1B2026" strokeDasharray="3 5" />
                    <XAxis dataKey="t" type="number" domain={["auto","auto"]} stroke="#3A4049"
                      tickFormatter={(v) => `${(+v).toFixed(1)}s`} fontSize={9} />
                    <YAxis stroke="#3A4049" domain={p.domain} fontSize={9} width={48}
                      tickFormatter={(v) => p.unit === "pu" ? (+v).toFixed(2) : Math.round(+v).toString()} />
                    {p.refLines?.map((r) => (
                      <ReferenceLine key={r.label} y={r.y} stroke={r.stroke} strokeDasharray="4 4"
                        label={{ value: r.label, fill: r.stroke, fontSize: 9, position: "right" }} />
                    ))}
                    <Tooltip contentStyle={TOOLTIP_STYLE}
                      labelFormatter={(v) => `t = ${(+v).toFixed(2)} s`}
                      formatter={(v: number, n: string) => [
                        `${(+v).toFixed(p.unit === "pu" ? 3 : 0)} ${p.unit}`, n,
                      ]}
                    />
                    {Array.from(visible).map((m) => (
                      <Line key={m} type="monotone" dataKey={m} stroke={COLOR[m]}
                        strokeWidth={m === all.starter.method ? 2.5 : 1.5} dot={false}
                        isAnimationActive={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-1.5 text-[9px] text-white/30 font-mono uppercase tracking-widest">{p.pdfRef}</div>
            </motion.div>
          );
        })}

        {/* Torque-speed curve */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="lg:col-span-2 bg-[#0D1117] border border-[#1B2026] p-4"
          style={{ borderRadius: "2px" }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <h4 className="font-display font-black text-base text-white">Torque–speed characteristic</h4>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">N·m vs rpm</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tnCurve} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1B2026" strokeDasharray="3 5" />
                <XAxis dataKey="N" type="number" stroke="#3A4049"
                  domain={[0, "dataMax"]} tickFormatter={(v) => `${Math.round(+v)}`} fontSize={9} />
                <YAxis stroke="#3A4049" fontSize={9} width={56} />
                <Tooltip contentStyle={TOOLTIP_STYLE}
                  labelFormatter={(v) => `N = ${(+v).toFixed(0)} rpm`} />
                <Line type="monotone" dataKey="Tem" stroke="#EB1B26" strokeWidth={2.2} dot={false} name="T_motor (electromag.)" isAnimationActive={false} />
                <Line type="monotone" dataKey="Tload" stroke="#FFFFFF" strokeWidth={1.5} strokeDasharray="6 4" dot={false} name="T_load (quadratic)" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1.5 text-[9px] text-white/30 font-mono uppercase tracking-widest">PDF §4.2 — torque-speed with load curve overlay</div>
        </motion.div>
      </div>
    </div>
  );
}
