"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

const STANDARDS = [
  { code: "IEC 60034", title: "Rotating Electrical Machines",
    body: "Defines rated quantities, performance, marking, and testing of induction motors. Used to interpret the AMA 500 nameplate and specify the no-load test acceptance criteria." },
  { code: "IEC 60076", title: "Power Transformers",
    body: "Governs ratings, vector groups, impedance tolerances, temperature rise, dielectric tests, and inrush behaviour — drives the 2 MVA Dyn11 6 %Z specification." },
  { code: "IEC 62271", title: "High-voltage Switchgear & Controlgear",
    body: "Sets short-time withstand current, motor-CB class (C2/E2), insulation level, and IAC AFLR classification for the 12 kV MV cubicle." },
  { code: "IEC 61800-4", title: "MV Adjustable Speed Drives",
    body: "Specifies MV drive ratings, environmental conditions, and EMC limits — applied directly to the ABB ACS6080 drive selection." },
  { code: "IEEE 519", title: "Harmonic Control in Power Systems",
    body: "Limits voltage and current THD at the PCC. The ACS6080 active front end achieves THDi < 5% at the LV generator bus." },
  { code: "NFPA 70E", title: "Electrical Safety in Workplaces",
    body: "Sets arc-flash boundary and PPE category for energised work — informs door interlocks, viewing windows, and remote-racking on the MV cubicle." },
];

export function Standards() {
  return (
    <Section
      id="standards"
      variant="darker"
      eyebrow="Standards & Compliance"
      title={<>Built to<br /><span style={{ color: "#EB1B26" }}>International Code.</span></>}
      subtitle="Every component, formula, and design choice ties back to a published standard. No hand-waving."
      align="center"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STANDARDS.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="bg-[#0D1117] border border-[#1B2026] hover:border-[#EB1B26]/40 transition-colors p-6"
            style={{ borderRadius: "2px" }}
          >
            <div className="display-number text-[#EB1B26] text-xs font-black uppercase tracking-widest mb-2">
              {s.code}
            </div>
            <h3 className="font-display font-black text-white text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
