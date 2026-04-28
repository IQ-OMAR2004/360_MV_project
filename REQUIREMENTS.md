# EE360 — Term 252 Project Requirements Checklist

> Source: `Term Project Description.pdf` — *Medium Voltage Test Power System Design for a 4 kV, 1.551 MW Induction Motor*
> Submission deadline: **April 23, 2026** · Group size: 2–3 students · One submission per group

This file enumerates **every** requirement extracted from the PDF and tags each with the **website module(s)** that will satisfy it in the new interactive simulation build.

**Module key:**
- 🎛 **SIM** — Interactive Simulation (live sliders + plots, the centrepiece)
- 🧮 **CALC** — Calculation pages / KPI cards / formula derivations
- 🔌 **SLD** — Interactive Single Line Diagram
- 💼 **COMM** — Commercial / Vendor / CAPEX section
- 📑 **REC** — Auto-generated Final Recommendation
- 📄 **DOC** — Supporting documentation (README, PDF export, calc sheets)

---

## 0. Motor nameplate (Source for ALL calculations — PDF Fig. 1)

| Parameter | Value | Notes |
|---|---:|---|
| Rated voltage (V_LL, ±5%) | 4 000 V | Y-connected 3-phase |
| Rated current | 261 A | |
| Shaft power | 1 551 kW | |
| Rated speed | 1 776 rpm | |
| Frequency | 50 Hz (printed) | inconsistent w/ 1776 rpm at 4-pole — see footnote |
| Power factor | 0.9 | cos φ |
| Efficiency | 96.85 % | η |
| Connection | Y | 3-phase |
| Mfr. / model | ABB AMA 500 L4L BANM | 2007 |
| **DOL inrush** | up to **6 × I_n** | PDF §4.3 "Important Note" |
| **Source available** | **400 V diesel generator** | PDF §1 |

> **Frequency note:** 1776 rpm with 4 poles only ties out at 60 Hz (Nₛ = 1800, slip = 1.33 %). The website will let the user toggle 50/60 Hz so both interpretations are covered live.

---

## 1. System Design (PDF §3.1) — 35% grading weight (Tech Design)

| # | Requirement | Module(s) |
|---|---|---|
| 1.1 | Step-up transformer (0.4 kV → 4 kV) — sized live | 🎛 SIM · 🧮 CALC · 🔌 SLD |
| 1.2 | MV switchgear (protection, isolation, control at MV bus) | 🔌 SLD · 💼 COMM |
| 1.3 | Motor starting system (limits inrush) — user picks DOL/AT/SS/VFD | 🎛 SIM · 📑 REC |
| 1.4 | "Technically sound" — IEC compliance | 🧮 CALC (badges) · 📄 DOC |
| 1.5 | "Commercially feasible" — real ABB/Siemens/Schneider catalog | 💼 COMM |
| 1.6 | "Operationally practical" — workshop-deployable | 📑 REC justification |

---

## 2. Single Line Diagram (PDF §3.2) — must include all five components

| # | Component on SLD | Module |
|---|---|---|
| 2.1 | Diesel generator (LV source) | 🔌 SLD — colour-coded by loading |
| 2.2 | Step-up transformer (LV/MV) | 🔌 SLD — colour-coded |
| 2.3 | MV switchgear + protection devices (50/51, 27, 59, 87M, 49…) | 🔌 SLD — hover for ANSI codes |
| 2.4 | Motor starter / VFD | 🔌 SLD — swaps when method changes |
| 2.5 | 4 kV induction motor | 🔌 SLD — speed/load indicator |
| 2.6 | **Live colour code (green/yellow/red)** based on loading vs. rating | 🔌 SLD |
| 2.7 | **Hover side panel** (rating, loading %, V, I, status) | 🔌 SLD |
| 2.8 | **Flash red on overload** | 🔌 SLD |

---

## 3. Starting Methods Evaluation (PDF §3.3) — at least 2 of 3

| # | Method | PDF says | Implementation |
|---|---|---|---|
| 3.1 | **Autotransformer starter** — reduced V via tap selection | required (≥1 of 3) | 🎛 SIM with 50/65/80 % tap slider |
| 3.2 | **MV Soft Starter** — thyristor V ramp | required (≥1 of 3) | 🎛 SIM with V_init + ramp time sliders |
| 3.3 | **MV VFD** — full variable speed, regen | required (≥1 of 3) | 🎛 SIM with V/f profile + freq ramp slider |
| 3.4 | (We will compare **all four**: above + DOL as worst-case baseline) | extra | 🎛 SIM overlay toggle |
| 3.5 | Side-by-side overlay of all four on each plot | PDF §6 | 🎛 SIM "compare overlay" toggle |

---

## 4. Engineering Analysis (PDF §4) — core technical content

### 4.1 Motor Base Calculations (PDF §4.1)
| # | Quantity | Formula | Module |
|---|---|---|---|
| 4.1.1 | Rated apparent power S | `S = √3·V·I` | 🧮 CALC live KPI |
| 4.1.2 | Base impedance Z_base | `Z = V² / S` | 🧮 CALC |
| 4.1.3 | Synchronous speed Nₛ | `Nₛ = 120·f / p` | 🧮 CALC |
| 4.1.4 | Slip s | `s = (Nₛ − N) / Nₛ` | 🧮 CALC |
| 4.1.5 | Per-phase voltage V_φ | `V_LL / √3` | 🧮 CALC |
| 4.1.6 | Reactive power Q | `√3·V·I·sin φ` | 🧮 CALC |
| 4.1.7 | Rated torque T | `P_shaft / ω_m` | 🧮 CALC |
| 4.1.8 | Per-unit impedance values (Rs, Xs, Rr, Xr, Xm) | sliders w/ realistic ranges | 🎛 SIM |

### 4.2 Required Analysis (PDF §4.2 — all five mandatory)
| # | Analysis | Live behaviour | Module |
|---|---|---|---|
| 4.2.1 | **Starting current estimation** — full-V + reduced-V each method | redraws on every slider change | 🎛 SIM · 🧮 CALC |
| 4.2.2 | **Voltage drop** at generator terminals during start | live curve | 🎛 SIM · 🧮 CALC |
| 4.2.3 | **Voltage drop** at MV bus during start | live curve incl. TX %Z drop | 🎛 SIM · 🧮 CALC |
| 4.2.4 | **Transformer sizing** — kVA, %Z, cooling class | sliders ⇒ recomputed loading | 🎛 SIM · 💼 COMM |
| 4.2.5 | **Generator loading** under start AND run | live bar gauge w/ % | 🎛 SIM · 🧮 CALC |
| 4.2.6 | **Short-circuit at MV bus** for switchgear sizing | `Isc = V_base / (X_gen + X_TX)` live | 🧮 CALC · 🔌 SLD |

### 4.3 Generator–Motor Interaction (PDF §4.3 — three sub-items)
| # | Aspect | Live output | Module |
|---|---|---|---|
| 4.3.1 | **Voltage dip during start** — magnitude AND duration | live time-domain plot | 🎛 SIM |
| 4.3.2 | **Transformer magnetising inrush** — effect on V stability | live waveform | 🎛 SIM |
| 4.3.3 | **AVR ride-through assessment** — pass/fail per method | live verdict badges | 🎛 SIM · 📑 REC |
| 4.3.4 | **Important Note: 6× DOL** — slider lets user push to 8× to stress test | sliderable | 🎛 SIM |

---

## 5. Standards & Compliance (PDF §5)

| # | Standard | Coverage | Module |
|---|---|---|---|
| 5.1 | **IEC 60034** Rotating Electrical Machines | nameplate interpretation, no-load test acceptance | 🧮 CALC · 📄 DOC |
| 5.2 | **IEC 60076** Power Transformers | TX vector group, %Z, dielectric, inrush | 🧮 CALC · 💼 COMM |
| 5.3 | **IEC 62271** HV Switchgear & Controlgear | Icw, motor-CB class, IAC AFLR | 💼 COMM · 🔌 SLD |
| 5.4 | (Recommended add) **IEC 61800-4** MV PDS | VFD limits, EMC | 💼 COMM |
| 5.5 | (Recommended add) **IEEE-519** harmonics | THDi at PCC | 🧮 CALC |
| 5.6 | Pass/Fail badge on every KPI vs. these standards | live | 🧮 CALC |

---

## 6. Simulation Requirement (PDF §6) — 15% grading weight

| # | Requirement | How fulfilled |
|---|---|---|
| 6.1 | **MATLAB / Simulink** — dynamic, time-domain | Provide a `simulation/simulink/` Simulink `.slx` model file + Python equivalent. *(Browser sim is the primary deliverable; Simulink file is supplied for the rubric.)* |
| 6.2 | **Python** — `scipy`/`numpy` for steady-state + transient | Already exists in `simulation/solve.py`. We'll keep it and re-export refreshed JSON consumed by 🎛 SIM. |
| 6.3 | Motor speed vs. time | 🎛 SIM live plot |
| 6.4 | Stator current vs. time | 🎛 SIM live plot |
| 6.5 | Electromagnetic torque vs. time | 🎛 SIM live plot |
| 6.6 | Generator terminal voltage during start | 🎛 SIM live plot |
| 6.7 | Side-by-side comparison of starting methods | 🎛 SIM overlay toggle |
| 6.8 | Browser-side d-q model integrator (Euler/RK4) so plots redraw <100 ms | 🎛 SIM core engine in `lib/motorModel.ts` |

---

## 7. Commercial Analysis (PDF §7) — 15% grading weight

### 7.1 Vendor Selection (PDF §7.1) — real model numbers required
| # | Vendor | Real models we'll cite | Module |
|---|---|---|---|
| 7.1.1 | **ABB** | ACS6080, ACS5000 (VFD); UniGear ZS1 (SWGR); DTR / DOL distribution TX | 💼 COMM |
| 7.1.2 | **Siemens** | SINAMICS PERFECT HARMONY GH180 (VFD); NXAIR (SWGR); GEAFOL (TX) | 💼 COMM |
| 7.1.3 | **Schneider Electric** | Altivar 1200 / ATV6100 (VFD); PIX-12 (SWGR); Trihal (TX) | 💼 COMM |
| 7.1.4 | (Genset) Cummins C2500 D5, Cat C32 SR5 — to support sizing context | 💼 COMM |

### 7.2 Cost Evaluation (PDF §7.2)
| # | Element | Live? | Module |
|---|---|---|---|
| 7.2.1 | **CAPEX** for each starting method (equipment procurement) | sums up live based on selected vendor models | 💼 COMM · 📑 REC |
| 7.2.2 | **Installation complexity** (civil, commissioning) | scored 1–10, shows in radar | 💼 COMM |

### 7.3 Trade-Off Analysis (PDF §7.3 — five criteria)
| # | Criterion | Live update? | Module |
|---|---|---|---|
| 7.3.1 | **Technical Feasibility** — operate safely & reliably | 0–10 score, recomputed from sliders | 💼 COMM (radar) |
| 7.3.2 | **Generator Compatibility** — V stability + loading | recomputed from dip / loading KPIs | 💼 COMM (radar) |
| 7.3.3 | **Capital Cost** — CAPEX | recomputed from vendor table | 💼 COMM (radar) |
| 7.3.4 | **Installation Complexity** | static per-method score (table) | 💼 COMM (radar) |
| 7.3.5 | **Reliability & Risk** | static per-method score (table) | 💼 COMM (radar) |
| 7.3.6 | Radar redraws when starting method or kVA sliders move | live | 💼 COMM |

---

## 8. Deliverables (PDF §8) — 35% grading weight (Report & Files)

### 8.1 Primary Deliverable: PowerPoint-style report
| # | Section | Module providing the content |
|---|---|---|
| 8.1.1 | System design overview & architecture | 🎛 SIM · 🔌 SLD screenshots |
| 8.1.2 | Complete annotated SLD | 🔌 SLD |
| 8.1.3 | Engineering calculations & analysis | 🧮 CALC |
| 8.1.4 | Simulation results with graphs | 🎛 SIM |
| 8.1.5 | Commercial comparison of starting methods | 💼 COMM |
| 8.1.6 | Final recommendation w/ rationale | 📑 REC |
| 8.1.7 | **"Export PDF report"** button → snapshots current scenario into a single PDF (jsPDF) | 📄 DOC |

### 8.2 Supporting Deliverables
| # | Item | Where |
|---|---|---|
| 8.2.1 | Simulation files (commented, organized) | `simulation/solve.py` + `simulation/simulink/MV_Test_System.slx` (placeholder) + `lib/motorModel.ts` |
| 8.2.2 | Supporting calculations (typed sheets) | `docs/engineering-report.md` (already exists, will refresh) |

---

## 9. Group Structure (PDF §9)

- 2–3 students max · all members contribute · one submission. *(Acknowledged — no software impact; placeholder fields in Footer team list.)*

---

## 10. Grading Criteria (PDF §10)

| Category | Weight | Mapped modules |
|---|---:|---|
| Technical Design (system, SLD, analysis, calcs) | **35 %** | 🧮 CALC + 🔌 SLD + 🎛 SIM |
| Simulation (modelling, results, comparison) | **15 %** | 🎛 SIM |
| Commercial Analysis (vendor, CAPEX, trade-off) | **15 %** | 💼 COMM |
| Report & Files (presentation, clarity, completeness) | **35 %** | 📄 DOC + 📑 REC |
| **Total** | **100 %** | |

> Modules are **load-balanced to maximise grade**: SIM/CALC/SLD together cover the 35% Tech Design + 15% Sim = 50% of the grade, COMM covers 15%, REC + DOC + the polished UI cover the 35% report mark.

---

## 11. Key Engineering Insight (PDF §11) — must be visible in the website

| # | Insight | Surfaced in |
|---|---|---|
| 11.1 | "Not merely voltage conversion" — managing inrush + AVR stability is the real challenge | Hero "Challenge" section + 📑 REC narrative |
| 11.2 | Industry solution: **step-up transformer + MV VFD** | 📑 REC default verdict |

---

## 12. Final Recommendation Question (PDF §12)

> *What is the most practical, safe, and cost-effective solution to test a 4 kV, 1.551 MW induction motor using a 400 V diesel generator, considering technical feasibility, generator stability, equipment cost, and installation complexity?*

The website's `📑 REC` panel **answers this question dynamically** — recomputes the recommendation as the user changes parameters. The success scenario you described (slider 4× → 8× ⇒ verdict flips from "DOL acceptable" to "VFD required" with the genset turning red on the SLD) is the explicit acceptance test.

---

## 13. Interactive-website-specific requirements (from your prompt — NOT in PDF, additive)

These extend the rubric — useful for demo, not strictly required for grading.

| # | Feature | Module |
|---|---|---|
| 13.1 | **Zustand global parameter store** so any slider propagates everywhere | `store/parameters.ts` |
| 13.2 | All motor / generator / TX / starter sliders enumerated in your prompt | `components/ParameterPanel.tsx` |
| 13.3 | KPI cards w/ Pass/Fail badges per IEC limits | `components/KPICards.tsx` |
| 13.4 | All plots redraw < 100 ms | Recharts (chosen over Plotly for SSR + bundle size; lighter, fully sufficient — flag for confirmation) |
| 13.5 | "▶ Play simulation" animation control | 🎛 SIM |
| 13.6 | "⏮ Reset to nameplate defaults" | 🎛 SIM |
| 13.7 | "💾 Save scenario" / "Compare scenarios" overlay | `components/ScenarioManager.tsx` |
| 13.8 | "Export PDF report" — jsPDF | (button on dashboard) |
| 13.9 | Sharp-corner, red/black Sparkon styling already in place | (kept from current build) |
| 13.10 | shadcn/ui components | flag for confirmation: I'd prefer to use the existing Tailwind primitives we already have rather than scaffolding shadcn — same look, less churn. **Decision needed.** |

---

## 14. Coverage check — what we ALREADY have vs. what we need to BUILD

| Existing artifact | Reusable? | Plan |
|---|---|---|
| `lib/calculations.ts` (pure formulas) | ✅ yes | Extend with cable, motor pu params, dynamic recomputation |
| `lib/motor.ts` (nameplate constants) | ✅ yes | Convert constants → defaults, fed into Zustand store |
| `simulation/solve.py` (Python surrogate + d-q stub) | ✅ yes | Keep as-is for §6.1 deliverable |
| `data/simulation/*.json` (pre-computed curves) | ⚠️ partial | Replaced live by `lib/motorModel.ts` (browser RK4) — JSONs kept as fallback / comparison |
| `data/vendors.json` | ✅ yes | Add CAPEX numbers per starting method |
| Existing 14 components (Hero, SLD, Calcs, Sim, Methods, GenMotor, Vendors, CAPEX, Recommendation, Standards, Footer, Nav…) | ⚠️ static numbers | Rewire to read from Zustand store. Static data → live derived. |

| Missing artifact (to BUILD) | Where |
|---|---|
| `store/parameters.ts` (Zustand) | new |
| `lib/engineering.ts` (consolidates calculations + adds dip/short-circuit/cable models) | extend `lib/calculations.ts` |
| `lib/motorModel.ts` (browser RK4 d-q solver) | new |
| `lib/vendors.ts` (typed catalog with prices for live CAPEX summing) | extend `data/vendors.json` → typed module |
| `components/ParameterPanel.tsx`, `KPICards.tsx`, `SimulationPlots.tsx`, `RadarChart.tsx`, `ScenarioManager.tsx` | new |
| `app/sld/page.tsx`, `app/comparison/page.tsx`, `app/recommendation/page.tsx` | new sub-routes (current page becomes `app/page.tsx` dashboard) |
| `simulation/simulink/MV_Test_System.slx` placeholder | new |
| PDF export | new (`jsPDF` integration) |

---

## 15. Open decisions before I start building

> Please confirm or override these — they materially affect what I scaffold:

1. **Charts library** — keep **Recharts** (already wired) or switch to **Plotly.js**? Recharts redraws <100 ms easily; Plotly is heavier but supports more chart types. **My recommendation: Recharts** unless you have a Plotly-specific need.
2. **shadcn/ui** — do you want me to scaffold the full shadcn primitives (`Slider`, `Tabs`, `Card`, `Tooltip`), or use the **plain Tailwind primitives** we already have? Both look the same in the Sparkon dark theme.
3. **State store** — **Zustand** as you specified, confirmed?
4. **Simulink file** — should I generate a **placeholder Simulink `.slx`** with a documented stub, or a **full functional model** (a few hours' work and not directly observable inside the website)? My suggestion: ship a documented stub + a thorough Python d-q model in `solve.py` to satisfy §6.1, and emphasise the browser RK4 in `lib/motorModel.ts` as the headline simulation.
5. **Multi-page or single page?** Your prompt's file structure has `app/page.tsx`, `app/sld/page.tsx`, etc. The current site is a single long-scroll page. **My recommendation:** keep single long-scroll + add anchor sections (better for the demo) — but I'll happily split into multi-page routes if you'd rather match your file tree exactly.
6. **PDF export** — `jsPDF` only (HTML→PDF), or also include a "print stylesheet" so users can `Cmd+P → Save as PDF`? Both are easy.
7. **Existing static "Methods", "GenMotor", "Calculations" sections** — rewrite them to read from the live Zustand store, OR leave them static and add a **new** dashboard-style page on top (`app/page.tsx`)? My recommendation: **rewrite** so the entire site is live, no dual sources of truth.

---

## ✅ This is the checklist. Stopping here as instructed.

Please review and either:

- ✅ **"Confirmed — go build"** (with answers to §15 if you want non-default decisions), or
- 🔄 **"Add / change item X"** before I start.

I will not write any code until you give the green light.
