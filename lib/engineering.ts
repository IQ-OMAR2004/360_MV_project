/**
 * EE360 Term 252 — Engineering math.
 *
 * All formulas live here as pure functions taking AllParams (or a sub-slice)
 * and returning derived values. The UI layer subscribes to the Zustand
 * parameters and calls these helpers — every plot, KPI, and badge is
 * recomputed on each parameter change.
 *
 * Naming convention:
 *   • lower-case verbs return scalars (e.g. ratedApparentPowerVA)
 *   • Snapshot-style helpers return objects (e.g. computeStartingResult)
 *
 * SI everywhere; per-unit values noted explicitly.
 */

import type {
  AllParams,
  GeneratorParams,
  MotorParams,
  StarterParams,
  TransformerParams,
} from "@/store/parameters";

export const SQRT3 = Math.sqrt(3);

/* ────────────────────────────────────────────────────────────────────────
 * 1. Motor base quantities  (PDF §4.1)
 * ──────────────────────────────────────────────────────────────────────── */

/** Synchronous speed.  Nₛ = 120·f / p. */
export const synchronousSpeedRpm = (m: MotorParams) =>
  (120 * m.frequencyHz) / m.poles;

/** Slip.  s = (Nₛ − N) / Nₛ. */
export const slipPu = (m: MotorParams) => {
  const ns = synchronousSpeedRpm(m);
  return (ns - m.ratedSpeedRpm) / ns;
};

/** Phase voltage (Y-connected).  V_φ = V_LL / √3. */
export const phaseVoltageV = (m: MotorParams) => m.ratedVoltageV / SQRT3;

/** Apparent power.  S = √3·V·I. */
export const ratedApparentPowerVA = (m: MotorParams) =>
  SQRT3 * m.ratedVoltageV * m.ratedCurrentA;

/** Active electrical input power.  P_in = √3·V·I·cos φ. */
export const ratedInputPowerW = (m: MotorParams) =>
  SQRT3 * m.ratedVoltageV * m.ratedCurrentA * m.powerFactor;

/** Reactive power.  Q = √3·V·I·sin φ. */
export const ratedReactivePowerVAR = (m: MotorParams) =>
  SQRT3 * m.ratedVoltageV * m.ratedCurrentA * Math.sqrt(1 - m.powerFactor ** 2);

/** Base impedance.  Z = V² / S. */
export const baseImpedanceOhm = (m: MotorParams) =>
  m.ratedVoltageV ** 2 / ratedApparentPowerVA(m);

/** Mechanical angular speed at rated.  ω_m = 2π·N / 60. */
export const angularSpeedRadS = (m: MotorParams) =>
  (2 * Math.PI * m.ratedSpeedRpm) / 60;

/** Rated shaft torque.  T = P / ω_m. */
export const ratedTorqueNm = (m: MotorParams) => {
  const om = angularSpeedRadS(m);
  return (m.ratedPowerKW * 1000) / om;
};

/* ────────────────────────────────────────────────────────────────────────
 * 2. Starting current — four methods  (PDF §4.2.1)
 * ──────────────────────────────────────────────────────────────────────── */

export interface StartingResult {
  method: StarterParams["method"];
  motorVoltagePu: number;
  motorCurrentA: number;        // current drawn at the motor terminals (HV side)
  lineCurrentMVa: number;       // current on the MV bus side of the starter
  lineCurrentLVa: number;       // current reflected to the 400 V LV side (gen)
  startingTorquePu: number;     // T_start / T_n
  notes: string;
}

export function computeStarting(p: AllParams): StartingResult {
  const { motor, transformer, starter } = p;
  const I_n = motor.ratedCurrentA;
  const I_dol = motor.startCurrentMultiplier * I_n;
  const T_LR = motor.lockedRotorTorquePu;
  const turnsRatio = transformer.secondaryVoltageV / transformer.primaryVoltageV;

  const reflectToLV = (i_mv: number) => i_mv * turnsRatio;

  switch (starter.method) {
    case "DOL": {
      const Imv = I_dol;
      return {
        method: "DOL",
        motorVoltagePu: 1.0,
        motorCurrentA: Imv,
        lineCurrentMVa: Imv,
        lineCurrentLVa: reflectToLV(Imv),
        startingTorquePu: T_LR,
        notes: `Direct-on-line — full inrush ${Imv.toFixed(0)} A on the MV bus, ${reflectToLV(Imv).toFixed(0)} A on the LV genset side.`,
      };
    }
    case "Autotransformer": {
      const a = starter.autoTap;
      const Imotor = a * I_dol;          // motor sees αV → αI_dol
      const Imv    = a * Imotor;         // line side = α·I_motor = α²·I_dol
      return {
        method: "Autotransformer",
        motorVoltagePu: a,
        motorCurrentA: Imotor,
        lineCurrentMVa: Imv,
        lineCurrentLVa: reflectToLV(Imv),
        startingTorquePu: a * a * T_LR,
        notes: `Tap ${(a*100).toFixed(0)}% — line current α²·I_DOL = ${Imv.toFixed(0)} A, torque ${(a*a*100).toFixed(0)}% of LR.`,
      };
    }
    case "SoftStarter": {
      const v = starter.softInitialVPu;
      const Imotor = Math.min(starter.softCurrentLimitPu * I_n, v * I_dol);
      return {
        method: "SoftStarter",
        motorVoltagePu: v,
        motorCurrentA: Imotor,
        lineCurrentMVa: Imotor,
        lineCurrentLVa: reflectToLV(Imotor),
        startingTorquePu: v * v * T_LR,
        notes: `Initial V ${(v*100).toFixed(0)}% — current capped by thyristor at ${starter.softCurrentLimitPu.toFixed(1)}× I_n. Torque ∝ V² → ${(v*v*100).toFixed(0)}% LR.`,
      };
    }
    case "VFD": {
      const Imotor = starter.vfdMaxCurrentPu * I_n;
      return {
        method: "VFD",
        motorVoltagePu: 0.05, // V/f starts low
        motorCurrentA: Imotor,
        lineCurrentMVa: Imotor,
        lineCurrentLVa: reflectToLV(Imotor),
        startingTorquePu: 1.0, // full torque available from zero speed
        notes: `VFD V/f ramp over ${starter.vfdRampSeconds.toFixed(0)} s — current capped at ${(starter.vfdMaxCurrentPu*100).toFixed(0)}% I_n, full torque available from zero speed.`,
      };
    }
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * 3. Transformer  (PDF §4.2.4)
 * ──────────────────────────────────────────────────────────────────────── */

/** TX impedance referred to the secondary (HV/4 kV) side, in ohms. */
export function transformerSecondaryOhm(t: TransformerParams) {
  const Zpu = t.impedancePct / 100;
  return (Zpu * t.secondaryVoltageV ** 2) / (t.ratedKVA * 1000);
}

/** TX impedance referred to primary (LV/400 V) side. */
export function transformerPrimaryOhm(t: TransformerParams) {
  const Zpu = t.impedancePct / 100;
  return (Zpu * t.primaryVoltageV ** 2) / (t.ratedKVA * 1000);
}

/** Voltage drop across the transformer due to a current I (HV side, in A). */
export function transformerVoltageDropPct(I_HV: number, t: TransformerParams) {
  const Z = transformerSecondaryOhm(t);
  const Vph = t.secondaryVoltageV / SQRT3;
  return (100 * I_HV * Z) / (Vph * SQRT3);
}

/** Loading of the transformer at a given motor-side current.  S = √3·V·I. */
export function transformerLoadingPct(I_HV: number, t: TransformerParams) {
  const S = SQRT3 * t.secondaryVoltageV * I_HV; // VA
  return (100 * S) / (t.ratedKVA * 1000);
}

/* ────────────────────────────────────────────────────────────────────────
 * 4. Cable impedance  (extra — additional drop)
 * ──────────────────────────────────────────────────────────────────────── */

export function cableLVOhm(c: AllParams["cable"]) {
  return (c.lvLengthM * c.lvImpedanceMOhmPerM) / 1000;
}
export function cableMVOhm(c: AllParams["cable"]) {
  return (c.mvLengthM * c.mvImpedanceMOhmPerM) / 1000;
}

/* ────────────────────────────────────────────────────────────────────────
 * 5. Generator dip + loading  (PDF §4.2.2 / 4.2.5 / 4.3.1)
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Voltage dip at the generator terminals.
 *   ΔV_pu = (Xd″ · I_pu) / (1 + Xd″ · I_pu)   simplified Thevenin
 * where I_pu = S_start / S_gen.
 */
export function generatorDipPct(I_lv: number, p: AllParams) {
  const { generator } = p;
  const S_start = SQRT3 * generator.ratedVoltageV * I_lv;
  const S_gen = generator.ratedKVA * 1000;
  const I_pu = S_start / S_gen;
  const dipPu = (generator.subtransientReactancePu * I_pu) /
                (1 + generator.subtransientReactancePu * I_pu);
  return Math.min(100 * dipPu, 100);
}

export interface GeneratorLoading {
  scenarioKVA: number;
  loadingPct: number;
  ok: boolean;
}

/** Loading of the generator from the LV-side current. */
export function generatorLoading(I_lv: number, g: GeneratorParams): GeneratorLoading {
  const Sload = SQRT3 * g.ratedVoltageV * I_lv;
  const sceneKVA = Sload / 1000;
  const loadingPct = (100 * sceneKVA) / g.ratedKVA;
  return { scenarioKVA: sceneKVA, loadingPct, ok: loadingPct <= 110 };
}

/* ────────────────────────────────────────────────────────────────────────
 * 6. Voltage drop at the MV bus  (PDF §4.2.3)
 *    Combines TX impedance + MV cable.
 * ──────────────────────────────────────────────────────────────────────── */

export function mvBusDipPct(I_HV: number, p: AllParams) {
  const dipTX = transformerVoltageDropPct(I_HV, p.transformer);
  const Zc = cableMVOhm(p.cable);
  const Vph = p.transformer.secondaryVoltageV / SQRT3;
  const dipCable = (100 * I_HV * Zc) / (Vph * SQRT3);
  return dipTX + dipCable;
}

/* ────────────────────────────────────────────────────────────────────────
 * 7. Short-circuit at MV bus  (PDF §4.2.6)
 *    Zsys = X_gen ‖ TX + Z_cable, then Isc = V_base / X_sys (per unit).
 * ──────────────────────────────────────────────────────────────────────── */

export function shortCircuitMVBus(p: AllParams) {
  const { generator, transformer, cable } = p;

  // pu base = transformer
  const Sbase = transformer.ratedKVA * 1000;
  const Sgen = generator.ratedKVA * 1000;
  const xGenOnTxBase = generator.subtransientReactancePu * (Sbase / Sgen);
  const xTx = transformer.impedancePct / 100;

  // cable Zpu on TX base — convert ohms to pu via Zbase = V²/S
  const Zbase = transformer.secondaryVoltageV ** 2 / Sbase;
  const xCablePu = cableMVOhm(cable) / Zbase;

  const xSys = xGenOnTxBase + xTx + xCablePu;

  const Ibase = Sbase / (SQRT3 * transformer.secondaryVoltageV);
  const I_sc = Ibase / Math.max(xSys, 1e-6);
  const S_sc = SQRT3 * transformer.secondaryVoltageV * I_sc;

  return {
    Isc_kA: I_sc / 1000,
    Ssc_MVA: S_sc / 1e6,
    xSys_pu: xSys,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 8. Master snapshot — used by KPI cards & SLD coloring
 * ──────────────────────────────────────────────────────────────────────── */

export interface SystemSnapshot {
  // base quantities
  Ibase_A: number;
  Zbase_ohm: number;
  Ns_rpm: number;
  slip_pct: number;
  S_kVA: number;
  T_n_Nm: number;

  // starting (current method)
  start: StartingResult;
  Idol_A: number;

  // dips & loading
  V_gen_dip_pct: number;
  V_mv_dip_pct: number;
  tx_loading_pct: number;
  gen_loading_run_pct: number;
  gen_loading_start_pct: number;

  // short circuit
  Isc_kA: number;
  Ssc_MVA: number;

  // pass/fail per IEC limits
  pass: {
    genDipOK: boolean;          // ΔV ≤ allowable
    txLoadingOK: boolean;       // loading ≤ 110% transient
    genLoadingStartOK: boolean; // loading ≤ 130% transient
    genLoadingRunOK: boolean;   // loading ≤ 90% continuous
    iscBelowSwgrOK: boolean;    // Isc ≤ 25 kA (typical 12 kV swgr rating)
  };
}

export function snapshot(p: AllParams): SystemSnapshot {
  const m = p.motor;
  const Ns = synchronousSpeedRpm(m);
  const start = computeStarting(p);
  const I_dol = m.startCurrentMultiplier * m.ratedCurrentA;

  const V_gen_dip = generatorDipPct(start.lineCurrentLVa, p);
  const V_mv_dip = mvBusDipPct(start.lineCurrentMVa, p);

  // Transformer loading at start
  const txLoading = transformerLoadingPct(start.lineCurrentMVa, p.transformer);

  // Generator loading: at start AND at run (full motor power)
  const genLoadingStart = generatorLoading(start.lineCurrentLVa, p.generator).loadingPct;
  // Continuous run loading: ratedInputPower / 0.8 PF / S_gen
  const Pin = ratedInputPowerW(m);
  const Srun_lv = Pin / 0.85; // 0.85 pf at gen LV side after TX losses
  const genLoadingRun = (100 * Srun_lv) / (p.generator.ratedKVA * 1000);

  const sc = shortCircuitMVBus(p);

  const pass = {
    genDipOK: V_gen_dip <= p.generator.allowableDipPct,
    txLoadingOK: txLoading <= 130,
    genLoadingStartOK: genLoadingStart <= 130,
    genLoadingRunOK: genLoadingRun <= 90,
    iscBelowSwgrOK: sc.Isc_kA <= 25,
  };

  return {
    Ibase_A: m.ratedCurrentA,
    Zbase_ohm: baseImpedanceOhm(m),
    Ns_rpm: Ns,
    slip_pct: slipPu(m) * 100,
    S_kVA: ratedApparentPowerVA(m) / 1000,
    T_n_Nm: ratedTorqueNm(m),

    start,
    Idol_A: I_dol,

    V_gen_dip_pct: V_gen_dip,
    V_mv_dip_pct: V_mv_dip,
    tx_loading_pct: txLoading,
    gen_loading_run_pct: genLoadingRun,
    gen_loading_start_pct: genLoadingStart,

    Isc_kA: sc.Isc_kA,
    Ssc_MVA: sc.Ssc_MVA,

    pass,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 9. Trade-off scoring (live radar)
 * ──────────────────────────────────────────────────────────────────────── */

export interface TradeoffScores {
  technicalFeasibility: number; // 0 – 10
  generatorCompatibility: number;
  capitalCost: number;          // higher = cheaper
  installationComplexity: number; // higher = simpler
  reliability: number;
}

/**
 * Score the *currently selected* starting method against the *current*
 * system parameters. Live — changes as sliders move.
 */
export function tradeoffScores(p: AllParams, snap: SystemSnapshot): TradeoffScores {
  const method = p.starter.method;

  // Technical Feasibility — ability to bring motor to rated speed without
  // violating any IEC limit.
  const passCount = Object.values(snap.pass).filter(Boolean).length;
  const technicalFeasibility = (passCount / 5) * 10;

  // Generator compatibility — inverse of dip + loading%.
  const dipPenalty = Math.min(snap.V_gen_dip_pct / 25, 1);   // 25% dip = full penalty
  const loadPenalty = Math.max(0, (snap.gen_loading_start_pct - 100) / 100); // >100% penalised
  const generatorCompatibility = Math.max(0, 10 * (1 - 0.6 * dipPenalty - 0.4 * loadPenalty));

  // Capital cost (per method) — fixed-ish ordering, baseline 10 = cheap.
  const capByMethod: Record<typeof method, number> = {
    DOL: 10,
    Autotransformer: 7,
    SoftStarter: 6,
    VFD: 4,
  };
  const capitalCost = capByMethod[method];

  // Installation complexity — simpler is higher.
  const instByMethod: Record<typeof method, number> = {
    DOL: 9,
    Autotransformer: 5,
    SoftStarter: 8,
    VFD: 6,
  };
  const installationComplexity = instByMethod[method];

  // Reliability — power-electronics methods slightly lower than electromechanical.
  const reliabilityByMethod: Record<typeof method, number> = {
    DOL: 8,
    Autotransformer: 9,
    SoftStarter: 7,
    VFD: 8,
  };
  const reliability = reliabilityByMethod[method];

  return {
    technicalFeasibility,
    generatorCompatibility,
    capitalCost,
    installationComplexity,
    reliability,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 10. CAPEX estimate (live, per method)  (PDF §7.2)
 * ──────────────────────────────────────────────────────────────────────── */

const CAPEX_BASE_K_USD = {
  step_up_TX_per_MVA: 24,   // $24 k/MVA
  mv_switchgear_panel: 70,
  install_civil:      60,
  genset_per_kVA:     0.32, // $0.32 k/kVA = $320/kVA
  starter: {
    DOL:             20,
    Autotransformer: 180,
    SoftStarter:     260,
    VFD:             350,
  } as Record<StarterParams["method"], number>,
};

export function estimateCAPEX(p: AllParams) {
  const { transformer, starter, generator } = p;
  const tx = (transformer.ratedKVA / 1000) * CAPEX_BASE_K_USD.step_up_TX_per_MVA;
  const mvSwgr = CAPEX_BASE_K_USD.mv_switchgear_panel;
  const civil = CAPEX_BASE_K_USD.install_civil;
  const gen = (generator.ratedKVA - 1000) > 0
    ? (generator.ratedKVA - 1000) * CAPEX_BASE_K_USD.genset_per_kVA
    : 0;
  const start = CAPEX_BASE_K_USD.starter[starter.method];

  const total = tx + mvSwgr + civil + gen + start;
  return {
    transformerKUSD: tx,
    switchgearKUSD: mvSwgr,
    civilKUSD: civil,
    gensetUpgradeKUSD: gen,
    starterKUSD: start,
    totalKUSD: total,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 11. Auto-recommendation logic  (PDF §12 — final question)
 * ──────────────────────────────────────────────────────────────────────── */

export interface Recommendation {
  preferred: StarterParams["method"];
  badge: "Acceptable" | "Marginal" | "Not Acceptable";
  rationale: string;
  flagged: string[]; // failing constraints
}

export function recommend(p: AllParams, snap: SystemSnapshot): Recommendation {
  const flagged: string[] = [];
  if (!snap.pass.genDipOK) flagged.push(`Generator dip ${snap.V_gen_dip_pct.toFixed(1)}% > allowable ${p.generator.allowableDipPct}%`);
  if (!snap.pass.txLoadingOK) flagged.push(`Transformer loading ${snap.tx_loading_pct.toFixed(0)}% during start exceeds 130%`);
  if (!snap.pass.genLoadingStartOK) flagged.push(`Generator loading ${snap.gen_loading_start_pct.toFixed(0)}% during start exceeds 130%`);
  if (!snap.pass.genLoadingRunOK) flagged.push(`Generator loading ${snap.gen_loading_run_pct.toFixed(0)}% at run exceeds 90% continuous`);
  if (!snap.pass.iscBelowSwgrOK) flagged.push(`Short-circuit ${snap.Isc_kA.toFixed(1)} kA exceeds 25 kA switchgear class`);

  // Decision tree:
  //  • If current method passes everything → that method is acceptable.
  //  • Else → recommend VFD (industry-standard fallback per PDF §11).
  const allPass = flagged.length === 0;
  const current = p.starter.method;

  if (allPass) {
    return {
      preferred: current,
      badge: "Acceptable",
      rationale: `${current} satisfies all five IEC-derived limits with the current parameters.  Generator dip ${snap.V_gen_dip_pct.toFixed(1)}%, MV bus dip ${snap.V_mv_dip_pct.toFixed(1)}%, generator loading ${snap.gen_loading_start_pct.toFixed(0)}% during start.`,
      flagged: [],
    };
  }

  // Some constraint failed.
  const dipBad = !snap.pass.genDipOK;
  const loadBad = !snap.pass.genLoadingStartOK || !snap.pass.txLoadingOK;
  if (current === "DOL" && (dipBad || loadBad)) {
    return {
      preferred: "VFD",
      badge: "Not Acceptable",
      rationale: `DOL fails ${flagged.length} constraint(s).  Inrush ${snap.start.lineCurrentMVa.toFixed(0)} A drives the genset to ${snap.gen_loading_start_pct.toFixed(0)}% loading and a ${snap.V_gen_dip_pct.toFixed(1)}% dip.  An MV VFD caps the inrush at ~1.10× I_n, eliminating both problems.`,
      flagged,
    };
  }
  if (current === "Autotransformer" || current === "SoftStarter") {
    return {
      preferred: "VFD",
      badge: "Marginal",
      rationale: `${current} reduces inrush but the genset still sees ${snap.gen_loading_start_pct.toFixed(0)}% loading and ${snap.V_gen_dip_pct.toFixed(1)}% dip.  An MV VFD is the canonical industry remedy (PDF §11) and additionally enables variable-speed no-load testing.`,
      flagged,
    };
  }

  return {
    preferred: "VFD",
    badge: "Marginal",
    rationale: `Even the VFD configuration is being pushed past one or more limits — consider re-sizing the genset (current ${p.generator.ratedKVA} kVA) or transformer (current ${p.transformer.ratedKVA} kVA).`,
    flagged,
  };
}
