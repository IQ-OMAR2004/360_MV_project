# EE360 — MV Test Power System

> **Term 252 · KFUPM Electrical Engineering**
>
> Interactive engineering deliverable for the design of a medium-voltage test power system that connects a workshop's **400 V diesel generator** to a **4 kV, 1.551 MW ABB AMA 500 L4L BANM** induction motor.

This repository **replaces a traditional PowerPoint deliverable** with a calculation-driven web experience. Every number is derived from the motor nameplate; every vendor is a real catalog product; every claim ties back to an IEC / IEEE standard.

---

## What's inside

```
ee360-mv-power-system/
├── app/                         # Next.js 14 App Router
│   ├── layout.tsx
│   ├── page.tsx                 # Section composition
│   └── globals.css              # Dark SparkOn-style theme
├── components/
│   ├── Hero.tsx
│   ├── Challenge.tsx
│   ├── NameplateDashboard.tsx   # Click any value → formula + derivation
│   ├── SingleLineDiagram.tsx    # Interactive SVG, hover to inspect
│   ├── Calculations.tsx         # Live sliders for tap, %Z, V_init …
│   ├── Simulation.tsx           # Speed, I, T, V_gen waveforms (Recharts)
│   ├── StartingMethods.tsx
│   ├── GeneratorMotorInteraction.tsx
│   ├── VendorCatalog.tsx        # ABB / Siemens / Schneider / Cummins / Cat
│   ├── CapexMatrix.tsx          # CAPEX table + radar chart
│   ├── Recommendation.tsx
│   ├── Standards.tsx
│   ├── Footer.tsx
│   ├── NavBar.tsx
│   └── ui/Section.tsx
├── lib/
│   ├── motor.ts                 # Nameplate constants
│   └── calculations.ts          # All engineering formulas (JSDoc'd)
├── data/
│   ├── vendors.json             # Real model numbers + indicative prices
│   └── simulation/
│       ├── dol.json             # Pre-computed start curves
│       ├── soft-starter.json
│       └── vfd.json
├── simulation/
│   └── solve.py                 # Generates the JSON above (numpy + optional scipy)
├── docs/
│   └── engineering-report.md    # Mirror of the website content for submission
└── README.md
```

---

## Quick start

```bash
# 1. Install JS dependencies
npm install

# 2. (Optional) Re-generate simulation curves
python3 simulation/solve.py        # writes data/simulation/*.json

# 3. Run dev server
npm run dev                         # http://localhost:3000

# 4. Production build
npm run build && npm start
```

> **Tested with**: Node 22.x, npm 10.x, Python 3.13, numpy 2.4.

---

## Engineering snapshot

| Quantity | Value | Source |
|---|---:|---|
| Rated voltage | 4 000 V | nameplate |
| Rated current | 261 A | nameplate |
| Shaft power | 1 551 kW | nameplate |
| Rated speed | 1 776 rpm | nameplate |
| Synchronous speed | **1 800 rpm** | `120·f / p` (60 Hz, 4-pole) |
| Slip @ rated | **1.33 %** | (Nₛ − N) / Nₛ |
| Apparent power | **≈ 1 808 kVA** | √3·V·I |
| Reactive power | **≈ 788 kVAR** | √3·V·I·sin φ |
| Base impedance (term.) | **≈ 8.85 Ω** | V² / S |
| Rated torque | **≈ 8 339 N·m** | P / ω_m |
| Step-up TX | **2 MVA, 0.4/4 kV, Dyn11, 6 % Z, ONAN** | sized for VFD route |
| Generator | **2 500 kVA, 400 V, Xd″ = 0.18 pu** | upgrade from 1 MVA workshop unit |
| MV switchgear | **12 kV, 1 250 A, 25 kA / 1 s** | UniGear / PIX / NXAIR |
| Short-circuit at MV bus | **≈ 5.9 kA / ~ 41 MVA** | gen Xd″ + TX %Z |
| Recommended starter | **ABB ACS6080 — MV VFD** | 4 kV direct output |

### Why 60 Hz?

The nameplate prints **50 Hz**, but a rated speed of **1776 rpm** with 4 poles only ties out
at 60 Hz (Nₛ = 1800, slip = 1.33%). KFUPM (Saudi Arabia) operates a 60 Hz network and the
ABB AMA 500 L4L is a standard 60 Hz product, so we adopt the 60 Hz interpretation
throughout. This is documented inline in `lib/motor.ts` and again in the engineering report.

---

## Calculation library map

Every formula on the website lives in [`lib/calculations.ts`](lib/calculations.ts) with a
JSDoc block. Highlights:

* `synchronousSpeedRpm()` — `Nₛ = 120·f / p`
* `slip()` — `s = (Nₛ − N) / Nₛ`
* `phaseVoltage()` — `V_φ = V_LL / √3`
* `ratedApparentPowerVA()` / `ratedInputPowerW()` / `ratedReactivePowerVAR()`
* `baseImpedanceOhm()` — `Z_base = V² / S`
* `ratedTorqueNm()` — `T = P_shaft / ω_m`
* `computeStarting(method, options)` — returns motor & line current, torque, dip for any of
  DOL / Autotransformer / SoftStarter / VFD
* `transformerSecondaryImpedanceOhm()` and `transformerVoltageDropPct(I)`
* `generatorLoading(I_motor)` — referred to LV side, returns kVA + loading %
* `generatorVoltageDipPct(I)` — Xd″ × (S_start / S_gen)
* `shortCircuitCurrentMVAa()` and `shortCircuitMVA()`

---

## Simulation

`simulation/solve.py` contains both:

1. **An academic d-q model** of the induction machine (state =
   `[i_ds, i_qs, i_dr, i_qr, ω_r]`) wrapped around `scipy.integrate.odeint` for
   completeness. Only used when scipy is present.
2. **A closed-form surrogate** that reproduces the key transient features (initial
   inrush, sigmoid speed rise, V² torque scaling, AVR-band dip envelope) with no
   numerical solver. Always available — only requires numpy.

Output is written to `data/simulation/{dol,soft-starter,vfd}.json` and consumed by the
**Simulation** section using Recharts.

---

## Design language

The aesthetic mirrors **SparkOn KFUPM**:

* Deep ink palette (`#0A0A0A → #161A1F`) with electric cyan (`#00E0FF`) and a KFUPM-green
  (`#00B47C`) accent.
* `JetBrains Mono` for engineering numbers; `Space Grotesk` for display headings; `Inter`
  for body.
* Glow halos on hero numbers, animated current-flow dashes on the SLD, scroll-revealed
  sections via Framer Motion.

---

## Submitting alongside a written report

The `docs/engineering-report.md` file mirrors the website's content as a Markdown
document. Convert with `pandoc` if a Word/PDF copy is required:

```bash
pandoc docs/engineering-report.md -o report.pdf --pdf-engine=xelatex
```

---

## Standards referenced

| Standard | Subject |
|---|---|
| IEC 60034 | Rotating electrical machines (motor specs & tests) |
| IEC 60076 | Power transformers (Dyn11, %Z, inrush) |
| IEC 62271 | MV switchgear (Icw, IAC, motor-rated CB) |
| IEC 61800-4 | MV adjustable speed drives |
| IEEE-519 | Harmonic limits at the PCC |
| NFPA 70E / IEC 60364 | Workplace electrical safety |

---

## License & use

This is a coursework deliverable for KFUPM EE360 Term 252.  Indicative pricing and
vendor selections are for academic comparison only — not a procurement specification.

🤖 Built with claude-code; engineering content authored by the EE360 project team.
