/**
 * Real-vendor catalog for ABB / Siemens / Schneider / Cummins / Cat (PDF §7.1).
 * Used by the live AutoRecommendation panel and by the VendorCatalog section.
 *
 * Prices are 2026-USD indicative and are intentionally typed so the live
 * CAPEX summing is type-safe.
 */

import type { StartingMethod } from "@/store/parameters";

export interface VendorProduct {
  vendor: "ABB" | "Siemens" | "Schneider Electric" | "Cummins" | "Caterpillar";
  model: string;
  category: string;
  voltage_kV?: string;
  power_MW?: string;
  rating?: string;
  topology?: string;
  highlights: string[];
  fit?: string;
  priceKUSD?: number; // for live CAPEX summing
}

export interface MethodCatalog {
  starter: VendorProduct;       // primary recommendation per method
  alternates: VendorProduct[];
}

/** Selected drive/starter per method (the live recommendation cites this one). */
export const METHOD_CATALOG: Record<StartingMethod, MethodCatalog> = {
  DOL: {
    starter: {
      vendor: "ABB",
      model: "Direct contactor cabinet (no starter)",
      category: "DOL contactor",
      voltage_kV: "4",
      rating: "MV vacuum contactor + lockable disconnect",
      highlights: [
        "Cheapest possible — no electronics",
        "Inrush 6× I_n appears unmodified at the bus",
        "Only viable if generator dwarfs motor (≥ 5× S_motor)",
      ],
      priceKUSD: 20,
    },
    alternates: [],
  },
  Autotransformer: {
    starter: {
      vendor: "Schneider Electric",
      model: "Autotransformer Starter Cabinet",
      category: "Korndörfer autotransformer",
      voltage_kV: "4",
      rating: "Tap 50 / 65 / 80 %",
      highlights: [
        "Tap 65% drops line current to α² × I_dol = 42% × I_dol",
        "Open-transition switch (Korndörfer eliminates re-acceleration spike)",
        "Bypass contactor at full speed → no run-time losses",
      ],
      priceKUSD: 180,
    },
    alternates: [
      {
        vendor: "ABB", model: "Custom autotransformer panel",
        category: "Autotransformer", voltage_kV: "4",
        highlights: ["Available on engineer-to-order basis"],
        priceKUSD: 200,
      },
    ],
  },
  SoftStarter: {
    starter: {
      vendor: "ABB",
      model: "PSTX MV (with step-up TX integration)",
      category: "MV thyristor soft starter",
      voltage_kV: "0.4 / 4 (with TX)",
      power_MW: "≤ 2.0",
      topology: "Back-to-back thyristors, voltage ramp",
      highlights: [
        "Smooth 30 → 100% voltage ramp",
        "Integrated bypass contactor",
        "Built-in motor protection (49, 50/51)",
      ],
      fit: "Lower CAPEX than VFD but cannot do variable-speed test.",
      priceKUSD: 260,
    },
    alternates: [
      {
        vendor: "Siemens", model: "SIRIUS 3RW55 + step-up",
        category: "LV soft starter (translated to MV)",
        voltage_kV: "0.4", power_MW: "1.6",
        highlights: ["Torque-control ramp avoids mechanical jolt"],
        priceKUSD: 230,
      },
      {
        vendor: "Schneider Electric", model: "Altistart ATS480",
        category: "LV soft starter",
        voltage_kV: "0.4", power_MW: "1.7",
        highlights: ["Torque-control TCS algorithm; Bluetooth commissioning"],
        priceKUSD: 240,
      },
    ],
  },
  VFD: {
    starter: {
      vendor: "ABB",
      model: "ACS6080",
      category: "MV VFD",
      voltage_kV: "3.0 – 6.6",
      power_MW: "5 – 36",
      topology: "Multilevel VSI, NPC, IGCT",
      highlights: [
        "Active front end → unity input PF, low THD",
        "Direct Torque Control with sensorless speed",
        "Modular cabinet, hot-swappable IGCT stacks",
      ],
      fit: "Recommended primary VFD: native 4 kV output, no extra TX needed.",
      priceKUSD: 350,
    },
    alternates: [
      {
        vendor: "Siemens",
        model: "SINAMICS PERFECT HARMONY GH180",
        category: "MV VFD",
        voltage_kV: "2.3 – 13.8",
        power_MW: "0.3 – 100",
        topology: "Cell-based cascaded H-bridge, 18-pulse",
        highlights: [
          "IEEE-519 compliant (THDi < 4 %)",
          "Sinusoidal output — kind to motor insulation",
          "Cell-bypass on single-cell failure",
        ],
        priceKUSD: 380,
      },
      {
        vendor: "Schneider Electric",
        model: "Altivar Process ATV6100 / Altivar 1200",
        category: "MV VFD",
        voltage_kV: "2.4 – 11",
        power_MW: "0.3 – 10",
        topology: "Multilevel cascaded H-bridge",
        highlights: [
          "EcoStruxure-ready, native Modbus / PROFINET / EtherNet/IP",
          "Built-in test mode — useful for the workshop application",
        ],
        priceKUSD: 360,
      },
      {
        vendor: "ABB", model: "ACS5000",
        category: "MV VFD (alternate ABB)",
        voltage_kV: "6.0 – 6.9", power_MW: "1.7 – 36",
        topology: "Five-level fuseless, water/air cooled",
        highlights: ["12-pulse diode rectifier", "Air-cooled option"],
        priceKUSD: 410,
      },
    ],
  },
};

/* ── Reference equipment shared by every method ────────────────────────── */

export const REFERENCE_TRANSFORMERS: VendorProduct[] = [
  {
    vendor: "ABB",
    model: "DTR Distribution Transformer",
    category: "Step-up transformer",
    rating: "1 – 5 MVA, 0.4 / 4 kV, Dyn11, ONAN, %Z = 6%",
    highlights: ["Mineral-oil filled hermetically sealed", "Buchholz, oil-temp, pressure-relief", "IEC 60076 design"],
    priceKUSD: 48,
  },
  {
    vendor: "Siemens",
    model: "GEAFOL Cast-Resin",
    category: "Dry-type transformer",
    rating: "1 – 4 MVA, 0.4 / 4 kV, Dyn11, AN cooling, %Z = 6%",
    highlights: ["Dry, fire-safe — no oil", "Indoor-rated", "20% CAPEX premium vs. oil"],
    priceKUSD: 60,
  },
  {
    vendor: "Schneider Electric",
    model: "Trihal Cast-Resin",
    category: "Dry-type transformer",
    rating: "1 – 4 MVA, 0.4 / 4 kV, Dyn11, %Z = 6%",
    highlights: ["Class F insulation, fire-rated F1", "Low PD — long life on PWM duty"],
    priceKUSD: 58,
  },
];

export const REFERENCE_SWITCHGEAR: VendorProduct[] = [
  {
    vendor: "ABB",
    model: "UniGear ZS1",
    category: "MV switchgear (12 kV)",
    rating: "12 kV, 31.5 kA / 3 s, 1250 / 2500 A",
    highlights: [
      "VD4 vacuum CB, IAC AFLR",
      "REF615 IED with 87M, 27/59, 50/51, 49M",
      "Withdrawable truck",
    ],
    priceKUSD: 70,
  },
  {
    vendor: "Schneider Electric",
    model: "PIX-12",
    category: "MV switchgear (12 kV)",
    rating: "12 kV, 25 kA / 1 s, 1250 A",
    highlights: ["VCB, motor-class C2/E2", "Sepam 50/51, 27, 59, 87M, 49"],
    priceKUSD: 65,
  },
  {
    vendor: "Siemens",
    model: "NXAIR",
    category: "MV switchgear (12 kV)",
    rating: "12 kV, 25 kA / 3 s, 1250 A",
    highlights: ["3AH vacuum CB", "SIPROTEC 7SK85 motor protection"],
    priceKUSD: 68,
  },
];

export const REFERENCE_GENSETS: VendorProduct[] = [
  {
    vendor: "Cummins",
    model: "C2500 D5",
    category: "Diesel genset",
    rating: "2500 kVA, 400 V, 60 Hz, 0.8 PF, Xd″ ≈ 0.18 pu",
    highlights: ["Selected for VFD design", "Loading at run ≈ 72%", "AVR ride-through trivial"],
    priceKUSD: 850,
  },
  {
    vendor: "Caterpillar",
    model: "C32 / SR5",
    category: "Diesel genset (workshop reference)",
    rating: "1000 kVA, 400 V, 60 Hz",
    highlights: ["Existing 1 MVA workshop unit", "Inadequate alone for DOL/SS", "Adequate when paired with VFD"],
    priceKUSD: 380,
  },
];

/** Quick lookup for the recommendation panel. */
export function recommendedDrive(method: StartingMethod): VendorProduct {
  return METHOD_CATALOG[method].starter;
}
