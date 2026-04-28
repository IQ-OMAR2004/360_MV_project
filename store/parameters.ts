/**
 * Zustand global parameter store — EE360 Term 252 interactive dashboard.
 *
 * Every slider in the UI writes here, and every KPI / plot / SLD component
 * subscribes here. Single source of truth for the entire site.
 *
 * Sections:
 *   • motor      — nameplate + dynamic per-unit parameters
 *   • generator  — diesel genset
 *   • transformer — step-up TX
 *   • starter    — selected method + per-method parameters
 *   • cable      — LV/MV cable lengths
 *   • scenarios  — saved snapshots for the Compare view
 */

import { create } from "zustand";

/* ─────────────────────────────────────────────────────────────────────────
 * Type definitions
 * ───────────────────────────────────────────────────────────────────────── */

export interface MotorParams {
  ratedVoltageV: number;          // 3000 – 5000
  ratedPowerKW: number;           // 500 – 3000
  ratedCurrentA: number;          // 50 – 500
  powerFactor: number;            // 0.7 – 1.0
  efficiency: number;             // 0.85 – 0.99
  ratedSpeedRpm: number;          // 1400 – 1800
  frequencyHz: 50 | 60;
  poles: 2 | 4 | 6;
  startCurrentMultiplier: number; // 4 – 8 (× I_n at DOL)
  lockedRotorTorquePu: number;    // 0.5 – 2.0 (T_LR / T_n)
  // Per-unit equivalent-circuit parameters (Class B typical)
  RsPu: number;   // 0.005 – 0.05
  XsPu: number;   // 0.05 – 0.20
  RrPu: number;   // 0.005 – 0.05
  XrPu: number;   // 0.05 – 0.20
  XmPu: number;   // 1.5  – 5.0
  inertiaKgM2: number; // 10 – 200
}

export interface GeneratorParams {
  ratedVoltageV: number;          // fixed 400 typically
  ratedKVA: number;               // 500 – 5000
  subtransientReactancePu: number; // 0.10 – 0.30  (Xd″)
  avrResponseMs: number;          // 50 – 500
  allowableDipPct: number;        // 5 – 25
}

export interface TransformerParams {
  primaryVoltageV: number;     // 400 default
  secondaryVoltageV: number;   // 4000 default
  ratedKVA: number;            // 1000 – 5000
  impedancePct: number;        // 4 – 10
  vectorGroup: "Dyn11" | "YNd11" | "Dd0";
  cooling: "ONAN" | "ONAF" | "KNAN";
  inrushMultiplier: number;    // 6 – 10
  inrushDecayTau: number;      // 0.10 – 0.30
}

export type StartingMethod = "DOL" | "Autotransformer" | "SoftStarter" | "VFD";

export interface StarterParams {
  method: StartingMethod;
  // Autotransformer
  autoTap: 0.5 | 0.65 | 0.8;
  // Soft starter
  softInitialVPu: number;  // 0.30 – 0.75
  softRampSeconds: number; // 5 – 30
  softCurrentLimitPu: number; // 2 – 5 (× I_n)
  // VFD
  vfdRampSeconds: number;   // 3 – 30
  vfdMaxCurrentPu: number;  // 1.0 – 1.5
  vfdVoverFprofile: "linear" | "quadratic"; // V/f law
}

export interface CableParams {
  lvLengthM: number;    // 5 – 200
  mvLengthM: number;    // 5 – 200
  lvImpedanceMOhmPerM: number; // 0.05 – 1.0  mΩ/m at 400 V cable
  mvImpedanceMOhmPerM: number; // 0.05 – 1.0  mΩ/m at 4 kV cable
}

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: number;
  params: AllParams;
}

export interface AllParams {
  motor: MotorParams;
  generator: GeneratorParams;
  transformer: TransformerParams;
  starter: StarterParams;
  cable: CableParams;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Defaults — directly from the EE360 PDF nameplate (Fig. 1)
 * ───────────────────────────────────────────────────────────────────────── */

export const DEFAULT_MOTOR: MotorParams = {
  ratedVoltageV: 4000,
  ratedPowerKW: 1551,
  ratedCurrentA: 261,
  powerFactor: 0.9,
  efficiency: 0.9685,
  ratedSpeedRpm: 1776,
  frequencyHz: 60, // documented in REQUIREMENTS.md (1776 rpm consistent w/ 60 Hz 4-pole)
  poles: 4,
  startCurrentMultiplier: 6.0,
  lockedRotorTorquePu: 1.5,
  RsPu: 0.015,
  XsPu: 0.10,
  RrPu: 0.018,
  XrPu: 0.10,
  XmPu: 3.0,
  inertiaKgM2: 60,
};

export const DEFAULT_GENERATOR: GeneratorParams = {
  ratedVoltageV: 400,
  ratedKVA: 2500,
  subtransientReactancePu: 0.18,
  avrResponseMs: 150,
  allowableDipPct: 15,
};

export const DEFAULT_TRANSFORMER: TransformerParams = {
  primaryVoltageV: 400,
  secondaryVoltageV: 4000,
  ratedKVA: 2000,
  impedancePct: 6.0,
  vectorGroup: "Dyn11",
  cooling: "ONAN",
  inrushMultiplier: 8,
  inrushDecayTau: 0.15,
};

export const DEFAULT_STARTER: StarterParams = {
  method: "VFD",
  autoTap: 0.65,
  softInitialVPu: 0.5,
  softRampSeconds: 12,
  softCurrentLimitPu: 3.5,
  vfdRampSeconds: 8,
  vfdMaxCurrentPu: 1.10,
  vfdVoverFprofile: "linear",
};

export const DEFAULT_CABLE: CableParams = {
  lvLengthM: 30,
  mvLengthM: 50,
  lvImpedanceMOhmPerM: 0.20,
  mvImpedanceMOhmPerM: 0.15,
};

const DEFAULT_ALL: AllParams = {
  motor: DEFAULT_MOTOR,
  generator: DEFAULT_GENERATOR,
  transformer: DEFAULT_TRANSFORMER,
  starter: DEFAULT_STARTER,
  cable: DEFAULT_CABLE,
};

/* ─────────────────────────────────────────────────────────────────────────
 * Store
 * ───────────────────────────────────────────────────────────────────────── */

interface ParametersState extends AllParams {
  scenarios: SavedScenario[];
  comparisonSelection: [string | null, string | null];

  // setters
  setMotor: (patch: Partial<MotorParams>) => void;
  setGenerator: (patch: Partial<GeneratorParams>) => void;
  setTransformer: (patch: Partial<TransformerParams>) => void;
  setStarter: (patch: Partial<StarterParams>) => void;
  setCable: (patch: Partial<CableParams>) => void;

  // scenarios
  saveScenario: (name: string) => void;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
  setComparison: (slot: 0 | 1, id: string | null) => void;

  // global
  resetDefaults: () => void;
}

export const useParameters = create<ParametersState>((set, get) => ({
  ...DEFAULT_ALL,
  scenarios: [],
  comparisonSelection: [null, null],

  setMotor: (patch) => set((s) => ({ motor: { ...s.motor, ...patch } })),
  setGenerator: (patch) => set((s) => ({ generator: { ...s.generator, ...patch } })),
  setTransformer: (patch) => set((s) => ({ transformer: { ...s.transformer, ...patch } })),
  setStarter: (patch) => set((s) => ({ starter: { ...s.starter, ...patch } })),
  setCable: (patch) => set((s) => ({ cable: { ...s.cable, ...patch } })),

  saveScenario: (name) =>
    set((s) => ({
      scenarios: [
        ...s.scenarios,
        {
          id: `s-${Date.now().toString(36)}`,
          name,
          createdAt: Date.now(),
          params: {
            motor: s.motor,
            generator: s.generator,
            transformer: s.transformer,
            starter: s.starter,
            cable: s.cable,
          },
        },
      ],
    })),

  loadScenario: (id) => {
    const sc = get().scenarios.find((x) => x.id === id);
    if (!sc) return;
    set({ ...sc.params });
  },

  deleteScenario: (id) =>
    set((s) => ({
      scenarios: s.scenarios.filter((x) => x.id !== id),
      comparisonSelection: s.comparisonSelection.map((cid) => cid === id ? null : cid) as [string | null, string | null],
    })),

  setComparison: (slot, id) =>
    set((s) => {
      const next = [...s.comparisonSelection] as [string | null, string | null];
      next[slot] = id;
      return { comparisonSelection: next };
    }),

  resetDefaults: () => set({ ...DEFAULT_ALL }),
}));

/* Pure helper — no React; useful for SSR-safe initial computations. */
export function getCurrentParams(): AllParams {
  return DEFAULT_ALL;
}
