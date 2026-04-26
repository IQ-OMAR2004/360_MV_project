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
    id: "gen", label: "Diesel Generator",
    rating: "2 500 kVA, 400 V, 60 Hz, 0.8 PF · Xd″ ≈ 0.18 pu",
    protection: ["G - Stator overcurrent", "32 - Reverse power", "40 - Loss of field", "59 - Overvoltage"],
    notes: "Cummins C2500 D5 — recommended upgrade. Keeps loading ≤ 80% throughout the VFD start sequence. AVR class B, electronic governor.",
    vendor: "Cummins C2500 D5",
  },
  cb_lv: {
    id: "cb_lv", label: "LV Main Breaker",
    rating: "400 V, 4 000 A, 65 kA Icw",
    protection: ["50/51 - Phase OC", "50G/51G - Earth fault", "27 - Undervoltage"],
    notes: "Air circuit breaker (e.g. Schneider MasterPact MTZ3) with electronic trip unit for selectivity with generator and transformer.",
  },
  tx: {
    id: "tx", label: "Step-up Transformer",
    rating: "2 000 kVA, 0.4 / 4 kV, Dyn11, ONAN, %Z = 6%",
    protection: ["63 - Buchholz (gas/oil)", "26 - Oil temperature", "49T - Winding temperature", "87T - Differential (optional)"],
    notes: "Δ-yn11: delta LV side traps zero-sequence; Y HV side gives grounded neutral for protection. ONAN cooling suits workshop duty cycle.",
    vendor: "ABB DTR / Schneider Trihal",
  },
  cb_mv: {
    id: "cb_mv", label: "MV Vacuum Breaker",
    rating: "12 kV, 1250 A, 25 kA / 1 s",
    protection: ["50/51 - Inverse-time OC", "50N/51N - Ground OC", "27 - UV", "59 - OV", "87M - Differential"],
    notes: "VCB inside UniGear/PIX/NXAIR cubicle. Withdrawable truck for safe maintenance. ABB REF615 IED.",
    vendor: "ABB UniGear ZS1 / Schneider PIX-12",
  },
  vfd: {
    id: "vfd", label: "MV VFD (Recommended)",
    rating: "ABB ACS6080 — 2 MVA, 4 kV output",
    protection: ["IGCT desat", "Earth-fault detection", "Output di/dt limiting", "Bypass cabinet"],
    notes: "Active front end → near-unity input PF, low THD. V/f ramp 5→60 Hz over 8 s; current capped at ~1.1×I_n. Variable-speed commissioning.",
    vendor: "ABB ACS6080",
  },
  motor: {
    id: "motor", label: "4 kV Induction Motor",
    rating: "1 551 kW, 4 000 V, 261 A, 1 776 rpm, η = 96.85%",
    protection: ["49M - Thermal", "50/51 - Phase OC", "27 - UV", "46 - Negative-sequence", "37 - Underload"],
    notes: "ABB AMA 500 L4L BANM — the device under test. Protected by MV switchgear IED (REF615).",
    vendor: "ABB AMA 500 L4L BANM",
  },
};

const RED = "#EB1B26";
const DARK = "#0D1117";
const BORDER_DEFAULT = "#262A30";

export function SingleLineDiagram() {
  const [hoverId, setHoverId] = useState<string | null>("vfd");
  const active = hoverId ? COMPONENTS[hoverId] : null;

  const stroke = (id: string) => hoverId === id ? RED : BORDER_DEFAULT;
  const glow = (id: string) => hoverId === id ? "url(#redGlow)" : "";

  return (
    <Section
      id="sld"
      variant="dark"
      eyebrow="Single Line Diagram"
      title={<>The Power Path —<br /><span style={{ color: RED }}>400 V → 4 kV → Motor</span></>}
      subtitle="Hover any component to inspect ratings, protection devices, and design rationale. Animated dashes follow the direction of power flow."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SVG */}
        <div className="lg:col-span-2 bg-[#0D1117] border border-[#1B2026] p-4 lg:p-6" style={{ borderRadius: "2px" }}>
          <svg viewBox="0 0 980 480" className="w-full h-auto" role="img" aria-label="Single line diagram">
            <defs>
              <linearGradient id="busGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={RED} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C41520" stopOpacity="0.9" />
              </linearGradient>
              <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Connecting lines */}
            <line x1="110" y1="122" x2="110" y2="200" stroke="#3A4049" strokeWidth="2" />
            <line x1="110" y1="240" x2="110" y2="320" stroke="#3A4049" strokeWidth="2" />
            <line x1="110" y1="360" x2="200" y2="360" stroke="#3A4049" strokeWidth="2" />
            {/* LV Bus */}
            <line x1="75" y1="200" x2="185" y2="200" stroke="url(#busGrad)" strokeWidth="5" />
            {/* MV Bus */}
            <line x1="200" y1="360" x2="325" y2="360" stroke="url(#busGrad)" strokeWidth="5" />
            <line x1="325" y1="360" x2="325" y2="320" stroke="#3A4049" strokeWidth="2" />
            {/* Animated power flow */}
            <line x1="325" y1="320" x2="325" y2="385" stroke={RED} strokeWidth="2" className="flow-line" />
            <line x1="400" y1="340" x2="558" y2="340" stroke={RED} strokeWidth="2" className="flow-line" />
            <line x1="642" y1="340" x2="804" y2="340" stroke={RED} strokeWidth="2" className="flow-line" />

            {/* Bus labels */}
            <text x="195" y="193" fill="#7A828D" fontSize="10" fontFamily="JetBrains Mono,monospace">400 V LV BUS</text>
            <text x="336" y="396" fill="#7A828D" fontSize="10" fontFamily="JetBrains Mono,monospace">4 kV MV BUS</text>

            {/* GENERATOR */}
            <g onMouseEnter={() => setHoverId("gen")} onFocus={() => setHoverId("gen")} tabIndex={0} className="cursor-pointer outline-none">
              <circle cx="110" cy="90" r="32" fill={DARK} stroke={stroke("gen")} strokeWidth="2" filter={glow("gen")} />
              <text x="110" y="96" textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="900">G</text>
              <text x="110" y="48" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">Diesel Gen</text>
              <text x="110" y="62" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono,monospace">2.5 MVA · 0.4 kV</text>
            </g>

            {/* LV CB */}
            <g onMouseEnter={() => setHoverId("cb_lv")} onFocus={() => setHoverId("cb_lv")} tabIndex={0} className="cursor-pointer outline-none">
              <rect x="98" y="208" width="24" height="24" fill={DARK} stroke={stroke("cb_lv")} strokeWidth="2" filter={glow("cb_lv")} />
              <line x1="105" y1="215" x2="115" y2="225" stroke={hoverId === "cb_lv" ? RED : "#FFF"} strokeWidth="2" />
              <text x="138" y="226" fill="#FFF" fontSize="10">LV CB</text>
            </g>

            {/* TRANSFORMER */}
            <g onMouseEnter={() => setHoverId("tx")} onFocus={() => setHoverId("tx")} tabIndex={0} className="cursor-pointer outline-none">
              <circle cx="110" cy="333" r="15" fill={DARK} stroke={stroke("tx")} strokeWidth="2" filter={glow("tx")} />
              <circle cx="110" cy="357" r="15" fill={DARK} stroke={stroke("tx")} strokeWidth="2" filter={glow("tx")} />
              <polygon points="103,329 117,329 110,338" fill="none" stroke={hoverId === "tx" ? RED : "#FFF"} strokeWidth="1.5" />
              <line x1="110" y1="350" x2="110" y2="358" stroke={hoverId === "tx" ? RED : "#FFF"} strokeWidth="1.5" />
              <line x1="110" y1="358" x2="104" y2="365" stroke={hoverId === "tx" ? RED : "#FFF"} strokeWidth="1.5" />
              <line x1="110" y1="358" x2="116" y2="365" stroke={hoverId === "tx" ? RED : "#FFF"} strokeWidth="1.5" />
              <text x="140" y="340" fill="#FFF" fontSize="10">2 MVA TX</text>
              <text x="140" y="354" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono,monospace">Dyn11 · 6% Z</text>
            </g>

            {/* MV CB */}
            <g onMouseEnter={() => setHoverId("cb_mv")} onFocus={() => setHoverId("cb_mv")} tabIndex={0} className="cursor-pointer outline-none">
              <rect x="348" y="326" width="30" height="30" fill={DARK} stroke={stroke("cb_mv")} strokeWidth="2" filter={glow("cb_mv")} />
              <line x1="355" y1="333" x2="371" y2="349" stroke={hoverId === "cb_mv" ? RED : "#FFF"} strokeWidth="2" />
              <text x="363" y="382" textAnchor="middle" fill="#FFF" fontSize="10">VCB</text>
              <text x="363" y="396" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono,monospace">25 kA</text>
              {/* CT/PT */}
              <circle cx="400" cy="345" r="5" fill="none" stroke={hoverId === "cb_mv" ? RED : "#7A828D"} strokeWidth="1.2" />
              <circle cx="400" cy="333" r="5" fill="none" stroke={hoverId === "cb_mv" ? RED : "#7A828D"} strokeWidth="1.2" />
              <text x="413" y="336" fill="#7A828D" fontSize="8">CT</text>
              <text x="413" y="350" fill="#7A828D" fontSize="8">PT</text>
            </g>

            {/* VFD */}
            <g onMouseEnter={() => setHoverId("vfd")} onFocus={() => setHoverId("vfd")} tabIndex={0} className="cursor-pointer outline-none">
              <rect x="558" y="314" width="84" height="52" rx="0" fill={DARK} stroke={stroke("vfd")} strokeWidth="2" filter={glow("vfd")} />
              <text x="600" y="333" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="900">VFD</text>
              <text x="600" y="349" textAnchor="middle" fill={RED} fontSize="9" fontFamily="JetBrains Mono,monospace">f, V → motor</text>
              <text x="600" y="385" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono,monospace">ACS6080</text>
            </g>

            {/* MOTOR */}
            <g onMouseEnter={() => setHoverId("motor")} onFocus={() => setHoverId("motor")} tabIndex={0} className="cursor-pointer outline-none">
              <circle cx="840" cy="340" r="36" fill={DARK} stroke={stroke("motor")} strokeWidth="2" filter={glow("motor")} />
              <text x="840" y="347" textAnchor="middle" fill="#FFF" fontSize="24" fontWeight="900">M</text>
              <text x="840" y="298" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">Induction Motor</text>
              <text x="840" y="312" textAnchor="middle" fill="#7A828D" fontSize="9" fontFamily="JetBrains Mono,monospace">1.55 MW · 4 kV</text>
            </g>

            {/* Earthing */}
            <g stroke="#7A828D" strokeWidth="1.2" fill="none">
              <line x1="110" y1="372" x2="110" y2="392" />
              <line x1="100" y1="392" x2="120" y2="392" />
              <line x1="103" y1="397" x2="117" y2="397" />
              <line x1="106" y1="402" x2="114" y2="402" />
              <text x="124" y="400" fill="#7A828D" fontSize="8" stroke="none">Y_g</text>
            </g>
          </svg>
        </div>

        {/* Inspector */}
        <motion.aside
          key={active?.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22 }}
          className="bg-[#0D1117] border border-[#1B2026] p-6 lg:p-7 lg:sticky lg:top-24 self-start"
          style={{ borderRadius: "2px" }}
        >
          {active ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="block w-4 h-[2px] bg-[#EB1B26]" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#EB1B26]">Inspector</span>
              </div>
              <h3 className="font-display font-black text-2xl text-white mb-1">{active.label}</h3>
              {active.vendor && <p className="text-sm text-white/50 mb-4">{active.vendor}</p>}
              <div className="bg-black border border-[#EB1B26]/30 px-3 py-2.5 mb-5">
                <code className="text-[#EB1B26] text-[11px] font-mono leading-snug">{active.rating}</code>
              </div>
              <div className="mb-5">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40 mb-2">Protection</div>
                <ul className="space-y-1.5">
                  {active.protection.map((p) => (
                    <li key={p} className="text-sm text-white/70 flex items-start gap-2 font-mono">
                      <span className="text-[#EB1B26] mt-0.5">▶</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40 mb-2">Design note</div>
                <p className="text-sm text-white/65 leading-relaxed">{active.notes}</p>
              </div>
            </>
          ) : (
            <p className="text-white/40 text-sm">Hover a component on the diagram to inspect.</p>
          )}
        </motion.aside>
      </div>

      {/* ANSI legend */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {[["27","Undervoltage"],["49","Thermal overload"],["50/51","Phase OC"],["59","Overvoltage"],["87M","Motor differential"],["46","Neg-sequence"],["63","Buchholz/pressure"],["32","Reverse power"]].map(([n, name]) => (
          <div key={n} className="flex items-center gap-3 bg-[#0D1117] border border-[#1B2026] px-3 py-2" style={{ borderRadius: "2px" }}>
            <span className="display-number text-[#EB1B26] text-sm font-bold">{n}</span>
            <span className="text-white/60">{name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
