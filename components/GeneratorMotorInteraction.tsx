"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { Section } from "./ui/Section";
import { TRANSFORMER } from "@/lib/motor";

// Synthesised waveforms — illustrative of the physics, not a full transient solver.
function dipWaveform(method: "DOL" | "Soft Starter" | "VFD") {
  const params = {
    DOL: { dipMax: 0.45, recoveryTau: 1.6 },
    "Soft Starter": { dipMax: 0.18, recoveryTau: 4.0 },
    VFD: { dipMax: 0.05, recoveryTau: 8.0 },
  }[method];
  const N = 200;
  return Array.from({ length: N }, (_, i) => {
    const t = (i / N) * 8;
    let v: number;
    if (t < 0.05) v = 1;
    else {
      const dip = params.dipMax * Math.exp(-Math.max(0, t - 0.05) / params.recoveryTau);
      v = 1 - dip;
    }
    return { t, v };
  });
}

function inrushWaveform() {
  // Asymmetric magnetising inrush: half-sine envelope decaying with τ.
  const tau = TRANSFORMER.inrushDecayTau;
  const peak = TRANSFORMER.inrushMultiplier; // pu of rated
  const f = 60;
  const N = 600;
  return Array.from({ length: N }, (_, i) => {
    const t = (i / N) * 1.0; // s
    const envelope = peak * Math.exp(-t / tau);
    const v = envelope * (1 + Math.sin(2 * Math.PI * f * t - Math.PI / 2)) / 2;
    return { t: t * 1000, i: v };
  });
}

const dipVfd = dipWaveform("VFD");
const dipSs = dipWaveform("Soft Starter");
const dipDol = dipWaveform("DOL");
const merged = dipDol.map((row, i) => ({
  t: row.t,
  DOL: row.v,
  "Soft Starter": dipSs[i].v,
  VFD: dipVfd[i].v,
}));

const inrush = inrushWaveform();

export function GeneratorMotorInteraction() {
  return (
    <Section
      id="interaction"
      eyebrow="Generator–Motor Interaction"
      title={
        <>
          Two Machines.<br />
          <span className="text-electric glow-text">One Bus.</span>
        </>
      }
      subtitle="The diesel generator does not see the motor in isolation. Voltage dip, transformer inrush, and AVR ride-through together decide whether the genset survives the start."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator voltage dip */}
        <div className="card-static p-6 lg:p-7">
          <h3 className="font-display text-xl text-white mb-2">Generator terminal voltage dip</h3>
          <p className="text-sm text-text-secondary mb-4">
            Dip magnitude scales with the motor's pu starting kVA over the generator's available
            kVA, multiplied by Xd″. The VFD stays inside the AVR's ±10% band.
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={merged} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#262A30" strokeDasharray="2 4" />
                <XAxis dataKey="t" stroke="#7A828D" tickFormatter={(v) => `${(+v).toFixed(0)}s`} fontSize={11} />
                <YAxis stroke="#7A828D" domain={[0.5, 1.05]} tickFormatter={(v) => (+v).toFixed(2)} fontSize={11} width={50} />
                <ReferenceLine y={0.9} stroke="#FFB347" strokeDasharray="4 4" label={{ value: "AVR band 0.9", fill: "#FFB347", fontSize: 10, position: "right" }} />
                <ReferenceLine y={0.7} stroke="#FF7A00" strokeDasharray="4 4" label={{ value: "Trip risk 0.7", fill: "#FF7A00", fontSize: 10, position: "right" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #262A30",
                    borderRadius: 8,
                    fontFamily: "JetBrains Mono",
                  }}
                  labelFormatter={(v) => `t = ${(+v).toFixed(2)} s`}
                />
                <Line type="monotone" dataKey="DOL" stroke="#FF7A00" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Soft Starter" stroke="#FFB347" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="VFD" stroke="#00E0FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {(["DOL", "Soft Starter", "VFD"] as const).map((m) => (
              <span key={m} className="inline-flex items-center gap-2 text-text-secondary">
                <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: m === "DOL" ? "#FF7A00" : m === "Soft Starter" ? "#FFB347" : "#00E0FF" }} />
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Transformer inrush */}
        <div className="card-static p-6 lg:p-7">
          <h3 className="font-display text-xl text-white mb-2">Step-up transformer inrush</h3>
          <p className="text-sm text-text-secondary mb-4">
            Magnetising inrush is independent of the motor; it depends on residual flux at energising
            instant. Peak ≈ 8 × I_rated, decaying with τ ≈ 150 ms.
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inrush} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="inrushGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#262A30" strokeDasharray="2 4" />
                <XAxis dataKey="t" stroke="#7A828D" tickFormatter={(v) => `${(+v).toFixed(0)}ms`} fontSize={11} />
                <YAxis stroke="#7A828D" domain={[0, 9]} fontSize={11} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid #262A30",
                    borderRadius: 8,
                    fontFamily: "JetBrains Mono",
                  }}
                  labelFormatter={(v) => `t = ${(+v).toFixed(0)} ms`}
                  formatter={(v: number) => [`${v.toFixed(2)} pu`, "I_inrush"]}
                />
                <Area type="monotone" dataKey="i" stroke="#FF7A00" fill="url(#inrushGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AVR ride-through assessment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 card-static p-6 lg:p-8 border-l-4 border-electric"
        >
          <div className="text-xs uppercase tracking-widest text-electric mb-3">
            AVR Ride-through Assessment
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-sm leading-relaxed">
            <div>
              <div className="font-display text-xl text-white mb-2">DOL → ❌</div>
              <p className="text-text-secondary">
                Genset terminal voltage collapses below 60% within 50 ms. AVR commands full field
                forcing, but governor can't recover before LV undervoltage trip (27) drops the breaker.
                Engine may stall.
              </p>
            </div>
            <div>
              <div className="font-display text-xl text-white mb-2">Soft Start → ⚠️</div>
              <p className="text-text-secondary">
                Voltage stays above 80% with the 50% initial-tap soft starter, but ramp lasts 12 s —
                long enough that engine governor has to add a sustained ~1 800 kW step. Only acceptable
                with a 2.5+ MVA genset.
              </p>
            </div>
            <div>
              <div className="font-display text-xl text-white mb-2">VFD → ✅</div>
              <p className="text-text-secondary">
                Drive ramps current at 1.10 × I_n, regardless of motor speed. Genset sees a clean
                resistive-like load build over 8 s. Voltage stays inside ±5%, frequency ±0.3 Hz —
                trivial for any modern AVR/governor pair.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
