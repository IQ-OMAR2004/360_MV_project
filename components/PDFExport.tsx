"use client";

import { useState } from "react";
import { useParameters } from "@/store/parameters";
import { snapshot, recommend, estimateCAPEX } from "@/lib/engineering";

/**
 * Snapshot-style PDF report. Uses jsPDF directly (no html2canvas) to produce
 * a clean, vector-text PDF that summarizes the current scenario.
 *
 * Why not html2canvas? It rasterises (large file, blurry) and adds 1+ MB.
 * jsPDF text mode gives a crisp 1–2 page report under 50 KB.
 */
export function PDFExport() {
  const all = useParameters();
  const [busy, setBusy] = useState(false);

  const onExport = async () => {
    setBusy(true);
    try {
      // Lazy import — keeps the bundle small on first paint.
      const { jsPDF } = await import("jspdf");

      const params = {
        motor: all.motor, generator: all.generator, transformer: all.transformer,
        starter: all.starter, cable: all.cable,
      };
      const snap = snapshot(params);
      const rec = recommend(params, snap);
      const capex = estimateCAPEX(params);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const M = 36;
      let y = M;

      const RED: [number,number,number] = [235, 27, 38];
      const BLACK: [number,number,number] = [0, 0, 0];
      const GREY: [number,number,number] = [100, 100, 100];

      // Header
      doc.setFillColor(...RED);
      doc.rect(0, 0, W, 4, "F");
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...BLACK);
      doc.text("EE360 — Term 252", M, y); y += 22;
      doc.setFontSize(13);
      doc.setTextColor(...RED);
      doc.text("MV Test Power System Design — Scenario Snapshot", M, y); y += 8;
      doc.setTextColor(...GREY);
      doc.setFontSize(9);
      doc.text(new Date().toLocaleString(), M, y + 8); y += 24;

      // Section: Recommendation
      const banner = (label: string, color: [number,number,number]) => {
        doc.setFillColor(...color);
        doc.rect(M, y, W - 2*M, 16, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(label.toUpperCase(), M + 6, y + 11);
        y += 22;
      };

      banner("Recommendation", RED);
      doc.setTextColor(...BLACK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Use ${rec.preferred} — ${rec.badge}`, M, y); y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...GREY);
      const lines = doc.splitTextToSize(rec.rationale, W - 2*M);
      doc.text(lines, M, y); y += lines.length * 12 + 4;

      if (rec.flagged.length) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...RED);
        doc.text("Failing constraints:", M, y); y += 12;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BLACK);
        rec.flagged.forEach((f) => {
          const ll = doc.splitTextToSize(`• ${f}`, W - 2*M);
          doc.text(ll, M, y); y += ll.length * 11;
        });
        y += 4;
      }

      // Section: Parameters
      banner("Parameters", BLACK);
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...BLACK);

      const kv = (k: string, v: string) => {
        doc.text(k, M, y);
        doc.text(v, M + 200, y);
        y += 11;
      };

      kv("Motor", `${all.motor.ratedPowerKW} kW · ${all.motor.ratedVoltageV} V · ${all.motor.ratedCurrentA} A · ${all.motor.ratedSpeedRpm} rpm · ${all.motor.frequencyHz} Hz · ${all.motor.poles}-pole`);
      kv("Inrush / LR torque", `${all.motor.startCurrentMultiplier.toFixed(1)}× I_n · ${all.motor.lockedRotorTorquePu.toFixed(2)} T_n`);
      kv("Generator", `${all.generator.ratedKVA} kVA · ${all.generator.ratedVoltageV} V · X_d″ ${all.generator.subtransientReactancePu.toFixed(2)} pu · AVR ${all.generator.avrResponseMs} ms · allowable dip ${all.generator.allowableDipPct}%`);
      kv("Transformer", `${all.transformer.ratedKVA} kVA · ${all.transformer.primaryVoltageV}/${all.transformer.secondaryVoltageV} V · ${all.transformer.vectorGroup} · ${all.transformer.impedancePct}% Z · ${all.transformer.cooling}`);
      kv("Starter", `${all.starter.method}` + (
        all.starter.method === "Autotransformer" ? ` · tap ${(all.starter.autoTap*100).toFixed(0)}%` :
        all.starter.method === "SoftStarter"    ? ` · V_init ${(all.starter.softInitialVPu*100).toFixed(0)}% · ramp ${all.starter.softRampSeconds}s · cap ${all.starter.softCurrentLimitPu.toFixed(1)}× I_n` :
        all.starter.method === "VFD"            ? ` · ramp ${all.starter.vfdRampSeconds}s · cap ${(all.starter.vfdMaxCurrentPu*100).toFixed(0)}% I_n · ${all.starter.vfdVoverFprofile} V/f` :
        ""
      ));
      kv("Cables", `LV ${all.cable.lvLengthM} m @ ${all.cable.lvImpedanceMOhmPerM} mΩ/m · MV ${all.cable.mvLengthM} m @ ${all.cable.mvImpedanceMOhmPerM} mΩ/m`);
      y += 6;

      // Section: KPIs
      banner("Live KPIs", BLACK);
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      kv("Rated I_n", `${snap.Ibase_A.toFixed(0)} A`);
      kv("Z_base", `${snap.Zbase_ohm.toFixed(3)} Ω`);
      kv("N_s · slip", `${snap.Ns_rpm.toFixed(0)} rpm · ${snap.slip_pct.toFixed(2)} %`);
      kv("S rated", `${snap.S_kVA.toFixed(1)} kVA`);
      kv("DOL inrush", `${snap.Idol_A.toFixed(0)} A`);
      kv("Selected method I (MV)", `${snap.start.lineCurrentMVa.toFixed(0)} A  (${(snap.start.lineCurrentMVa/snap.Ibase_A).toFixed(2)}× I_n)`);
      kv("V_gen dip", `${snap.V_gen_dip_pct.toFixed(1)} %  ${snap.pass.genDipOK ? "[OK]" : "[FAIL]"}`);
      kv("V_MV dip", `${snap.V_mv_dip_pct.toFixed(1)} %`);
      kv("TX loading @ start", `${snap.tx_loading_pct.toFixed(0)} %  ${snap.pass.txLoadingOK ? "[OK]" : "[FAIL]"}`);
      kv("Gen loading @ start", `${snap.gen_loading_start_pct.toFixed(0)} %  ${snap.pass.genLoadingStartOK ? "[OK]" : "[FAIL]"}`);
      kv("Gen loading @ run",   `${snap.gen_loading_run_pct.toFixed(0)} %  ${snap.pass.genLoadingRunOK ? "[OK]" : "[FAIL]"}`);
      kv("MV bus I_sc",         `${snap.Isc_kA.toFixed(2)} kA  ${snap.pass.iscBelowSwgrOK ? "[OK]" : "[FAIL]"}`);
      kv("MV bus S_sc",         `${snap.Ssc_MVA.toFixed(1)} MVA`);
      y += 6;

      // Section: CAPEX
      banner("CAPEX (indicative, kUSD)", BLACK);
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      kv("Step-up TX",      `$${capex.transformerKUSD.toFixed(0)} k`);
      kv("MV switchgear",   `$${capex.switchgearKUSD.toFixed(0)} k`);
      kv("Starter",         `$${capex.starterKUSD.toFixed(0)} k`);
      kv("Genset upgrade",  `$${capex.gensetUpgradeKUSD.toFixed(0)} k`);
      kv("Civil & install", `$${capex.civilKUSD.toFixed(0)} k`);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...RED);
      kv("TOTAL",           `$${capex.totalKUSD.toFixed(0)} k`);
      doc.setTextColor(...BLACK);

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...GREY);
      doc.text("Indicative pricing — not a procurement quote.  KFUPM EE360 Term 252.", M, doc.internal.pageSize.getHeight() - 18);

      doc.save(`EE360_${rec.preferred}_${Date.now().toString(36)}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={onExport}
      disabled={busy}
      className="btn-red text-xs disabled:opacity-50"
    >
      {busy ? "Generating…" : "📄 Export PDF report"}
    </button>
  );
}
