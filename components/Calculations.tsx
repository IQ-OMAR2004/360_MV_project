"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "./ui/Section";
import {
  computeStarting,
  generatorLoading,
  generatorVoltageDipPct,
  systemSnapshot,
  type StartingMethod,
} from "@/lib/calculations";
import { GENERATOR, MOTOR, TRANSFORMER } from "@/lib/motor";

const METHODS: StartingMethod[] = ["DOL", "Autotransformer", "SoftStarter", "VFD"];

function MetricRow({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: "ok" | "warn" | "bad";
}) {
  const color =
    accent === "ok" ? "#4BA181" : accent === "warn" ? "#FFB347" : accent === "bad" ? "#EB1B26" : "#EB1B26";
  return (
    <div className="flex items-baseline justify-between border-b border-white/10 py-3 last:border-0">
      <span className="text-sm text-white/60">{label}</span>
      <span className="display-number text-lg" style={{ color }}>
        {value}
        {unit && <span className="text-xs text-white/40 ml-1">{unit}</span>}
      </span>
    </div>
  );
}

export function Calculations() {
  const [method, setMethod] = useState<StartingMethod>("VFD");
  const [tap, setTap] = useState(65);
  const [softV, setSoftV] = useState(50);
  const [txZ, setTxZ] = useState<number>(TRANSFORMER.impedancePct);

  const start = useMemo(
    () => computeStarting(method, { autotransformerTap: tap / 100, softStarterVoltagePu: softV / 100 }),
    [method, tap, softV],
  );
  const gen = useMemo(() => generatorLoading(start.lineCurrentA), [start]);
  const dipGen = useMemo(() => generatorVoltageDipPct(start.lineCurrentA), [start]);
  const txDrop = useMemo(() => {
    const Zpu = txZ / 100;
    const Zsec = (Zpu * TRANSFORMER.secondaryVoltageV ** 2) / (TRANSFORMER.ratedKVA * 1000);
    return (100 * start.lineCurrentA * Zsec) / (TRANSFORMER.secondaryVoltageV / Math.sqrt(3) * Math.sqrt(3));
  }, [start, txZ]);
  const sys = useMemo(() => systemSnapshot(), []);

  return (
    <Section
      id="calculations"
      variant="darker"
      eyebrow="Engineering Calculations"
      title={<>Live Numbers,<br /><span style={{ color: "#EB1B26" }}>Driven by Sliders.</span></>}
      subtitle="Every key engineering metric is derived in /lib/calculations.ts. Drag the sliders below to see how design choices ripple through the system."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-[#0D1117] border border-[#1B2026] p-6 lg:p-7" style={{ borderRadius: "2px" }}>
          <h3 className="font-display font-black text-xl text-white mb-6">Controls</h3>

          <div className="mb-6">
            <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">
              Starting Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-3 py-2.5 text-xs font-black uppercase tracking-widest border transition-all ${
                    method === m
                      ? "bg-[#EB1B26] text-white border-[#EB1B26] shadow-[0_0_16px_rgba(235,27,38,0.4)]"
                      : "bg-black text-white/50 border-[#1B2026] hover:border-[#EB1B26]/40 hover:text-white"
                  }`}
                  style={{ borderRadius: "1px" }}
                >
                  {m === "SoftStarter" ? "Soft Start" : m}
                </button>
              ))}
            </div>
          </div>

          {method === "Autotransformer" && (
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">AT Tap</label>
                <span className="display-number text-[#EB1B26]">{tap}%</span>
              </div>
              <input type="range" min={50} max={80} value={tap}
                onChange={(e) => setTap(Number(e.target.value))}
                className="w-full accent-[#EB1B26]" />
            </div>
          )}
          {method === "SoftStarter" && (
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">Initial V</label>
                <span className="display-number text-[#EB1B26]">{softV}%</span>
              </div>
              <input type="range" min={30} max={75} value={softV}
                onChange={(e) => setSoftV(Number(e.target.value))}
                className="w-full accent-[#EB1B26]" />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">TX %Z</label>
              <span className="display-number text-[#EB1B26]">{txZ.toFixed(1)}%</span>
            </div>
            <input type="range" min={4} max={10} step={0.5} value={txZ}
              onChange={(e) => setTxZ(Number(e.target.value))}
              className="w-full accent-[#EB1B26]" />
            <p className="text-[10px] text-white/40 mt-2">Higher %Z → lower fault current, higher volt-drop during start.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40 mb-3">Fixed snapshot</div>
            <MetricRow label="MV bus Isc" value={sys.shortCircuitKAa.toFixed(2)} unit="kA" />
            <MetricRow label="Short-circuit MVA" value={sys.shortCircuitMVA.toFixed(1)} unit="MVA" />
            <MetricRow label="TX rated I (HV)" value={sys.transformerLineCurrentAtRatedA.toFixed(0)} unit="A" />
            <MetricRow label="Generator selected" value={GENERATOR.selectedKVA.toLocaleString()} unit="kVA" />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          <motion.div key={method} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            className="bg-[#0D1117] border border-[#1B2026] p-6" style={{ borderRadius: "2px" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="block w-4 h-[2px] bg-[#EB1B26]" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#EB1B26]">Motor side</span>
            </div>
            <h3 className="font-display font-black text-xl text-white mb-4">{start.method}</h3>
            <MetricRow label="Voltage at motor" value={(start.motorVoltagePu * 100).toFixed(0)} unit="% V_n" />
            <MetricRow label="Motor start current" value={start.motorCurrentA.toFixed(0)} unit="A"
              accent={start.motorCurrentA > 4 * MOTOR.ratedCurrentA ? "bad" : start.motorCurrentA > 2 * MOTOR.ratedCurrentA ? "warn" : "ok"} />
            <MetricRow label="× rated" value={(start.motorCurrentA / MOTOR.ratedCurrentA).toFixed(2)} unit="× I_n" />
            <MetricRow label="Starting torque" value={(start.startingTorquePu * 100).toFixed(0)} unit="% T_n"
              accent={start.startingTorquePu < 0.4 ? "warn" : "ok"} />
          </motion.div>

          <motion.div key={`${method}-line`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.04 }}
            className="bg-[#0D1117] border border-[#1B2026] p-6" style={{ borderRadius: "2px" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="block w-4 h-[2px] bg-[#EB1B26]" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#EB1B26]">Network impact</span>
            </div>
            <h3 className="font-display font-black text-xl text-white mb-4">MV / line side</h3>
            <MetricRow label="Line current (MV)" value={start.lineCurrentA.toFixed(0)} unit="A" />
            <MetricRow label="TX voltage drop" value={txDrop.toFixed(1)} unit="%"
              accent={txDrop > 8 ? "bad" : txDrop > 4 ? "warn" : "ok"} />
            <MetricRow label="Generator dip" value={dipGen.toFixed(1)} unit="%"
              accent={dipGen > 25 ? "bad" : dipGen > 12 ? "warn" : "ok"} />
            <MetricRow label="Generator loading" value={gen.loadingPct.toFixed(0)} unit="%"
              accent={gen.loadingPct > 110 ? "bad" : gen.loadingPct > 90 ? "warn" : "ok"} />
          </motion.div>

          <div className="md:col-span-2 bg-[#0D1117] border-l-[3px] border-[#EB1B26] border-y border-r border-[#1B2026] p-6" style={{ borderRadius: "0 2px 2px 0" }}>
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#EB1B26] mb-2">Engineer's note</div>
            <p className="text-white/65 leading-relaxed text-sm">{start.notes}</p>
          </div>

          {/* Generator loading bar */}
          <div className="md:col-span-2 bg-[#0D1117] border border-[#1B2026] p-6" style={{ borderRadius: "2px" }}>
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="font-display font-black text-lg text-white">Generator loading</h3>
              <span className="display-number text-[#EB1B26] text-lg">
                {gen.scenarioKVA.toFixed(0)} / {GENERATOR.selectedKVA.toLocaleString()} kVA
              </span>
            </div>
            <div className="w-full h-7 bg-black border border-[#1B2026] relative overflow-hidden">
              <motion.div
                key={gen.loadingPct}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(gen.loadingPct, 200)}%` }}
                transition={{ duration: 0.55 }}
                className="h-full"
                style={{
                  background: gen.loadingPct > 110
                    ? "#EB1B26"
                    : gen.loadingPct > 90
                      ? "#FF8C42"
                      : "linear-gradient(90deg, #EB1B26 0%, #C41520 100%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white tracking-widest drop-shadow">
                {gen.loadingPct.toFixed(0)}%
              </div>
            </div>
            <div className="mt-1.5 flex justify-between text-[9px] font-black uppercase tracking-[0.15em] text-white/30">
              <span>0</span><span>50%</span><span className="text-[#4BA181]">100%</span><span className="text-[#EB1B26]">150%</span><span>200%</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
