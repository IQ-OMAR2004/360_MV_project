"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Section } from "./ui/Section";

interface Component {
  id: string;
  label: string;
  rating: string;
  protection: string[];
  notes: string;
  vendor?: string;
}

const COMPONENTS: Record<string, Component> = {
  gen: {
    id: "gen",
    label: "Diesel Generator",
    rating: "2 500 kVA, 400 V, 60 Hz, 0.8 PF · Xd″ ≈ 0.18 pu",
    protection: ["G - Stator overcurrent", "32 - Reverse power", "40 - Loss of field", "59 - Overvoltage"],
    notes:
      "Recommended sizing for the VFD scheme. The existing 1 MVA unit cannot ride DOL or soft-start; an upgraded 2.5 MVA Cummins C2500 D5 keeps loading ≤ 80% during commissioning.",
    vendor: "Cummins C2500 D5",
  },
  cb_lv: {
    id: "cb_lv",
    label: "LV Main Breaker",
    rating: "400 V, 4 000 A, 65 kA Icw",
    protection: ["50/51 - Phase OC", "50G/51G - Earth fault", "27 - Undervoltage"],
    notes: "Air circuit breaker (e.g. Schneider MasterPact MTZ3) with electronic trip unit for selectivity with the generator and transformer.",
  },
  tx: {
    id: "tx",
    label: "Step-up Transformer",
    rating: "2 000 kVA, 0.4 / 4 kV, Dyn11, ONAN, %Z = 6%",
    protection: [
      "63 - Buchholz (gas/oil)",
      "26 - Oil temperature",
      "49T - Winding temperature",
      "87T - Differential (optional)",
    ],
    notes:
      "Δ-yn11 vector group: delta side traps zero-sequence currents from the LV side; the wye HV side gives a grounded neutral suitable for protection. ONAN cooling chosen for the workshop's modest duty cycle.",
    vendor: "ABB DTR / Schneider Trihal",
  },
  cb_mv: {
    id: "cb_mv",
    label: "MV Vacuum Breaker",
    rating: "12 kV, 1250 A, 25 kA / 1 s",
    protection: ["50/51 - Inverse-time OC", "50N/51N - Ground OC", "27 - UV", "59 - OV", "87M - Differential"],
    notes: "VCB inside a UniGear/PIX/NXAIR cubicle. Withdrawable truck for safe maintenance.",
    vendor: "ABB UniGear ZS1 / Schneider PIX-12",
  },
  vfd: {
    id: "vfd",
    label: "MV VFD (recommended)",
    rating: "ABB ACS6080 — 2 MVA, 4 kV output",
    protection: ["IGCT desat", "Earth-fault detection", "Output di/dt limiting", "Bypass cabinet"],
    notes:
      "Active front end → near-unity input PF, low THD. Output frequency ramped 5 → 60 Hz over 8 s; current capped at ≈ 1.1 × I_n. Doubles as commissioning tool: variable-speed no-load test.",
    vendor: "ABB ACS6080",
  },
  motor: {
    id: "motor",
    label: "4 kV Induction Motor",
    rating: "1 551 kW, 4 000 V, 261 A, 1 776 rpm, η = 96.85%",
    protection: ["49M - Thermal", "50/51 - Phase OC", "27 - UV", "46 - Negative-sequence", "37 - Underload"],
    notes: "ABB AMA 500 L4L BANM. The device under test — protected by the MV switchgear's IED (e.g. ABB REF615).",
    vendor: "ABB AMA 500 L4L BANM",
  },
};

type GeometryNode = {
  id: keyof typeof COMPONENTS;
  x: number;
  y: number;
  symbol: "gen" | "cb" | "tx" | "vfd" | "motor";
};

const NODES: GeometryNode[] = [
  { id: "gen", x: 110, y: 90, symbol: "gen" },
  { id: "cb_lv", x: 110, y: 220, symbol: "cb" },
  { id: "tx", x: 110, y: 340, symbol: "tx" },
  { id: "cb_mv", x: 360, y: 340, symbol: "cb" },
  { id: "vfd", x: 600, y: 340, symbol: "vfd" },
  { id: "motor", x: 840, y: 340, symbol: "motor" },
];

export function SingleLineDiagram() {
  const [hoverId, setHoverId] = useState<string | null>("vfd");
  const active = hoverId ? COMPONENTS[hoverId] : null;

  return (
    <Section
      id="sld"
      eyebrow="Single Line Diagram"
      title={
        <>
          The Power Path —<br />
          <span className="text-electric glow-text">400 V → 4 kV → Motor</span>
        </>
      }
      subtitle="Hover any component to inspect ratings, protection devices, and design rationale. Animated dashes follow the direction of power flow."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-static p-6 lg:p-8">
          <svg viewBox="0 0 980 480" className="w-full h-auto" role="img" aria-label="Single line diagram">
            <defs>
              <linearGradient id="busGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E0FF" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00B47C" stopOpacity="0.7" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Buses & connecting lines */}
            <line x1="110" y1="120" x2="110" y2="200" stroke="#3A4049" strokeWidth="2" />
            <line x1="110" y1="240" x2="110" y2="320" stroke="#3A4049" strokeWidth="2" />
            <line x1="110" y1="360" x2="200" y2="360" stroke="#3A4049" strokeWidth="2" />
            {/* Bus bar (LV) */}
            <line x1="80" y1="200" x2="180" y2="200" stroke="url(#busGrad)" strokeWidth="4" />
            {/* Bus bar (MV) */}
            <line x1="200" y1="360" x2="320" y2="360" stroke="url(#busGrad)" strokeWidth="4" />
            <line x1="320" y1="360" x2="320" y2="320" stroke="#3A4049" strokeWidth="2" />
            {/* MV main run */}
            <line
              x1="320" y1="320" x2="320" y2="380"
              stroke="#00E0FF"
              strokeWidth="2"
              className="flow-line"
            />
            <line
              x1="400" y1="340" x2="560" y2="340"
              stroke="#00E0FF"
              strokeWidth="2"
              className="flow-line"
            />
            <line
              x1="640" y1="340" x2="800" y2="340"
              stroke="#00E0FF"
              strokeWidth="2"
              className="flow-line"
            />

            {/* Voltage labels */}
            <text x="190" y="195" fill="#7A828D" fontSize="10" fontFamily="JetBrains Mono">
              400 V LV BUS
            </text>
            <text x="335" y="392" fill="#7A828D" fontSize="10" fontFamily="JetBrains Mono">
              4 kV MV BUS
            </text>

            {/* GENERATOR */}
            <g
              onMouseEnter={() => setHoverId("gen")}
              onFocus={() => setHoverId("gen")}
              tabIndex={0}
              className="cursor-pointer outline-none"
            >
              <circle
                cx="110" cy="90" r="32"
                fill="#161A1F"
                stroke={hoverId === "gen" ? "#00E0FF" : "#3A4049"}
                strokeWidth="2"
                filter={hoverId === "gen" ? "url(#glow)" : ""}
              />
              <text x="110" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="700">G</text>
              <text x="110" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">Diesel Gen</text>
              <text x="110" y="62" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono">2.5 MVA · 0.4 kV</text>
            </g>

            {/* LV CB */}
            <g
              onMouseEnter={() => setHoverId("cb_lv")}
              onFocus={() => setHoverId("cb_lv")}
              tabIndex={0}
              className="cursor-pointer outline-none"
            >
              <rect
                x="98" y="208" width="24" height="24"
                fill="#161A1F"
                stroke={hoverId === "cb_lv" ? "#00E0FF" : "#3A4049"}
                strokeWidth="2"
                filter={hoverId === "cb_lv" ? "url(#glow)" : ""}
              />
              <line x1="105" y1="215" x2="115" y2="225" stroke={hoverId === "cb_lv" ? "#00E0FF" : "#FFFFFF"} strokeWidth="2" />
              <text x="135" y="226" fill="#FFFFFF" fontSize="10">LV CB</text>
            </g>

            {/* TRANSFORMER */}
            <g
              onMouseEnter={() => setHoverId("tx")}
              onFocus={() => setHoverId("tx")}
              tabIndex={0}
              className="cursor-pointer outline-none"
            >
              <circle
                cx="110" cy="333" r="14"
                fill="#161A1F"
                stroke={hoverId === "tx" ? "#00E0FF" : "#3A4049"}
                strokeWidth="2"
                filter={hoverId === "tx" ? "url(#glow)" : ""}
              />
              <circle
                cx="110" cy="357" r="14"
                fill="#161A1F"
                stroke={hoverId === "tx" ? "#00E0FF" : "#3A4049"}
                strokeWidth="2"
                filter={hoverId === "tx" ? "url(#glow)" : ""}
              />
              {/* Δ on LV (delta sym) */}
              <polygon
                points="103,329 117,329 110,338"
                fill="none"
                stroke={hoverId === "tx" ? "#00E0FF" : "#FFFFFF"}
                strokeWidth="1.4"
              />
              {/* Y on HV */}
              <line x1="110" y1="350" x2="110" y2="358" stroke={hoverId === "tx" ? "#00E0FF" : "#FFFFFF"} strokeWidth="1.4" />
              <line x1="110" y1="358" x2="105" y2="364" stroke={hoverId === "tx" ? "#00E0FF" : "#FFFFFF"} strokeWidth="1.4" />
              <line x1="110" y1="358" x2="115" y2="364" stroke={hoverId === "tx" ? "#00E0FF" : "#FFFFFF"} strokeWidth="1.4" />
              <text x="138" y="340" fill="#FFFFFF" fontSize="10">2 MVA</text>
              <text x="138" y="354" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono">Dyn11 · 6% Z</text>
            </g>

            {/* MV CB */}
            <g
              onMouseEnter={() => setHoverId("cb_mv")}
              onFocus={() => setHoverId("cb_mv")}
              tabIndex={0}
              className="cursor-pointer outline-none"
            >
              <rect
                x="348" y="328" width="28" height="28"
                fill="#161A1F"
                stroke={hoverId === "cb_mv" ? "#00E0FF" : "#3A4049"}
                strokeWidth="2"
                filter={hoverId === "cb_mv" ? "url(#glow)" : ""}
              />
              <line x1="355" y1="335" x2="370" y2="350" stroke={hoverId === "cb_mv" ? "#00E0FF" : "#FFFFFF"} strokeWidth="2" />
              <text x="362" y="382" textAnchor="middle" fill="#FFFFFF" fontSize="10">VCB</text>
              <text x="362" y="395" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono">25 kA</text>
            </g>

            {/* CT/PT cluster around MV CB */}
            <circle cx="395" cy="345" r="5" fill="none" stroke={hoverId === "cb_mv" ? "#00E0FF" : "#7A828D"} strokeWidth="1.2" />
            <circle cx="395" cy="335" r="5" fill="none" stroke={hoverId === "cb_mv" ? "#00E0FF" : "#7A828D"} strokeWidth="1.2" />
            <text x="408" y="335" fill="#7A828D" fontSize="8">CT</text>
            <text x="408" y="349" fill="#7A828D" fontSize="8">PT</text>

            {/* VFD */}
            <g
              onMouseEnter={() => setHoverId("vfd")}
              onFocus={() => setHoverId("vfd")}
              tabIndex={0}
              className="cursor-pointer outline-none"
            >
              <rect
                x="560" y="316" width="80" height="48"
                rx="6"
                fill="#161A1F"
                stroke={hoverId === "vfd" ? "#00E0FF" : "#3A4049"}
                strokeWidth="2"
                filter={hoverId === "vfd" ? "url(#glow)" : ""}
              />
              <text x="600" y="335" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">VFD</text>
              <text x="600" y="350" textAnchor="middle" fill="#00E0FF" fontSize="9" fontFamily="JetBrains Mono">f, V → motor</text>
              <text x="600" y="383" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono">ACS6080</text>
            </g>

            {/* MOTOR */}
            <g
              onMouseEnter={() => setHoverId("motor")}
              onFocus={() => setHoverId("motor")}
              tabIndex={0}
              className="cursor-pointer outline-none"
            >
              <circle
                cx="840" cy="340" r="36"
                fill="#161A1F"
                stroke={hoverId === "motor" ? "#00E0FF" : "#3A4049"}
                strokeWidth="2"
                filter={hoverId === "motor" ? "url(#glow)" : ""}
              />
              <text x="840" y="346" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="700">M</text>
              <text x="840" y="298" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">Induction Motor</text>
              <text x="840" y="312" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono">1.55 MW · 4 kV</text>
            </g>

            {/* Earthing */}
            <g stroke="#7A828D" strokeWidth="1.2" fill="none">
              <line x1="110" y1="357" x2="110" y2="378" />
              <line x1="100" y1="378" x2="120" y2="378" />
              <line x1="103" y1="382" x2="117" y2="382" />
              <line x1="106" y1="386" x2="114" y2="386" />
              <text x="125" y="384" fill="#7A828D" fontSize="8" stroke="none">Y_g</text>
            </g>
          </svg>
        </div>

        {/* Inspector */}
        <motion.aside
          key={active?.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="card-static p-6 lg:p-8 lg:sticky lg:top-24 self-start"
        >
          {active ? (
            <>
              <div className="text-xs uppercase tracking-widest text-electric mb-2">
                Inspector
              </div>
              <h3 className="font-display text-2xl text-white mb-1">{active.label}</h3>
              {active.vendor && (
                <p className="text-sm text-text-secondary mb-4">{active.vendor}</p>
              )}
              <div className="display-number text-electric text-sm bg-ink-900 border border-ink-600 rounded-lg px-3 py-2 mb-5">
                {active.rating}
              </div>
              <div className="mb-5">
                <div className="text-[11px] uppercase tracking-widest text-text-tertiary mb-2">
                  Protection
                </div>
                <ul className="space-y-1.5">
                  {active.protection.map((p) => (
                    <li
                      key={p}
                      className="text-sm text-text-secondary flex items-start gap-2 font-mono"
                    >
                      <span className="text-spark-orange mt-0.5">▶</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-text-tertiary mb-2">
                  Notes
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{active.notes}</p>
              </div>
            </>
          ) : (
            <div className="text-text-tertiary text-sm">
              Hover a component to inspect.
            </div>
          )}
        </motion.aside>
      </div>

      {/* ANSI device legend */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {[
          ["27", "Undervoltage"],
          ["49", "Thermal overload"],
          ["50/51", "Phase OC (inst./inv.)"],
          ["59", "Overvoltage"],
          ["87M", "Motor differential"],
          ["46", "Negative-sequence"],
          ["63", "Buchholz / pressure"],
          ["32", "Reverse power"],
        ].map(([n, name]) => (
          <div key={n} className="flex items-center gap-3 bg-ink-900 border border-ink-600 rounded-lg px-3 py-2">
            <span className="display-number text-electric text-sm">{n}</span>
            <span className="text-text-secondary">{name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
