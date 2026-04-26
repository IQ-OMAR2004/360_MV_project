"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "./ui/Section";
import {
  computeStarting,
  generatorLoading,
  generatorVoltageDipPct,
  shortCircuitCurrentMVAa,
  shortCircuitMVA,
  systemSnapshot,
  transformerVoltageDropPct,
  type StartingMethod,
} from "@/lib/calculations";
import { GENERATOR, MOTOR, TRANSFORMER } from "@/lib/motor";

const METHODS: StartingMethod[] = ["DOL", "Autotransformer", "SoftStarter", "VFD"];

function MetricRow({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: "ok" | "warn" | "bad" }) {
  const color =
    accent === "ok"
      ? "text-kfupm-glow"
      : accent === "warn"
        ? "text-spark-amber"
        : accent === "bad"
          ? "text-spark-orange"
          : "text-electric";
  return (
    <div className="flex items-baseline justify-between border-b border-ink-700 py-3 last:border-b-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`display-number text-lg ${color}`}>
        {value}
        {unit && <span className="text-xs text-text-tertiary ml-1">{unit}</span>}
      </span>
    </div>
  );
}

export function Calculations() {
  const [method, setMethod] = useState<StartingMethod>("VFD");
  const [tap, setTap] = useState(65);
  const [softV, setSoftV] = useState(50);
  const [txZ, setTxZ] = useState<number>(TRANSFORMER.impedancePct);

  const start = useMemo(() => {
    return computeStarting(method, {
      autotransformerTap: tap / 100,
      softStarterVoltagePu: softV / 100,
    });
  }, [method, tap, softV]);

  const gen = useMemo(() => generatorLoading(start.lineCurrentA), [start]);
  const dipGen = useMemo(() => generatorVoltageDipPct(start.lineCurrentA), [start]);
  const txDrop = useMemo(() => {
    // override transformer impedance live (re-derive without mutating const)
    const Zpu = txZ / 100;
    const Zsec = (Zpu * TRANSFORMER.secondaryVoltageV ** 2) / (TRANSFORMER.ratedKVA * 1000);
    return (100 * start.lineCurrentA * Zsec) / (TRANSFORMER.secondaryVoltageV / Math.sqrt(3) * Math.sqrt(3));
  }, [start, txZ]);
  const sys = useMemo(() => systemSnapshot(), []);

  return (
    <Section
      id="calculations"
      eyebrow="Engineering Calculations"
      title={
        <>
          Live Numbers,<br />
          <span className="text-electric glow-text">Driven by Sliders.</span>
        </>
      }
      subtitle="Every key engineering metric is derived in /lib/calculations.ts. Drag the sliders below to see how design choices ripple through the system."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* CONTROLS */}
        <div className="card-static p-6 lg:p-8 lg:col-span-1">
          <h3 className="font-display text-xl mb-6">Controls</h3>

          <div className="mb-6">
            <label className="block text-[11px] uppercase tracking-widest text-text-tertiary mb-2">
              Starting Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider border transition ${
                    method === m
                      ? "bg-electric text-ink-950 border-electric shadow-glow-electric"
                      : "bg-ink-900 text-text-secondary border-ink-600 hover:border-electric/40"
                  }`}
                >
                  {m === "SoftStarter" ? "Soft Starter" : m}
                </button>
              ))}
            </div>
          </div>

          {method === "Autotransformer" && (
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-[11px] uppercase tracking-widest text-text-tertiary">
                  Autotransformer tap
                </label>
                <span className="display-number text-electric text-sm">{tap}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={80}
                value={tap}
                onChange={(e) => setTap(Number(e.target.value))}
                className="w-full accent-electric"
              />
            </div>
          )}

          {method === "SoftStarter" && (
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-[11px] uppercase tracking-widest text-text-tertiary">
                  Initial voltage
                </label>
                <span className="display-number text-electric text-sm">{softV}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={75}
                value={softV}
                onChange={(e) => setSoftV(Number(e.target.value))}
                className="w-full accent-electric"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[11px] uppercase tracking-widest text-text-tertiary">
                Transformer %Z
              </label>
              <span className="display-number text-electric text-sm">{txZ.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={4}
              max={10}
              step={0.5}
              value={txZ}
              onChange={(e) => setTxZ(Number(e.target.value))}
              className="w-full accent-electric"
            />
            <p className="text-[11px] text-text-tertiary mt-2">
              Higher %Z reduces fault current but increases voltage drop during start.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-ink-700">
            <div className="text-[11px] uppercase tracking-widest text-text-tertiary mb-3">
              Fixed system snapshot
            </div>
            <MetricRow label="MV bus short-circuit" value={sys.shortCircuitKAa.toFixed(2)} unit="kA" />
            <MetricRow label="Short-circuit MVA" value={sys.shortCircuitMVA.toFixed(1)} unit="MVA" />
            <MetricRow
              label="TX rated current (HV)"
              value={sys.transformerLineCurrentAtRatedA.toFixed(0)}
              unit="A"
            />
            <MetricRow
              label="Generator selected"
              value={GENERATOR.selectedKVA.toLocaleString()}
              unit="kVA"
            />
          </div>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          <motion.div
            key={method}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card-static p-6 lg:p-7"
          >
            <div className="text-xs uppercase tracking-widest text-electric mb-2">Motor side</div>
            <h3 className="font-display text-lg text-white mb-4">{start.method}</h3>
            <MetricRow label="Voltage at motor" value={(start.motorVoltagePu * 100).toFixed(0)} unit="% V_n" />
            <MetricRow
              label="Motor starting current"
              value={start.motorCurrentA.toFixed(0)}
              unit="A"
              accent={start.motorCurrentA > 4 * MOTOR.ratedCurrentA ? "bad" : start.motorCurrentA > 2 * MOTOR.ratedCurrentA ? "warn" : "ok"}
            />
            <MetricRow
              label="× rated"
              value={(start.motorCurrentA / MOTOR.ratedCurrentA).toFixed(2)}
              unit="× I_n"
            />
            <MetricRow
              label="Starting torque"
              value={(start.startingTorquePu * 100).toFixed(0)}
              unit="% T_n"
              accent={start.startingTorquePu < 0.4 ? "warn" : "ok"}
            />
          </motion.div>

          <motion.div
            key={`${method}-line`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="card-static p-6 lg:p-7"
          >
            <div className="text-xs uppercase tracking-widest text-electric mb-2">MV / line side</div>
            <h3 className="font-display text-lg text-white mb-4">Network impact</h3>
            <MetricRow
              label="Line current (MV)"
              value={start.lineCurrentA.toFixed(0)}
              unit="A"
            />
            <MetricRow
              label="TX voltage drop"
              value={txDrop.toFixed(1)}
              unit="%"
              accent={txDrop > 8 ? "bad" : txDrop > 4 ? "warn" : "ok"}
            />
            <MetricRow
              label="Generator dip (term.)"
              value={dipGen.toFixed(1)}
              unit="%"
              accent={dipGen > 25 ? "bad" : dipGen > 12 ? "warn" : "ok"}
            />
            <MetricRow
              label="Generator loading"
              value={gen.loadingPct.toFixed(0)}
              unit="%"
              accent={gen.loadingPct > 110 ? "bad" : gen.loadingPct > 90 ? "warn" : "ok"}
            />
          </motion.div>

          <div className="md:col-span-2 card-static p-6 lg:p-7 border-l-4 border-electric">
            <div className="text-xs uppercase tracking-widest text-electric mb-2">Engineer's note</div>
            <p className="text-text-secondary leading-relaxed">{start.notes}</p>
          </div>

          {/* Generator loading bar */}
          <div className="md:col-span-2 card-static p-6 lg:p-7">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-display text-lg text-white">Generator loading</h3>
              <span className="display-number text-electric">
                {gen.scenarioKVA.toFixed(0)} / {GENERATOR.selectedKVA.toLocaleString()} kVA
              </span>
            </div>
            <div className="w-full h-7 bg-ink-900 rounded-full overflow-hidden border border-ink-600 relative">
              <motion.div
                key={gen.loadingPct}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(gen.loadingPct, 200)}%` }}
                transition={{ duration: 0.6 }}
                className={`h-full ${
                  gen.loadingPct > 110
                    ? "bg-spark-orange"
                    : gen.loadingPct > 90
                      ? "bg-spark-amber"
                      : "bg-spark-gradient"
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">
                {gen.loadingPct.toFixed(0)}%
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-text-tertiary">
              <span>0%</span>
              <span>50%</span>
              <span className="text-kfupm-glow">100%</span>
              <span className="text-spark-orange">150%</span>
              <span>200%</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
