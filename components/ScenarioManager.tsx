"use client";

import { useState } from "react";
import { useParameters } from "@/store/parameters";

export function ScenarioManager() {
  const scenarios = useParameters((s) => s.scenarios);
  const save = useParameters((s) => s.saveScenario);
  const load = useParameters((s) => s.loadScenario);
  const del = useParameters((s) => s.deleteScenario);
  const cmpSel = useParameters((s) => s.comparisonSelection);
  const setCmp = useParameters((s) => s.setComparison);

  const starter = useParameters((s) => s.starter.method);
  const [name, setName] = useState("");

  return (
    <div className="bg-[#0D1117] border border-[#1B2026] p-5" style={{ borderRadius: "2px" }}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-[2px] bg-[#EB1B26]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">Scenarios</h3>
        </div>
        <span className="text-[10px] text-white/40 font-mono">{scenarios.length} saved</span>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`e.g. "${starter} stress test"`}
          className="flex-1 bg-black border border-[#1B2026] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#EB1B26]/60 outline-none"
          style={{ borderRadius: "1px" }}
        />
        <button
          onClick={() => {
            if (!name.trim()) return;
            save(name.trim());
            setName("");
          }}
          disabled={!name.trim()}
          className="btn-red text-[10px] disabled:opacity-50"
        >
          💾 Save
        </button>
      </div>

      {scenarios.length === 0 ? (
        <p className="text-xs text-white/40 italic">
          Save the current parameter set to compare alternative scenarios side-by-side.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {scenarios.map((sc) => (
            <li key={sc.id} className="flex items-center gap-2 bg-black border border-[#1B2026] px-3 py-2" style={{ borderRadius: "1px" }}>
              <button
                onClick={() => load(sc.id)}
                className="flex-1 text-left"
                title="Load this scenario into the live parameters"
              >
                <div className="text-sm text-white font-medium leading-tight">{sc.name}</div>
                <div className="text-[10px] text-white/40 font-mono">
                  {new Date(sc.createdAt).toLocaleTimeString()} · {sc.params.starter.method} · {sc.params.generator.ratedKVA} kVA gen · {sc.params.transformer.ratedKVA} kVA TX
                </div>
              </button>
              {/* Compare slot toggles */}
              <button
                onClick={() => setCmp(0, cmpSel[0] === sc.id ? null : sc.id)}
                title="Compare slot A"
                className={`px-2 py-1 text-[9px] font-black uppercase border transition ${
                  cmpSel[0] === sc.id
                    ? "bg-[#EB1B26] text-white border-[#EB1B26]"
                    : "bg-transparent text-white/45 border-[#1B2026] hover:text-white"
                }`}
                style={{ borderRadius: "1px" }}
              >A</button>
              <button
                onClick={() => setCmp(1, cmpSel[1] === sc.id ? null : sc.id)}
                title="Compare slot B"
                className={`px-2 py-1 text-[9px] font-black uppercase border transition ${
                  cmpSel[1] === sc.id
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/45 border-[#1B2026] hover:text-white"
                }`}
                style={{ borderRadius: "1px" }}
              >B</button>
              <button
                onClick={() => del(sc.id)}
                title="Delete"
                className="px-2 py-1 text-[10px] text-white/40 hover:text-[#EB1B26]"
              >✕</button>
            </li>
          ))}
        </ul>
      )}

      {(cmpSel[0] || cmpSel[1]) && (
        <div className="mt-4 pt-3 border-t border-[#1B2026]">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
            Active comparison: A vs. B
          </div>
          <CompareTable />
        </div>
      )}
    </div>
  );
}

/* ── Side-by-side compare table ────────────────────────────────────────── */

import { snapshot } from "@/lib/engineering";

function CompareTable() {
  const scenarios = useParameters((s) => s.scenarios);
  const [a, b] = useParameters((s) => s.comparisonSelection);
  const A = scenarios.find((s) => s.id === a);
  const B = scenarios.find((s) => s.id === b);

  const snapA = A ? snapshot(A.params) : null;
  const snapB = B ? snapshot(B.params) : null;

  const row = (label: string, va: string, vb: string) => (
    <tr className="border-b border-[#1B2026] last:border-0">
      <td className="py-1.5 text-[10px] uppercase tracking-widest text-white/45 font-black">{label}</td>
      <td className="py-1.5 text-right display-number text-[#EB1B26]">{va}</td>
      <td className="py-1.5 text-right display-number text-white">{vb}</td>
    </tr>
  );

  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-[#1B2026]">
          <th className="text-left py-1 text-[9px] uppercase text-white/30">Metric</th>
          <th className="text-right py-1 text-[9px] uppercase text-[#EB1B26]/80">A · {A?.name ?? "—"}</th>
          <th className="text-right py-1 text-[9px] uppercase text-white/80">B · {B?.name ?? "—"}</th>
        </tr>
      </thead>
      <tbody>
        {row("Method", snapA?.start.method ?? "—", snapB?.start.method ?? "—")}
        {row("Start I (MV)", snapA ? `${snapA.start.lineCurrentMVa.toFixed(0)} A` : "—", snapB ? `${snapB.start.lineCurrentMVa.toFixed(0)} A` : "—")}
        {row("Gen dip", snapA ? `${snapA.V_gen_dip_pct.toFixed(1)}%` : "—", snapB ? `${snapB.V_gen_dip_pct.toFixed(1)}%` : "—")}
        {row("Gen loading start", snapA ? `${snapA.gen_loading_start_pct.toFixed(0)}%` : "—", snapB ? `${snapB.gen_loading_start_pct.toFixed(0)}%` : "—")}
        {row("TX loading", snapA ? `${snapA.tx_loading_pct.toFixed(0)}%` : "—", snapB ? `${snapB.tx_loading_pct.toFixed(0)}%` : "—")}
        {row("Isc MV", snapA ? `${snapA.Isc_kA.toFixed(2)} kA` : "—", snapB ? `${snapB.Isc_kA.toFixed(2)} kA` : "—")}
      </tbody>
    </table>
  );
}
