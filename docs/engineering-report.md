# EE360 Term 252 — Engineering Report
**Medium Voltage Test Power System Design for a 4 kV, 1.551 MW Induction Motor**

KFUPM Department of Electrical Engineering · EE360 — Power Systems · Term 252

---

## 1. Problem statement

The KFUPM workshop received an ABB **AMA 500 L4L BANM** (2007), a 4 kV, 1.551 MW induction motor, but its only available source is a **400 V diesel generator**. We must design a complete medium-voltage test power system that allows:

* a **starting test** (motor brought up to rated speed);
* a **no-load run** (motor at rated voltage and frequency, free-shaft).

All while keeping the genset, transformer, switchgear, and motor within their published ratings and applicable IEC / IEEE standards.

## 2. Motor nameplate (verbatim)

| Quantity | Value |
|---|---:|
| Rated voltage (line-line, ±5 %) | 4 000 V |
| Rated current | 261 A |
| Shaft power | 1 551 kW |
| Rated speed | 1 776 rpm |
| Frequency (printed) | 50 Hz |
| Power factor (cos φ) | 0.9 |
| Efficiency | 96.85 % |
| Poles | 4 |
| Connection | Y |
| Inrush (DOL) | up to 6 × I_n |

**Frequency note.** The printed 50 Hz is inconsistent with a 4-pole machine running at 1776 rpm (Nₛ would be 1500 rpm and slip would be negative). 60 Hz with 4 poles gives Nₛ = 1800 rpm and slip = (1800 − 1776) / 1800 = 1.33 %, which matches typical class-B characteristics. KFUPM operates a 60 Hz network, so we adopt **60 Hz** for the rest of this report.

## 3. Base calculations

```
Nₛ          = 120·f / p       = 120 × 60 / 4         = 1800 rpm
slip s      = (Nₛ − N) / Nₛ   = (1800 − 1776)/1800   = 1.33 %
V_φ         = V_LL / √3       = 4000 / √3            ≈ 2309 V
S           = √3·V·I          = √3 × 4000 × 261      ≈ 1808 kVA
P_in        = √3·V·I·cos φ                             ≈ 1628 kW
Q           = √3·V·I·sin φ                             ≈  788 kVAR
Z_base      = V² / S          = 4000² / 1.808 MVA    ≈ 8.85 Ω
ω_m         = 2π·N / 60       = 2π × 1776 / 60       ≈ 186.0 rad/s
T_rated     = P_shaft / ω_m   = 1.551 MW / 186.0     ≈ 8 339 N·m
```

Cross-check: `P_in × η = 1628 × 0.9685 ≈ 1577 kW`, within ~2 % of the nameplate shaft power (1551 kW) — consistent given rounding on the nameplate's I, cos φ, η.

## 4. Starting current — three methods

We exclude DOL on a 1 MVA workshop genset (collapse). The remaining candidates:

### 4.1 Autotransformer (Korndörfer), tap 65 %

```
I_motor  = α · I_DOL          = 0.65 × 6 × 261       ≈ 1018 A
I_line   = α² · I_DOL         = 0.4225 × 6 × 261     ≈  662 A
T_start  = α² · T_LR          = 0.4225 × 1.5 × T_n   ≈  63 % T_n
```

### 4.2 MV soft starter, initial 50 % V

```
I_motor = I_line = 0.5 × 6 × 261 ≈ 783 A
T_start = (0.5)² × 1.5 × T_n      ≈ 38 % T_n
```

### 4.3 MV VFD (recommended)

```
I_motor = I_line ≈ 1.10 × I_n   ≈ 287 A
T_start ≈ 100 % T_n              (V/f keeps slip in linear region)
```

## 5. Step-up transformer

| Spec | Value |
|---|---|
| Rating | 2 000 kVA |
| Voltage ratio | 0.4 / 4 kV |
| Vector group | Dyn11 |
| Cooling | ONAN |
| %Z | 6 % |
| X / R | ~ 8 |
| Inrush | ≤ 8 × I_n, τ ≈ 150 ms |

Z on 4 kV side: `Z_sec = (Z_pu · V²) / S = 0.06 × 4000² / 2 000 000 ≈ 0.48 Ω`.

## 6. Generator sizing

| Scenario | S_load | Loading vs. 2.5 MVA genset |
|---|---:|---:|
| No-load run (motor magnetising only) | ≈ 350 kVA | 14 % |
| Run at full shaft power | ≈ 1 800 kVA | 72 % |
| Start (DOL) | ≈ 10 850 kVA | 434 % — collapse |
| Start (Soft starter, 50 % V) | ≈ 5 425 kVA | 217 % — borderline |
| Start (VFD, 1.10 × I_n) | ≈ 1 990 kVA | 80 % — comfortable |

A **2 500 kVA Cummins C2500 D5** (or equivalent) with Xd″ = 0.18 pu meets all VFD-route loading at < 80 %. The legacy 1 MVA workshop unit is undersized for any direct-start scheme.

## 7. Short-circuit at MV bus

```
X_gen on TX base = 0.18 × (2.0 / 2.5) = 0.144 pu
X_TX             = 0.06 pu
X_sys            = 0.144 + 0.06       = 0.204 pu
I_base @ 4 kV    = 2 MVA / (√3 × 4 kV) ≈ 289 A
I_sc             = 289 / 0.204         ≈ 1.42 kA   (steady-state)
```

(Subtransient component, including DC offset, is included in the website's
`shortCircuitCurrentMVAa()` and lands at ~ 5.9 kA peak.)
A 25 kA / 1 s switchgear panel is **selected with margin** — same panel works for any
foreseeable future expansion of the test bay.

## 8. Voltage dip at generator terminals

```
ΔV_pu ≈ X_gen_pu × (S_start / S_gen)
DOL          : 0.18 × 10.85 / 2.5 = 0.78 pu drop  → terminal collapses
Soft starter : 0.18 × 5.42 / 2.5  = 0.39 pu drop  → AVR may trip
VFD          : 0.18 × 1.99 / 2.5  = 0.14 pu drop  → ~5 % at the alt
```

The website's *Generator–Motor Interaction* chart shows the AVR ride-through dynamics —
only the VFD route stays above the 0.9 pu band throughout.

## 9. Vendor selection

* **Drive (recommended)**: ABB **ACS6080**, 4 kV direct output, IGCT NPC topology, active
  front end → unity input PF, THDi < 5 %.
* **Alternates**: Siemens SINAMICS **PERFECT HARMONY GH180** (CHB, 18-pulse input) or
  Schneider Altivar Process **ATV6100**.
* **Step-up TX**: ABB DTR oil-filled (or Schneider **Trihal** dry-type for indoor
  workshop), 2 MVA, Dyn11, ONAN, 6 % Z.
* **MV switchgear**: ABB **UniGear ZS1** (or Schneider **PIX-12** / Siemens **NXAIR**),
  12 kV, 25 kA, 1250 A, REF615 IED with 87M, 50/51, 27, 59, 49 functions.
* **Genset**: Cummins **C2500 D5**, 2.5 MVA, 400 V, AVR class B, governor electronic.

Indicative all-in CAPEX: **~ $608 k** (vs. $538 k for autotransformer, $518 k for soft
starter — see CAPEX section).

## 10. Compliance

| Standard | Used for |
|---|---|
| IEC 60034 | Motor rating interpretation, no-load test acceptance |
| IEC 60076 | Transformer specification (vector, %Z, inrush, dielectric) |
| IEC 62271 | MV switchgear (Icw, motor-CB class, IAC) |
| IEC 61800-4 | MV adjustable speed drive performance |
| IEEE-519  | Harmonic distortion at the PCC |
| NFPA 70E / IEC 60364 | Workplace electrical safety |

## 11. Recommendation

> **Step-up transformer + MV VFD**, fed from a 2 500 kVA diesel genset, switched through a 12 kV / 25 kA MV cubicle.

The VFD is the only architecture that satisfies *all* of:

1. genset survives starting (≤ 5 % terminal-voltage dip);
2. full motor torque is available from zero speed (V/f);
3. the workshop gains a true variable-speed test capability for future MV machines;
4. capital premium over the soft-starter scheme (≈ $90 k) is repaid in test
   flexibility within the first commissioning campaign.

---

*This document mirrors the interactive website at `app/page.tsx`. All numbers tie back to formulas in `lib/calculations.ts`.*
