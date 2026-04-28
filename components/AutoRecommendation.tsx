"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParameters } from "@/store/parameters";
import { snapshot, recommend, estimateCAPEX } from "@/lib/engineering";
import { recommendedDrive } from "@/lib/vendors";

const BADGE_COLOR = {
  Acceptable: "#4BA181",
  Marginal: "#FFB347",
  "Not Acceptable": "#EB1B26",
} as const;

export function AutoRecommendation() {
  const all = useParameters();
  const params = useMemo(() => ({
    motor: all.motor, generator: all.generator, transformer: all.transformer,
    starter: all.starter, cable: all.cable,
  }), [all.motor, all.generator, all.transformer, all.starter, all.cable]);

  const snap = useMemo(() => snapshot(params), [params]);
  const rec = useMemo(() => recommend(params, snap), [params, snap]);
  const capex = useMemo(() => estimateCAPEX(params), [params]);

  // Build CAPEX side-by-side for current vs. preferred (only when they differ).
  const altParams = useMemo(() =>
    rec.preferred === all.starter.method ? null
    : { ...params, starter: { ...params.starter, method: rec.preferred } },
    [params, rec, all.starter.method]);
  const altCapex = useMemo(() => altParams ? estimateCAPEX(altParams) : null, [altParams]);

  const drive = recommendedDrive(rec.preferred);
  const badgeColor = BADGE_COLOR[rec.badge];

  return (
    <div className="bg-[#0D1117] border-2 p-5 lg:p-6"
      style={{ borderRadius: "2px", borderColor: badgeColor + "80" }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-[2px] bg-[#EB1B26]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">
            Auto-generated Recommendation
          </h3>
        </div>
        <span
          className="px-3 py-1 text-xs font-black uppercase tracking-[0.15em] border"
          style={{
            color: badgeColor, backgroundColor: badgeColor + "1F",
            borderColor: badgeColor + "80", borderRadius: "1px",
          }}
        >
          {rec.badge}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${rec.preferred}-${rec.badge}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <h2 className="font-display font-black text-white leading-[1.05]" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
            Use{" "}
            <span style={{ color: "#EB1B26", textShadow: "0 0 22px rgba(235,27,38,0.4)" }}>
              {rec.preferred}
            </span>{" "}
            with{" "}
            <span className="text-white/80 font-mono text-[0.6em]">{drive.vendor} {drive.model}</span>
          </h2>

          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            {rec.rationale}
          </p>

          {rec.flagged.length > 0 && (
            <div className="mt-4 bg-[#EB1B26]/10 border border-[#EB1B26]/40 p-3" style={{ borderRadius: "1px" }}>
              <div className="text-[9px] font-black uppercase tracking-widest text-[#EB1B26] mb-2">⚠ Constraints currently failing</div>
              <ul className="space-y-1">
                {rec.flagged.map((f) => (
                  <li key={f} className="text-xs text-white/75 flex gap-2">
                    <span className="text-[#EB1B26]">✗</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CAPEX panel */}
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <div className="bg-black border border-[#1B2026] p-4" style={{ borderRadius: "1px" }}>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">CAPEX — current selection ({all.starter.method})</div>
              <div className="display-number text-2xl text-white">${Math.round(capex.totalKUSD)} k</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-white/45 mt-2 font-mono">
                <span>TX</span><span className="text-right">${Math.round(capex.transformerKUSD)} k</span>
                <span>SWGR</span><span className="text-right">${Math.round(capex.switchgearKUSD)} k</span>
                <span>Starter</span><span className="text-right">${Math.round(capex.starterKUSD)} k</span>
                <span>Genset Δ</span><span className="text-right">${Math.round(capex.gensetUpgradeKUSD)} k</span>
                <span>Civil</span><span className="text-right">${Math.round(capex.civilKUSD)} k</span>
              </div>
            </div>
            {altCapex && (
              <div className="bg-black border border-[#4BA181]/40 p-4" style={{ borderRadius: "1px" }}>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#4BA181] mb-1">CAPEX — recommended ({rec.preferred})</div>
                <div className="display-number text-2xl text-white">${Math.round(altCapex.totalKUSD)} k</div>
                <div className="text-[10px] text-white/45 mt-2 font-mono">
                  Δ vs. current: <span className={altCapex.totalKUSD > capex.totalKUSD ? "text-[#FFB347]" : "text-[#4BA181]"}>
                    {altCapex.totalKUSD > capex.totalKUSD ? "+" : ""}{Math.round(altCapex.totalKUSD - capex.totalKUSD)} k
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Drive highlights */}
          <div className="mt-5 border-t border-[#1B2026] pt-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Recommended drive — {drive.vendor} {drive.model}</div>
            <ul className="space-y-1">
              {drive.highlights.map((h) => (
                <li key={h} className="text-sm text-white/65 flex gap-2">
                  <span className="text-[#EB1B26] mt-0.5">▸</span>{h}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
