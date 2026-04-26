/**
 * Motor nameplate data for the EE360 Term 252 project.
 *
 * Source: ABB AMA 500 L4L BANM induction motor (2007).
 *
 * Frequency note:
 *   The nameplate lists 50 Hz, but the rated speed of 1776 rpm is consistent
 *   with a 4-pole machine at 60 Hz (Ns = 120·f/p = 120·60/4 = 1800 rpm),
 *   giving a slip of (1800-1776)/1800 = 1.33%. KFUPM (Saudi Arabia) operates
 *   on a 60 Hz grid, so we adopt the 60 Hz / 1800 rpm interpretation
 *   throughout. This is documented in the engineering report.
 */
export const MOTOR = {
  manufacturer: "ABB",
  model: "AMA 500 L4L BANM",
  year: 2007,

  // Electrical
  ratedVoltageV: 4000, // V (line-line, ±5%)
  voltageTolerance: 0.05,
  ratedCurrentA: 261, // A
  ratedFrequencyHz: 60, // see note above
  poles: 4,
  connection: "Y" as const,
  phases: 3,

  // Mechanical / performance
  ratedShaftPowerKW: 1551,
  ratedSpeedRpm: 1776,
  powerFactor: 0.9,
  efficiency: 0.9685,

  // Starting characteristic
  startingCurrentMultiplier: 6.0, // I_start / I_rated under DOL
  lockedRotorTorquePu: 1.5, // T_LR / T_rated, typical for large MV motor
  breakdownTorquePu: 2.4, // pull-out torque, typical for class B
  inertiaKgM2: 60, // J, approximate (motor + coupling), kg·m²
} as const;

/**
 * Diesel generator nameplate (LV source available at the workshop).
 */
export const GENERATOR = {
  ratedVoltageV: 400, // V line-line
  ratedFrequencyHz: 60,
  // Practical sizing: chosen to handle motor load + start with the VFD route.
  // We document oversizing below in the calculations section.
  selectedKVA: 2500, // chosen for the recommended design
  subtransientReactancePu: 0.18, // Xd'', typical for diesel synchronous gen
  transientReactancePu: 0.25, // Xd'
  synchronousReactancePu: 1.8, // Xd
  voltageRegulationBandPct: 5, // AVR steady-state band
} as const;

/**
 * Step-up transformer selected for the recommended design.
 * 0.4 kV (Dyn11 LV) → 4 kV (HV) feeding the MV switchgear and motor.
 */
export const TRANSFORMER = {
  ratedKVA: 2000,
  primaryVoltageV: 400,
  secondaryVoltageV: 4000,
  vectorGroup: "Dyn11" as const,
  cooling: "ONAN" as const,
  impedancePct: 6.0, // %Z on own base
  xOverR: 8, // typical for a 2 MVA TX
  noLoadLossKW: 3.0,
  loadLossKW: 18.5,
  inrushMultiplier: 8, // I_inrush / I_rated, typical
  inrushDecayTau: 0.15, // s, magnetising-current decay time constant
} as const;

export type MotorData = typeof MOTOR;
export type GeneratorData = typeof GENERATOR;
export type TransformerData = typeof TRANSFORMER;
