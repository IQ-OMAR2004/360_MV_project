/**
 * Engineering calculations for the EE360 Term 252 project.
 *
 * Every formula is documented inline so the website can render the
 * derivation alongside the result. All values are SI unless stated.
 *
 * Conventions:
 *   V  — line-to-line voltage (V)
 *   I  — line current (A)
 *   S  — apparent power (VA)
 *   P  — active power (W)
 *   Q  — reactive power (VAR)
 *   √3 — sqrt(3), accounted for in 3-phase formulas
 */

import { MOTOR, GENERATOR, TRANSFORMER } from "./motor";

export const SQRT3 = Math.sqrt(3);

/* ────────────────────────────────────────────────────────────────────────────
 * 1. Motor base quantities
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Synchronous speed (rpm).
 *   Ns = 120 · f / p
 */
export function synchronousSpeedRpm(frequencyHz = MOTOR.ratedFrequencyHz, poles = MOTOR.poles) {
  return (120 * frequencyHz) / poles;
}

/** Slip (per unit). s = (Ns − N) / Ns */
export function slip(speedRpm = MOTOR.ratedSpeedRpm) {
  const ns = synchronousSpeedRpm();
  return (ns - speedRpm) / ns;
}

/** Phase voltage for a Y-connected machine: V_phase = V_LL / √3. */
export function phaseVoltage(vLL = MOTOR.ratedVoltageV) {
  return vLL / SQRT3;
}

/**
 * Rated apparent power back-calculated from nameplate:
 *   S = √3 · V · I
 */
export function ratedApparentPowerVA() {
  return SQRT3 * MOTOR.ratedVoltageV * MOTOR.ratedCurrentA;
}

/**
 * Rated active electrical input power:
 *   P_in = √3 · V · I · cos φ
 * Compare to nameplate shaft power: P_shaft = η · P_in.
 */
export function ratedInputPowerW() {
  return SQRT3 * MOTOR.ratedVoltageV * MOTOR.ratedCurrentA * MOTOR.powerFactor;
}

/** Reactive power: Q = √3 · V · I · sin φ */
export function ratedReactivePowerVAR() {
  const sinPhi = Math.sqrt(1 - MOTOR.powerFactor ** 2);
  return SQRT3 * MOTOR.ratedVoltageV * MOTOR.ratedCurrentA * sinPhi;
}

/**
 * Base impedance referred to motor terminals:
 *   Z_base = V² / S
 * Equivalent per-phase form: Z_base_ph = V_phase / I.
 */
export function baseImpedanceOhm() {
  const S = ratedApparentPowerVA();
  return MOTOR.ratedVoltageV ** 2 / S;
}

/**
 * Rated mechanical torque (N·m): T = P_shaft / ω_m, ω_m = 2π·N/60.
 */
export function ratedTorqueNm() {
  const omegaM = (2 * Math.PI * MOTOR.ratedSpeedRpm) / 60;
  return (MOTOR.ratedShaftPowerKW * 1000) / omegaM;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 2. Starting current — three methods
 * ──────────────────────────────────────────────────────────────────────────── */

export type StartingMethod = "DOL" | "Autotransformer" | "SoftStarter" | "VFD";

export interface StartingResult {
  method: StartingMethod;
  motorVoltagePu: number; // V_motor / V_rated
  motorCurrentA: number; // I drawn by motor
  lineCurrentA: number; // I drawn from MV bus / TX secondary
  startingTorquePu: number; // T_start / T_rated
  voltageDipPctAtMV: number; // estimated dip at MV bus during start
  notes: string;
}

/**
 * Compute starting performance for a given method.
 *
 * Physics used:
 *   • Motor current at reduced voltage scales linearly with voltage:
 *       I_motor ≈ V_motor/V_rated · I_DOL   (locked rotor is largely linear)
 *   • Motor torque at reduced voltage scales with V²:
 *       T_start ≈ (V_motor/V_rated)² · T_LR
 *   • Autotransformer: line current = α · motor current (turns ratio α)
 *       so I_line = α² · I_DOL
 *   • Soft starter (back-to-back thyristors, no isolation): I_line = I_motor
 *   • VFD: drive controls torque & current; design value ≈ 1.1·I_rated.
 *
 * Voltage dip uses Thevenin equivalent at MV bus:
 *     dip(%) = 100 · I_start / I_sc_MV
 */
export function computeStarting(
  method: StartingMethod,
  options?: { autotransformerTap?: number; softStarterVoltagePu?: number },
): StartingResult {
  const Irated = MOTOR.ratedCurrentA;
  const Idol = MOTOR.startingCurrentMultiplier * Irated;
  const TLRpu = MOTOR.lockedRotorTorquePu;
  const Isc = shortCircuitCurrentMVAa();

  switch (method) {
    case "DOL": {
      const dip = (100 * Idol) / Isc;
      return {
        method,
        motorVoltagePu: 1.0,
        motorCurrentA: Idol,
        lineCurrentA: Idol,
        startingTorquePu: TLRpu,
        voltageDipPctAtMV: dip,
        notes:
          "Direct online connection. Worst-case inrush ~6× rated; severe dip on a small generator — not feasible.",
      };
    }
    case "Autotransformer": {
      const alpha = options?.autotransformerTap ?? 0.65;
      const Imotor = alpha * Idol;
      const Iline = alpha * Imotor; // = α² · I_DOL
      return {
        method,
        motorVoltagePu: alpha,
        motorCurrentA: Imotor,
        lineCurrentA: Iline,
        startingTorquePu: alpha ** 2 * TLRpu,
        voltageDipPctAtMV: (100 * Iline) / Isc,
        notes: `Tap at ${(alpha * 100).toFixed(0)}% reduces inrush by α² but also cuts torque to ${(alpha ** 2 * 100).toFixed(0)}% of LR.`,
      };
    }
    case "SoftStarter": {
      const v = options?.softStarterVoltagePu ?? 0.5;
      const Imotor = v * Idol;
      return {
        method,
        motorVoltagePu: v,
        motorCurrentA: Imotor,
        lineCurrentA: Imotor,
        startingTorquePu: v ** 2 * TLRpu,
        voltageDipPctAtMV: (100 * Imotor) / Isc,
        notes:
          "Thyristor phase-control ramps voltage 0.3→1.0 pu. Smooth current profile but draws same I on line side as motor side.",
      };
    }
    case "VFD": {
      const Imotor = 1.1 * Irated; // controlled near rated current
      return {
        method,
        motorVoltagePu: 0.05, // V/f ramps from low frequency
        motorCurrentA: Imotor,
        lineCurrentA: Imotor,
        startingTorquePu: 1.0, // full torque available from low speed
        voltageDipPctAtMV: (100 * Imotor) / Isc,
        notes:
          "Variable-frequency drive ramps V and f together; current capped at ~110% rated, full torque available from zero speed.",
      };
    }
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * 3. Step-up transformer sizing
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Transformer per-unit impedance referred to its own base (already nameplate),
 * converted to ohms on the secondary (4 kV) side:
 *   Z_sec = (Z_pu · V_sec²) / S_base
 */
export function transformerSecondaryImpedanceOhm() {
  const Zpu = TRANSFORMER.impedancePct / 100;
  const S = TRANSFORMER.ratedKVA * 1000;
  return (Zpu * TRANSFORMER.secondaryVoltageV ** 2) / S;
}

/**
 * Voltage drop at the MV terminals when drawing a given current,
 * approximated using the transformer impedance only:
 *   ΔV ≈ I · Z_TX (cos θ + ...)  → simplified to I · Z magnitude on V_pu
 */
export function transformerVoltageDropPct(currentA: number) {
  const Z = transformerSecondaryImpedanceOhm();
  const Vph = phaseVoltage(TRANSFORMER.secondaryVoltageV);
  return (100 * currentA * Z) / (Vph * SQRT3);
}

/* ────────────────────────────────────────────────────────────────────────────
 * 4. Generator loading
 * ──────────────────────────────────────────────────────────────────────────── */

export interface GeneratorLoadingResult {
  scenarioKVA: number;
  loadingPct: number; // S_load / S_gen
  ok: boolean; // <120% peak transient considered survivable
}

/**
 * Required generator loading for a given motor-side current,
 * referred through the step-up transformer to the LV side.
 */
export function generatorLoading(motorSideCurrentA: number): GeneratorLoadingResult {
  // Reflect MV current to LV side: I_LV = I_MV · (V_HV / V_LV)
  const turnsRatio = TRANSFORMER.secondaryVoltageV / TRANSFORMER.primaryVoltageV;
  const Ilv = motorSideCurrentA * turnsRatio;
  const Sload = SQRT3 * GENERATOR.ratedVoltageV * Ilv; // VA
  const sceneKVA = Sload / 1000;
  const loading = (100 * sceneKVA) / GENERATOR.selectedKVA;
  return {
    scenarioKVA: sceneKVA,
    loadingPct: loading,
    ok: loading <= 120,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 5. Short-circuit current at MV bus
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Short-circuit current at the 4 kV MV bus, fed through the step-up
 * transformer. Generator subtransient reactance is included in series.
 *
 *   X_sys_pu = X_gen_pu + Z_TX_pu      (on transformer base)
 *   I_sc = I_base / X_sys_pu
 *
 * For simplicity all impedances are approximated as reactances.
 */
export function shortCircuitCurrentMVAa(): number {
  // Convert generator subtransient reactance from its (gen) base to TX base.
  // Both base voltages are LV side of TX (400 V), so only S-base scaling.
  const Sbase = TRANSFORMER.ratedKVA * 1000;
  const Sgen = GENERATOR.selectedKVA * 1000;
  const xGenOnTxBase = GENERATOR.subtransientReactancePu * (Sbase / Sgen);
  const xTx = TRANSFORMER.impedancePct / 100;
  const xSys = xGenOnTxBase + xTx;

  const Ibase = Sbase / (SQRT3 * TRANSFORMER.secondaryVoltageV);
  return Ibase / xSys;
}

/** Short-circuit MVA at MV bus: S_sc = √3 · V · I_sc. */
export function shortCircuitMVA(): number {
  const Isc = shortCircuitCurrentMVAa();
  return (SQRT3 * TRANSFORMER.secondaryVoltageV * Isc) / 1e6;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 6. Voltage dip during start (generator side)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Steady-state generator terminal-voltage dip during motor start.
 *   ΔV (pu) ≈ X_gen_pu · (S_start / S_gen)
 * Conservative estimate using subtransient reactance.
 */
export function generatorVoltageDipPct(motorStartCurrentA: number): number {
  const turnsRatio = TRANSFORMER.secondaryVoltageV / TRANSFORMER.primaryVoltageV;
  const Ilv = motorStartCurrentA * turnsRatio;
  const Sstart = SQRT3 * GENERATOR.ratedVoltageV * Ilv;
  const Sgen = GENERATOR.selectedKVA * 1000;
  const dipPu = GENERATOR.subtransientReactancePu * (Sstart / Sgen);
  return Math.min(100 * dipPu, 100);
}

/* ────────────────────────────────────────────────────────────────────────────
 * 7. Convenience: pre-derived snapshot
 * ──────────────────────────────────────────────────────────────────────────── */

export function motorSnapshot() {
  const Ns = synchronousSpeedRpm();
  return {
    synchronousSpeedRpm: Ns,
    slipPct: slip() * 100,
    phaseVoltageV: phaseVoltage(),
    apparentPowerKVA: ratedApparentPowerVA() / 1000,
    inputPowerKW: ratedInputPowerW() / 1000,
    reactivePowerKVAR: ratedReactivePowerVAR() / 1000,
    baseImpedanceOhm: baseImpedanceOhm(),
    ratedTorqueNm: ratedTorqueNm(),
    angularSpeedRadS: (2 * Math.PI * MOTOR.ratedSpeedRpm) / 60,
  };
}

export function systemSnapshot() {
  const Isc = shortCircuitCurrentMVAa();
  return {
    transformerZsecOhm: transformerSecondaryImpedanceOhm(),
    shortCircuitKAa: Isc / 1000,
    shortCircuitMVA: shortCircuitMVA(),
    transformerLineCurrentAtRatedA:
      (TRANSFORMER.ratedKVA * 1000) / (SQRT3 * TRANSFORMER.secondaryVoltageV),
  };
}
