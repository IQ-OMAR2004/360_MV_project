"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Section } from "./ui/Section";
import { MOTOR } from "@/lib/motor";
import { motorSnapshot } from "@/lib/calculations";

interface Item {
  id: string;
  label: string;
  value: string;
  unit: string;
  formula?: string;
  derivation?: string;
  computed?: boolean;
}

export function NameplateDashboard() {
  const snap = useMemo(() => motorSnapshot(), []);
  const [active, setActive] = useState<Item | null>(null);

  const nameplate: Item[] = [
    { id: "v",     label: "Rated Voltage",  value: MOTOR.ratedVoltageV.toLocaleString(), unit: "V" },
    { id: "i",     label: "Rated Current",  value: MOTOR.ratedCurrentA.toString(),       unit: "A" },
    { id: "p",     label: "Shaft Power",    value: MOTOR.ratedShaftPowerKW.toLocaleString(), unit: "kW" },
    { id: "n",     label: "Rated Speed",    value: MOTOR.ratedSpeedRpm.toLocaleString(), unit: "rpm" },
    { id: "f",     label: "Frequency",      value: MOTOR.ratedFrequencyHz.toString(),    unit: "Hz" },
    { id: "pf",    label: "Power Factor",   value: MOTOR.powerFactor.toFixed(2),         unit: "cos φ" },
    { id: "eta",   label: "Efficiency",     value: (MOTOR.efficiency * 100).toFixed(2),  unit: "%" },
    { id: "poles", label: "Poles",          value: MOTOR.poles.toString(),               unit: "" },
  ];

  const computed: Item[] = [
    {
      id: "ns", label: "Synchronous Speed", value: snap.synchronousSpeedRpm.toFixed(0), unit: "rpm",
      formula: "Nₛ = 120·f / p",
      derivation: `Nₛ = 120 × ${MOTOR.ratedFrequencyHz} / ${MOTOR.poles} = ${snap.synchronousSpeedRpm.toFixed(0)} rpm`,
      computed: true,
    },
    {
      id: "s", label: "Slip @ rated", value: snap.slipPct.toFixed(2), unit: "%",
      formula: "s = (Nₛ − N) / Nₛ",
      derivation: `s = (${snap.synchronousSpeedRpm.toFixed(0)} − ${MOTOR.ratedSpeedRpm}) / ${snap.synchronousSpeedRpm.toFixed(0)} = ${snap.slipPct.toFixed(2)}%`,
      computed: true,
    },
    {
      id: "vph", label: "Phase Voltage", value: snap.phaseVoltageV.toFixed(0), unit: "V",
      formula: "V_φ = V_LL / √3",
      derivation: `V_φ = ${MOTOR.ratedVoltageV} / √3 = ${snap.phaseVoltageV.toFixed(1)} V`,
      computed: true,
    },
    {
      id: "s_va", label: "Apparent Power", value: snap.apparentPowerKVA.toFixed(0), unit: "kVA",
      formula: "S = √3 · V · I",
      derivation: `S = √3 × ${MOTOR.ratedVoltageV} × ${MOTOR.ratedCurrentA} = ${snap.apparentPowerKVA.toFixed(0)} kVA`,
      computed: true,
    },
    {
      id: "p_in", label: "Input Power", value: snap.inputPowerKW.toFixed(0), unit: "kW",
      formula: "P_in = √3 · V · I · cos φ",
      derivation: `P_in = √3 × ${MOTOR.ratedVoltageV} × ${MOTOR.ratedCurrentA} × ${MOTOR.powerFactor} = ${snap.inputPowerKW.toFixed(1)} kW`,
      computed: true,
    },
    {
      id: "q", label: "Reactive Power", value: snap.reactivePowerKVAR.toFixed(0), unit: "kVAR",
      formula: "Q = √3 · V · I · sin φ",
      derivation: `sin φ = √(1−0.9²) = 0.4359 → Q = √3 × ${MOTOR.ratedVoltageV} × ${MOTOR.ratedCurrentA} × 0.4359 = ${snap.reactivePowerKVAR.toFixed(0)} kVAR`,
      computed: true,
    },
    {
      id: "zb", label: "Base Impedance", value: snap.baseImpedanceOhm.toFixed(2), unit: "Ω",
      formula: "Z_base = V² / S",
      derivation: `Z_base = ${MOTOR.ratedVoltageV}² / ${(snap.apparentPowerKVA * 1000).toFixed(0)} = ${snap.baseImpedanceOhm.toFixed(2)} Ω`,
      computed: true,
    },
    {
      id: "t", label: "Rated Torque", value: snap.ratedTorqueNm.toFixed(0), unit: "N·m",
      formula: "T = P_shaft / ω_m,   ω_m = 2π·N/60",
      derivation: `ω_m = 2π×${MOTOR.ratedSpeedRpm}/60 = ${snap.angularSpeedRadS.toFixed(2)} rad/s → T = ${MOTOR.ratedShaftPowerKW*1000}/${snap.angularSpeedRadS.toFixed(2)} = ${snap.ratedTorqueNm.toFixed(0)} N·m`,
      computed: true,
    },
  ];

  return (
    <Section
      id="nameplate"
      variant="darker"
      eyebrow="Motor Dashboard"
      title={<>Nameplate & <span style={{ color: "#EB1B26" }}>Derived</span> Quantities.</>}
      subtitle={<>ABB <span className="font-mono">AMA 500 L4L BANM</span> (2007). Click any computed value to reveal its formula and step-by-step derivation.</>}
    >
      {/* Nameplate row */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-6 h-[2px] bg-[#EB1B26]/50" />
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40">
            Nameplate (as printed)
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {nameplate.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="bg-[#0D1117] border border-[#1B2026] p-5"
              style={{ borderRadius: "2px" }}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">
                {item.label}
              </div>
              <div className="display-number text-3xl text-white mt-2">
                {item.value}
                {item.unit && (
                  <span className="text-[#EB1B26] text-base ml-1.5">{item.unit}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Computed row */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-6 h-[2px] bg-[#EB1B26]/50" />
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40">
            Derived quantities (click for formula)
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {computed.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              onClick={() => setActive(item)}
              className="bg-[#0D1117] border border-[#1B2026] p-5 text-left group hover:border-[#EB1B26]/50 hover:bg-[#EB1B26]/5 transition-all cursor-pointer"
              style={{ borderRadius: "2px" }}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 group-hover:text-[#EB1B26]/80 transition-colors">
                {item.label}
              </div>
              <div className="display-number text-3xl text-white mt-2">
                {item.value}
                <span className="text-[#EB1B26] text-base ml-1.5">{item.unit}</span>
              </div>
              <div className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#EB1B26]/50 group-hover:text-[#EB1B26]">
                ⓘ Show formula
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D1117] border-2 border-[#EB1B26]/60 max-w-xl w-full p-8"
              style={{ borderRadius: "2px", boxShadow: "0 0 60px rgba(235,27,38,0.25)" }}
            >
              <div className="text-[11px] font-black uppercase tracking-[0.15em] text-[#EB1B26] mb-2">
                {active.label}
              </div>
              <div className="display-number text-5xl text-white mb-6">
                {active.value}
                <span className="text-[#EB1B26] text-2xl ml-2">{active.unit}</span>
              </div>
              <div className="mb-4">
                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white/40 mb-2">Formula</div>
                <code className="block bg-black border border-[#EB1B26]/30 px-4 py-3 font-mono text-[#EB1B26] text-base">
                  {active.formula}
                </code>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white/40 mb-2">Step-by-step</div>
                <code className="block bg-black border border-[#1B2026] px-4 py-3 font-mono text-sm text-white/90 leading-relaxed">
                  {active.derivation}
                </code>
              </div>
              <button
                onClick={() => setActive(null)}
                className="btn-red mt-6 w-full justify-center"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
