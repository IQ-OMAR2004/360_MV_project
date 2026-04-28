"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useParameters } from "@/store/parameters";
import { snapshot } from "@/lib/engineering";

interface CardProps {
  label: string;
  value: string;
  unit?: string;
  status?: "ok" | "warn" | "bad" | "neutral";
  hint?: string;
  formula?: string;
}

function Card({ label, value, unit, status = "neutral", hint, formula }: CardProps) {
  const colors = {
    ok:      { ring: "border-[#4BA181]/40", chip: "text-[#4BA181] bg-[#4BA181]/15 border-[#4BA181]/40", val: "text-white",     icon: "✓" },
    warn:    { ring: "border-[#FFB347]/50", chip: "text-[#FFB347] bg-[#FFB347]/15 border-[#FFB347]/40", val: "text-[#FFB347]", icon: "!" },
    bad:     { ring: "border-[#EB1B26]/60", chip: "text-[#EB1B26] bg-[#EB1B26]/15 border-[#EB1B26]/40", val: "text-[#EB1B26]", icon: "✗" },
    neutral: { ring: "border-[#1B2026]",    chip: "text-[#EB1B26] bg-[#EB1B26]/10 border-[#EB1B26]/30", val: "text-white",     icon: "•" },
  }[status];

  return (
    <div
      className={`bg-[#0D1117] border ${colors.ring} p-4 transition-colors`}
      style={{ borderRadius: "2px" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45 leading-tight">{label}</div>
        {status !== "neutral" && (
          <span className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-black border ${colors.chip}`} style={{ borderRadius: "50%" }}>
            {colors.icon}
          </span>
        )}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0.5, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className={`display-number text-2xl mt-1.5 leading-none ${colors.val}`}
      >
        {value}
        {unit && <span className="text-[#EB1B26] text-xs ml-1.5">{unit}</span>}
      </motion.div>
      {(hint || formula) && (
        <div className="mt-1.5 text-[9.5px] text-white/35 leading-tight font-mono">
          {formula ?? hint}
        </div>
      )}
    </div>
  );
}

export function KPICards() {
  const all = useParameters();
  const snap = useMemo(
    () => snapshot({
      motor: all.motor,
      generator: all.generator,
      transformer: all.transformer,
      starter: all.starter,
      cable: all.cable,
    }),
    [all.motor, all.generator, all.transformer, all.starter, all.cable],
  );

  const fmt = (n: number, d = 0) => {
    if (!isFinite(n)) return "—";
    return n.toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  };

  const ratedI_status = "neutral" as const;

  // Pull pass/fail from snapshot.pass
  const pass = snap.pass;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-[2px] bg-[#EB1B26]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">
            Live Key Performance Indicators
          </h3>
        </div>
        <div className="text-[10px] text-white/40 font-mono">
          method: <span className="text-[#EB1B26]">{snap.start.method}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {/* base */}
        <Card label="Rated current I_base" value={fmt(snap.Ibase_A)} unit="A" status={ratedI_status} formula="I_base = S/(√3·V)" />
        <Card label="Base impedance Z_base" value={fmt(snap.Zbase_ohm, 2)} unit="Ω" formula="Z_base = V²/S" />
        <Card label="Synchronous speed" value={fmt(snap.Ns_rpm)} unit="rpm" formula="Nₛ = 120·f/p" />
        <Card label="Slip @ rated" value={fmt(snap.slip_pct, 2)} unit="%" formula="s = (Nₛ−N)/Nₛ" />
        <Card label="Apparent power" value={fmt(snap.S_kVA)} unit="kVA" formula="S = √3·V·I" />

        {/* current */}
        <Card label="DOL inrush" value={fmt(snap.Idol_A)} unit="A" formula="k · I_n" />
        <Card label="Selected method I" value={fmt(snap.start.lineCurrentMVa)} unit="A"
          status={snap.start.lineCurrentMVa > 4*snap.Ibase_A ? "bad" : snap.start.lineCurrentMVa > 2*snap.Ibase_A ? "warn" : "ok"}
          hint={`= ${(snap.start.lineCurrentMVa/snap.Ibase_A).toFixed(2)}× I_n`} />
        <Card label="Generator-side I" value={fmt(snap.start.lineCurrentLVa)} unit="A" formula="I_HV · n_TX" />

        {/* dips */}
        <Card label="Generator V dip" value={fmt(snap.V_gen_dip_pct, 1)} unit="%"
          status={pass.genDipOK ? "ok" : "bad"}
          formula="ΔV ≈ X_d″·I_pu/(1+X_d″·I_pu)"
        />
        <Card label="MV bus V dip" value={fmt(snap.V_mv_dip_pct, 1)} unit="%"
          status={snap.V_mv_dip_pct < 5 ? "ok" : snap.V_mv_dip_pct < 10 ? "warn" : "bad"}
          formula="TX %Z + cable drop"
        />

        {/* loadings */}
        <Card label="TX loading @ start" value={fmt(snap.tx_loading_pct)} unit="%"
          status={pass.txLoadingOK ? "ok" : "bad"} hint="threshold 130%" />
        <Card label="Gen loading @ start" value={fmt(snap.gen_loading_start_pct)} unit="%"
          status={pass.genLoadingStartOK ? "ok" : "bad"} hint="threshold 130%" />
        <Card label="Gen loading @ run" value={fmt(snap.gen_loading_run_pct)} unit="%"
          status={pass.genLoadingRunOK ? "ok" : snap.gen_loading_run_pct < 100 ? "warn" : "bad"} hint="threshold 90%" />
        <Card label="MV bus I_sc" value={fmt(snap.Isc_kA, 2)} unit="kA"
          status={pass.iscBelowSwgrOK ? "ok" : "bad"} hint="≤ 25 kA swgr" />
        <Card label="Short-circuit MVA" value={fmt(snap.Ssc_MVA, 1)} unit="MVA"
          formula="√3·V·I_sc" />
      </div>
    </div>
  );
}
