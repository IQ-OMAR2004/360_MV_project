"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParameters } from "@/store/parameters";
import { snapshot } from "@/lib/engineering";

type Status = "ok" | "warn" | "bad";

interface ComponentInfo {
  id: "gen" | "cb_lv" | "tx" | "cb_mv" | "starter" | "motor" | "cable_lv" | "cable_mv";
  label: string;
  status: Status;
  loadingPct: number;
  rating: string;
  voltageV: number;
  currentA: number;
  protection?: string[];
  notes?: string;
}

const STATUS_COLOR: Record<Status, string> = {
  ok: "#4BA181",
  warn: "#FFB347",
  bad: "#EB1B26",
};

function pct2status(p: number, warn = 80, bad = 100): Status {
  if (p >= bad) return "bad";
  if (p >= warn) return "warn";
  return "ok";
}

export function InteractiveSLD() {
  const all = useParameters();
  const snap = useMemo(
    () => snapshot({
      motor: all.motor, generator: all.generator, transformer: all.transformer,
      starter: all.starter, cable: all.cable,
    }),
    [all.motor, all.generator, all.transformer, all.starter, all.cable],
  );

  // Build component models from live snapshot.
  const components = useMemo<Record<ComponentInfo["id"], ComponentInfo>>(() => {
    const txLoading = snap.tx_loading_pct;
    const genLoading = snap.gen_loading_start_pct;
    const motorLoading = (snap.start.motorCurrentA / all.motor.ratedCurrentA) * 100;

    return {
      gen: {
        id: "gen",
        label: "Diesel Generator",
        status: pct2status(genLoading, 90, 120),
        loadingPct: genLoading,
        rating: `${all.generator.ratedKVA} kVA, ${all.generator.ratedVoltageV} V, X_d″ ${all.generator.subtransientReactancePu.toFixed(2)} pu`,
        voltageV: all.generator.ratedVoltageV * (1 - snap.V_gen_dip_pct/100),
        currentA: snap.start.lineCurrentLVa,
        protection: ["32 reverse power", "40 loss-of-field", "59 overvoltage", "27 undervoltage"],
        notes: snap.pass.genDipOK
          ? `Genset within AVR band (dip ${snap.V_gen_dip_pct.toFixed(1)}% ≤ ${all.generator.allowableDipPct}%).`
          : `⚠ Dip ${snap.V_gen_dip_pct.toFixed(1)}% exceeds allowable ${all.generator.allowableDipPct}%.`,
      },
      cb_lv: {
        id: "cb_lv",
        label: "LV Main Breaker",
        status: pct2status(genLoading, 90, 110),
        loadingPct: genLoading,
        rating: `${all.transformer.primaryVoltageV} V, ACB rated for genset full output`,
        voltageV: all.generator.ratedVoltageV * (1 - snap.V_gen_dip_pct/100),
        currentA: snap.start.lineCurrentLVa,
        protection: ["50/51 phase OC", "50G/51G ground", "27 UV"],
      },
      cable_lv: {
        id: "cable_lv",
        label: "LV Cable",
        status: "ok",
        loadingPct: 0,
        rating: `${all.cable.lvLengthM} m, ${all.cable.lvImpedanceMOhmPerM} mΩ/m`,
        voltageV: all.transformer.primaryVoltageV,
        currentA: snap.start.lineCurrentLVa,
      },
      tx: {
        id: "tx",
        label: "Step-up Transformer",
        status: pct2status(txLoading, 100, 130),
        loadingPct: txLoading,
        rating: `${all.transformer.ratedKVA} kVA, ${all.transformer.primaryVoltageV/1000}/${all.transformer.secondaryVoltageV/1000} kV, ${all.transformer.vectorGroup}, ${all.transformer.impedancePct}% Z, ${all.transformer.cooling}`,
        voltageV: all.transformer.secondaryVoltageV * (1 - snap.V_mv_dip_pct/100),
        currentA: snap.start.lineCurrentMVa,
        protection: ["63 Buchholz", "26 oil temp", "49T winding temp", "87T differential"],
      },
      cb_mv: {
        id: "cb_mv",
        label: "MV Vacuum Breaker",
        status: snap.pass.iscBelowSwgrOK ? "ok" : "bad",
        loadingPct: txLoading,
        rating: `12 kV, 1250 A, ${snap.Isc_kA.toFixed(1)} kA seen vs. 25 kA panel rating`,
        voltageV: all.transformer.secondaryVoltageV * (1 - snap.V_mv_dip_pct/100),
        currentA: snap.start.lineCurrentMVa,
        protection: ["50/51 phase", "50N/51N earth", "27 UV", "59 OV", "87M motor diff"],
      },
      cable_mv: {
        id: "cable_mv",
        label: "MV Cable",
        status: "ok",
        loadingPct: 0,
        rating: `${all.cable.mvLengthM} m`,
        voltageV: all.transformer.secondaryVoltageV * (1 - snap.V_mv_dip_pct/100),
        currentA: snap.start.lineCurrentMVa,
      },
      starter: {
        id: "starter",
        label: all.starter.method === "DOL" ? "Direct contactor"
             : all.starter.method === "Autotransformer" ? "Autotransformer starter"
             : all.starter.method === "SoftStarter" ? "MV Soft Starter"
             : "MV VFD",
        status: pct2status(motorLoading, 250, 450),
        loadingPct: motorLoading,
        rating: all.starter.method === "VFD" ? "ACS6080 — current cap " + (all.starter.vfdMaxCurrentPu*100).toFixed(0) + "% I_n"
              : all.starter.method === "SoftStarter" ? `Initial V ${(all.starter.softInitialVPu*100).toFixed(0)}%, ramp ${all.starter.softRampSeconds}s`
              : all.starter.method === "Autotransformer" ? `Tap ${(all.starter.autoTap*100).toFixed(0)}%`
              : "No reduction",
        voltageV: all.transformer.secondaryVoltageV * snap.start.motorVoltagePu,
        currentA: snap.start.motorCurrentA,
      },
      motor: {
        id: "motor",
        label: "Induction Motor",
        status: pct2status(motorLoading, 250, 450),
        loadingPct: motorLoading,
        rating: `${all.motor.ratedPowerKW} kW, ${all.motor.ratedVoltageV} V, ${all.motor.ratedCurrentA} A, ${all.motor.ratedSpeedRpm} rpm`,
        voltageV: all.motor.ratedVoltageV * snap.start.motorVoltagePu,
        currentA: snap.start.motorCurrentA,
        protection: ["49M thermal", "50/51 phase OC", "27 UV", "46 neg-seq", "37 underload"],
      },
    };
  }, [all, snap]);

  const [hover, setHover] = useState<ComponentInfo["id"]>("starter");
  const active = components[hover];

  const flashing = active.status === "bad";

  // SVG helper
  const renderNode = (id: ComponentInfo["id"], cx: number, cy: number, draw: (color: string) => React.ReactNode) => {
    const c = components[id];
    const color = STATUS_COLOR[c.status];
    const isHover = hover === id;
    const wantFlash = c.status === "bad";
    return (
      <g
        onMouseEnter={() => setHover(id)}
        onFocus={() => setHover(id)}
        tabIndex={0}
        className="cursor-pointer outline-none"
        style={{ filter: isHover ? "drop-shadow(0 0 6px rgba(235,27,38,0.8))" : undefined }}
      >
        <motion.g
          animate={wantFlash ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={wantFlash ? { duration: 0.6, repeat: Infinity } : { duration: 0 }}
        >
          {draw(color)}
        </motion.g>
        <text x={cx} y={cy} fill="#3A4049" fontSize="8" fontFamily="JetBrains Mono,monospace" textAnchor="middle">
          {c.loadingPct.toFixed(0)}%
        </text>
      </g>
    );
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-[2px] bg-[#EB1B26]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">
            Live Single Line Diagram
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLOR.ok }} />OK</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLOR.warn }} />Warn</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLOR.bad }} />Overload</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        {/* SVG */}
        <div className="bg-[#0D1117] border border-[#1B2026] p-4" style={{ borderRadius: "2px" }}>
          <svg viewBox="0 0 980 360" className="w-full h-auto">
            <defs>
              <linearGradient id="busGradSLD" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EB1B26" />
                <stop offset="100%" stopColor="#C41520" />
              </linearGradient>
            </defs>

            {/* Connecting wires */}
            <line x1="100" y1="115" x2="100" y2="155" stroke="#3A4049" strokeWidth="2" />
            <line x1="100" y1="175" x2="100" y2="205" stroke="#3A4049" strokeWidth="2" />
            <line x1="100" y1="245" x2="100" y2="270" stroke="#3A4049" strokeWidth="2" />
            <line x1="100" y1="280" x2="200" y2="280" stroke="#3A4049" strokeWidth="2" />
            {/* LV bus */}
            <line x1="60" y1="190" x2="160" y2="190" stroke="url(#busGradSLD)" strokeWidth="4" />
            <text x="170" y="186" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono,monospace">LV BUS</text>
            {/* MV bus */}
            <line x1="240" y1="280" x2="360" y2="280" stroke="url(#busGradSLD)" strokeWidth="4" />
            <text x="370" y="277" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono,monospace">MV BUS</text>
            <line x1="360" y1="280" x2="360" y2="245" stroke="#3A4049" strokeWidth="2" />
            {/* Animated power flow */}
            <line x1="360" y1="245" x2="360" y2="305" stroke={flashing ? STATUS_COLOR.bad : "#EB1B26"} strokeWidth="2" className="flow-line" />
            <line x1="430" y1="265" x2="540" y2="265" stroke={flashing ? STATUS_COLOR.bad : "#EB1B26"} strokeWidth="2" className="flow-line" />
            <line x1="630" y1="265" x2="780" y2="265" stroke={flashing ? STATUS_COLOR.bad : "#EB1B26"} strokeWidth="2" className="flow-line" />

            {/* GEN */}
            {renderNode("gen", 100, 100, (color) => (
              <>
                <circle cx="100" cy="80" r="28" fill="#0D1117" stroke={color} strokeWidth="2.5" />
                <text x="100" y="86" textAnchor="middle" fill="#FFF" fontSize="20" fontWeight="900">G</text>
                <text x="100" y="44" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">Diesel Gen</text>
              </>
            ))}

            {/* LV CB */}
            {renderNode("cb_lv", 130, 175, (color) => (
              <>
                <rect x="88" y="158" width="24" height="22" fill="#0D1117" stroke={color} strokeWidth="2" />
                <line x1="94" y1="164" x2="106" y2="174" stroke={color} strokeWidth="1.8" />
              </>
            ))}

            {/* TX */}
            {renderNode("tx", 130, 245, (color) => (
              <>
                <circle cx="100" cy="218" r="13" fill="#0D1117" stroke={color} strokeWidth="2" />
                <circle cx="100" cy="240" r="13" fill="#0D1117" stroke={color} strokeWidth="2" />
                <text x="125" y="222" fill="#FFF" fontSize="9">TX</text>
                <text x="125" y="234" fill={color} fontSize="8" fontFamily="JetBrains Mono,monospace">{all.transformer.ratedKVA}kVA</text>
                <text x="125" y="244" fill="#7A828D" fontSize="8" fontFamily="JetBrains Mono,monospace">{all.transformer.impedancePct}%Z</text>
              </>
            ))}

            {/* MV CB */}
            {renderNode("cb_mv", 290, 295, (color) => (
              <>
                <rect x="278" y="266" width="26" height="26" fill="#0D1117" stroke={color} strokeWidth="2" />
                <line x1="284" y1="272" x2="298" y2="288" stroke={color} strokeWidth="1.8" />
                <text x="291" y="312" textAnchor="middle" fill="#FFF" fontSize="9">VCB</text>
              </>
            ))}

            {/* Starter */}
            {renderNode("starter", 590, 295, (color) => (
              <>
                <rect x="540" y="240" width="90" height="50" fill="#0D1117" stroke={color} strokeWidth="2" />
                <text x="585" y="262" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="900">{all.starter.method === "VFD" ? "VFD" : all.starter.method === "SoftStarter" ? "SS" : all.starter.method === "Autotransformer" ? "AT" : "DOL"}</text>
                <text x="585" y="278" textAnchor="middle" fill={color} fontSize="8" fontFamily="JetBrains Mono,monospace">
                  {all.starter.method === "VFD" ? `${(all.starter.vfdMaxCurrentPu*100).toFixed(0)}% cap` :
                   all.starter.method === "SoftStarter" ? `${(all.starter.softInitialVPu*100).toFixed(0)}% V` :
                   all.starter.method === "Autotransformer" ? `tap ${(all.starter.autoTap*100).toFixed(0)}%` :
                   "no reduction"}
                </text>
              </>
            ))}

            {/* MOTOR */}
            {renderNode("motor", 830, 295, (color) => (
              <>
                <circle cx="830" cy="265" r="32" fill="#0D1117" stroke={color} strokeWidth="2.5" />
                <text x="830" y="272" textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="900">M</text>
                <text x="830" y="225" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">Induction</text>
                <text x="830" y="237" textAnchor="middle" fill="#7A828D" fontSize="8" fontFamily="JetBrains Mono,monospace">{(all.motor.ratedPowerKW/1000).toFixed(2)} MW</text>
              </>
            ))}

            {/* Earthing */}
            <g stroke="#7A828D" strokeWidth="1.2" fill="none">
              <line x1="100" y1="253" x2="100" y2="270" />
              <line x1="91" y1="270" x2="109" y2="270" />
              <line x1="94" y1="274" x2="106" y2="274" />
              <line x1="97" y1="278" x2="103" y2="278" />
            </g>
          </svg>
        </div>

        {/* Inspector */}
        <motion.aside
          key={active.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18 }}
          className="bg-[#0D1117] border-2 p-5"
          style={{
            borderRadius: "2px",
            borderColor: STATUS_COLOR[active.status],
            boxShadow: active.status === "bad" ? "0 0 30px rgba(235,27,38,0.30)" : undefined,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="block w-4 h-[2px] bg-[#EB1B26]" />
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#EB1B26]">Inspector</span>
            </div>
            <span
              className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border"
              style={{
                color: STATUS_COLOR[active.status],
                borderColor: STATUS_COLOR[active.status] + "80",
                backgroundColor: STATUS_COLOR[active.status] + "1F",
                borderRadius: "1px",
              }}
            >
              {active.status === "ok" ? "Within rating" : active.status === "warn" ? "High loading" : "Overload"}
            </span>
          </div>
          <h4 className="font-display font-black text-lg text-white mb-1">{active.label}</h4>
          <div className="bg-black border border-[#EB1B26]/30 px-3 py-2 mb-4">
            <code className="text-[#EB1B26] text-[11px] font-mono leading-snug">{active.rating}</code>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-black border border-[#1B2026] p-2">
              <div className="text-[8px] font-black uppercase text-white/35 tracking-widest">Loading</div>
              <div className="display-number text-white text-base">{active.loadingPct.toFixed(0)}<span className="text-[10px] text-[#EB1B26] ml-0.5">%</span></div>
            </div>
            <div className="bg-black border border-[#1B2026] p-2">
              <div className="text-[8px] font-black uppercase text-white/35 tracking-widest">V</div>
              <div className="display-number text-white text-base">{Math.round(active.voltageV)}<span className="text-[10px] text-[#EB1B26] ml-0.5">V</span></div>
            </div>
            <div className="bg-black border border-[#1B2026] p-2">
              <div className="text-[8px] font-black uppercase text-white/35 tracking-widest">I</div>
              <div className="display-number text-white text-base">{Math.round(active.currentA)}<span className="text-[10px] text-[#EB1B26] ml-0.5">A</span></div>
            </div>
          </div>
          {active.protection && (
            <div className="mb-3">
              <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5">Protection</div>
              <ul className="space-y-1">
                {active.protection.map((p) => (
                  <li key={p} className="text-xs text-white/65 font-mono flex gap-2">
                    <span className="text-[#EB1B26]">▶</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {active.notes && (
            <div className="text-xs text-white/60 leading-relaxed border-t border-[#1B2026] pt-3 mt-3">
              {active.notes}
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}
