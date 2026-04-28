"use client";

import { useState } from "react";
import { useParameters } from "@/store/parameters";
import { Slider, Select, Toggles } from "./ui/Slider";

type Tab = "motor" | "gen" | "tx" | "starter" | "cable";

export function ParameterPanel() {
  const [tab, setTab] = useState<Tab>("starter");
  const motor = useParameters((s) => s.motor);
  const gen = useParameters((s) => s.generator);
  const tx = useParameters((s) => s.transformer);
  const starter = useParameters((s) => s.starter);
  const cable = useParameters((s) => s.cable);

  const setMotor = useParameters((s) => s.setMotor);
  const setGenerator = useParameters((s) => s.setGenerator);
  const setTransformer = useParameters((s) => s.setTransformer);
  const setStarter = useParameters((s) => s.setStarter);
  const setCable = useParameters((s) => s.setCable);
  const reset = useParameters((s) => s.resetDefaults);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "starter", label: "Starter", icon: "▶" },
    { id: "motor",   label: "Motor",   icon: "M" },
    { id: "gen",     label: "Genset",  icon: "G" },
    { id: "tx",      label: "TX",      icon: "⚡" },
    { id: "cable",   label: "Cables",  icon: "—" },
  ];

  return (
    <aside className="bg-[#0D1117] border border-[#1B2026] sticky top-[88px] flex flex-col max-h-[calc(100vh-110px)]" style={{ borderRadius: "2px" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b-2 border-[#EB1B26]/40 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">Parameters</div>
          <div className="text-xs text-white/50 mt-0.5">Live · every change recomputes everything</div>
        </div>
        <button
          onClick={reset}
          title="Reset to nameplate defaults"
          className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest border border-[#1B2026] text-white/60 hover:border-[#EB1B26]/40 hover:text-[#EB1B26] transition-colors"
          style={{ borderRadius: "1px" }}
        >
          ⏮ Reset
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-5 border-b border-[#1B2026]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-1 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] border-r last:border-r-0 border-[#1B2026] transition-colors ${
              tab === t.id
                ? "bg-[#EB1B26]/10 text-[#EB1B26]"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="block text-base mb-0.5 font-mono">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="overflow-y-auto p-5 space-y-5 flex-1">
        {tab === "starter" && (
          <>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55 mb-2">Method</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(["DOL","Autotransformer","SoftStarter","VFD"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setStarter({ method: m })}
                    className={`px-2 py-2 text-[10px] font-black uppercase tracking-widest border transition ${
                      starter.method === m
                        ? "bg-[#EB1B26] text-white border-[#EB1B26] shadow-[0_0_18px_rgba(235,27,38,0.45)]"
                        : "bg-black text-white/50 border-[#1B2026] hover:border-[#EB1B26]/40"
                    }`}
                    style={{ borderRadius: "1px" }}
                  >
                    {m === "SoftStarter" ? "Soft Start" : m}
                  </button>
                ))}
              </div>
            </div>

            {starter.method === "Autotransformer" && (
              <Toggles label="Autotransformer tap"
                value={starter.autoTap}
                options={[{value:0.5,label:"50%"},{value:0.65,label:"65%"},{value:0.8,label:"80%"}]}
                onChange={(v) => setStarter({ autoTap: v })}
              />
            )}

            {starter.method === "SoftStarter" && (
              <>
                <Slider label="Initial voltage" value={starter.softInitialVPu*100}
                  min={30} max={75} unit="% V_n" decimals={0}
                  formula="V_init / V_n  (thyristor ramp start)"
                  onChange={(v) => setStarter({ softInitialVPu: v/100 })} />
                <Slider label="Ramp duration" value={starter.softRampSeconds}
                  min={5} max={30} unit="s"
                  onChange={(v) => setStarter({ softRampSeconds: v })} />
                <Slider label="Current limit" value={starter.softCurrentLimitPu}
                  min={2} max={5} step={0.1} unit="× I_n" decimals={1}
                  formula="I_motor capped at this · I_n"
                  onChange={(v) => setStarter({ softCurrentLimitPu: v })} />
              </>
            )}

            {starter.method === "VFD" && (
              <>
                <Slider label="V/f ramp time" value={starter.vfdRampSeconds}
                  min={3} max={30} unit="s"
                  formula="time to ramp 0 → 60 Hz (V/f constant)"
                  onChange={(v) => setStarter({ vfdRampSeconds: v })} />
                <Slider label="Max current" value={starter.vfdMaxCurrentPu*100}
                  min={100} max={150} unit="% I_n" decimals={0}
                  formula="drive current limiter"
                  onChange={(v) => setStarter({ vfdMaxCurrentPu: v/100 })} />
                <Toggles label="V/f profile"
                  value={starter.vfdVoverFprofile}
                  options={[{value:"linear",label:"Linear"},{value:"quadratic",label:"Quadratic"}]}
                  onChange={(v) => setStarter({ vfdVoverFprofile: v })}
                />
              </>
            )}

            {starter.method === "DOL" && (
              <p className="text-xs text-white/45 leading-relaxed border border-[#EB1B26]/30 bg-[#EB1B26]/5 p-3" style={{ borderRadius: "1px" }}>
                <strong className="text-[#EB1B26]">DOL has no parameters</strong> — that's the point.
                Inrush is whatever the motor produces (set by the motor's <code>I_start/I_n</code> slider).
              </p>
            )}
          </>
        )}

        {tab === "motor" && (
          <>
            <Slider label="Rated voltage" value={motor.ratedVoltageV}
              min={3000} max={5000} step={50} unit="V"
              formula="V_LL — line-line"
              onChange={(v) => setMotor({ ratedVoltageV: v })} />
            <Slider label="Rated power" value={motor.ratedPowerKW}
              min={500} max={3000} step={10} unit="kW"
              formula="P_shaft — mechanical shaft power"
              onChange={(v) => setMotor({ ratedPowerKW: v })} />
            <Slider label="Rated current" value={motor.ratedCurrentA}
              min={50} max={500} step={1} unit="A"
              formula="I_n — full-load line current"
              onChange={(v) => setMotor({ ratedCurrentA: v })} />
            <Slider label="Power factor" value={motor.powerFactor}
              min={0.7} max={1.0} step={0.01} decimals={2} unit="cos φ"
              onChange={(v) => setMotor({ powerFactor: v })} />
            <Slider label="Efficiency" value={motor.efficiency*100}
              min={85} max={99} step={0.05} decimals={2} unit="%"
              onChange={(v) => setMotor({ efficiency: v/100 })} />
            <Slider label="Rated speed" value={motor.ratedSpeedRpm}
              min={1400} max={1800} step={1} unit="rpm"
              formula="N — rated mechanical speed"
              onChange={(v) => setMotor({ ratedSpeedRpm: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Toggles label="Frequency"
                value={motor.frequencyHz}
                options={[{value:50,label:"50 Hz"},{value:60,label:"60 Hz"}]}
                onChange={(v) => setMotor({ frequencyHz: v as 50 | 60 })}
              />
              <Select label="Poles" value={motor.poles}
                options={[{value:2,label:"2"},{value:4,label:"4"},{value:6,label:"6"}]}
                onChange={(v) => setMotor({ poles: v as 2 | 4 | 6 })}
              />
            </div>

            <div className="border-t border-[#1B2026] pt-4 mt-4 space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#EB1B26]/80">Starting characteristics</div>
              <Slider label="DOL inrush multiplier" value={motor.startCurrentMultiplier}
                min={4} max={8} step={0.1} unit="× I_n" decimals={1}
                formula="I_start_DOL = k · I_n"
                onChange={(v) => setMotor({ startCurrentMultiplier: v })} />
              <Slider label="Locked-rotor torque" value={motor.lockedRotorTorquePu}
                min={0.5} max={2.0} step={0.05} unit="× T_n" decimals={2}
                formula="T_LR / T_n"
                onChange={(v) => setMotor({ lockedRotorTorquePu: v })} />
              <Slider label="Inertia J" value={motor.inertiaKgM2}
                min={10} max={200} step={1} unit="kg·m²"
                onChange={(v) => setMotor({ inertiaKgM2: v })} />
            </div>

            <div className="border-t border-[#1B2026] pt-4 mt-4 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-[#EB1B26]/80">d-q parameters (per-unit)</div>
              <Slider label="Stator R_s" value={motor.RsPu}
                min={0.005} max={0.05} step={0.001} decimals={3} unit="pu"
                onChange={(v) => setMotor({ RsPu: v })} />
              <Slider label="Stator X_s" value={motor.XsPu}
                min={0.05} max={0.20} step={0.005} decimals={3} unit="pu"
                onChange={(v) => setMotor({ XsPu: v })} />
              <Slider label="Rotor R_r'" value={motor.RrPu}
                min={0.005} max={0.05} step={0.001} decimals={3} unit="pu"
                onChange={(v) => setMotor({ RrPu: v })} />
              <Slider label="Rotor X_r'" value={motor.XrPu}
                min={0.05} max={0.20} step={0.005} decimals={3} unit="pu"
                onChange={(v) => setMotor({ XrPu: v })} />
              <Slider label="Magnetising X_m" value={motor.XmPu}
                min={1.5} max={5.0} step={0.05} decimals={2} unit="pu"
                onChange={(v) => setMotor({ XmPu: v })} />
            </div>
          </>
        )}

        {tab === "gen" && (
          <>
            <Slider label="Rated voltage" value={gen.ratedVoltageV}
              min={380} max={480} step={5} unit="V"
              onChange={(v) => setGenerator({ ratedVoltageV: v })} />
            <Slider label="Rated kVA" value={gen.ratedKVA}
              min={500} max={5000} step={50} unit="kVA"
              formula="S_gen — apparent power rating"
              onChange={(v) => setGenerator({ ratedKVA: v })} />
            <Slider label="Subtransient X_d″" value={gen.subtransientReactancePu}
              min={0.10} max={0.30} step={0.005} decimals={3} unit="pu"
              formula="ΔV_pu ≈ X_d″ · I_pu"
              onChange={(v) => setGenerator({ subtransientReactancePu: v })} />
            <Slider label="AVR response time" value={gen.avrResponseMs}
              min={50} max={500} step={10} unit="ms"
              onChange={(v) => setGenerator({ avrResponseMs: v })} />
            <Slider label="Allowable dip" value={gen.allowableDipPct}
              min={5} max={25} step={1} unit="%"
              formula="acceptance threshold per IEC 60034"
              onChange={(v) => setGenerator({ allowableDipPct: v })} />
          </>
        )}

        {tab === "tx" && (
          <>
            <Slider label="Primary V (LV)" value={tx.primaryVoltageV}
              min={380} max={480} step={5} unit="V"
              onChange={(v) => setTransformer({ primaryVoltageV: v })} />
            <Slider label="Secondary V (MV)" value={tx.secondaryVoltageV}
              min={3000} max={5000} step={50} unit="V"
              onChange={(v) => setTransformer({ secondaryVoltageV: v })} />
            <Slider label="Rated kVA" value={tx.ratedKVA}
              min={1000} max={5000} step={50} unit="kVA"
              onChange={(v) => setTransformer({ ratedKVA: v })} />
            <Slider label="Impedance %Z" value={tx.impedancePct}
              min={4} max={10} step={0.1} decimals={1} unit="%"
              formula="Z_pu — voltage drop scales with this"
              onChange={(v) => setTransformer({ impedancePct: v })} />
            <Select label="Vector group" value={tx.vectorGroup}
              options={[{value:"Dyn11",label:"Dyn11"},{value:"YNd11",label:"YNd11"},{value:"Dd0",label:"Dd0"}]}
              onChange={(v) => setTransformer({ vectorGroup: v as typeof tx.vectorGroup })}
            />
            <Select label="Cooling class" value={tx.cooling}
              options={[{value:"ONAN",label:"ONAN"},{value:"ONAF",label:"ONAF"},{value:"KNAN",label:"KNAN"}]}
              onChange={(v) => setTransformer({ cooling: v as typeof tx.cooling })}
            />
            <Slider label="Inrush multiplier" value={tx.inrushMultiplier}
              min={6} max={10} step={0.1} decimals={1} unit="× I_n"
              formula="magnetising inrush peak"
              onChange={(v) => setTransformer({ inrushMultiplier: v })} />
          </>
        )}

        {tab === "cable" && (
          <>
            <Slider label="LV cable length" value={cable.lvLengthM}
              min={5} max={200} step={1} unit="m"
              onChange={(v) => setCable({ lvLengthM: v })} />
            <Slider label="MV cable length" value={cable.mvLengthM}
              min={5} max={200} step={1} unit="m"
              onChange={(v) => setCable({ mvLengthM: v })} />
            <Slider label="LV cable Z" value={cable.lvImpedanceMOhmPerM}
              min={0.05} max={1.0} step={0.01} decimals={2} unit="mΩ/m"
              onChange={(v) => setCable({ lvImpedanceMOhmPerM: v })} />
            <Slider label="MV cable Z" value={cable.mvImpedanceMOhmPerM}
              min={0.05} max={1.0} step={0.01} decimals={2} unit="mΩ/m"
              onChange={(v) => setCable({ mvImpedanceMOhmPerM: v })} />
          </>
        )}
      </div>
    </aside>
  );
}
