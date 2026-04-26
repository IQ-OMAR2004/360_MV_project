"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

const STANDARDS = [
  {
    code: "IEC 60034",
    title: "Rotating Electrical Machines",
    body:
      "Defines the rated quantities, performance, marking, and testing of induction motors. Used to interpret the AMA 500 nameplate and to specify the no-load test acceptance criteria.",
  },
  {
    code: "IEC 60076",
    title: "Power Transformers",
    body:
      "Governs ratings, vector groups, impedance tolerances, temperature rise, dielectric tests, and inrush behaviour. Drives the 2 MVA Dyn11 6 % Z step-up transformer specification.",
  },
  {
    code: "IEC 62271",
    title: "High-voltage Switchgear & Controlgear",
    body:
      "Sets short-time withstand current, motor-CB classification (C2/E2), insulation level, and internal-arc classification (IAC AFLR) for the 12 kV MV switchgear panel.",
  },
  {
    code: "IEC 61800-4",
    title: "Adjustable Speed Power Drive Systems (MV PDS)",
    body:
      "Specifies medium-voltage drive ratings, environmental conditions, and EMC limits — applied directly to the ABB ACS6080 selection.",
  },
  {
    code: "IEEE-519",
    title: "Harmonic Control in Power Systems",
    body:
      "Limits voltage and current harmonic distortion at the PCC. The ACS6080 active front end and CHB drives meet THDi < 5% at the LV bus.",
  },
  {
    code: "NFPA 70E / IEC 60364",
    title: "Electrical Safety in Workplaces",
    body:
      "Sets arc-flash boundary and PPE category for energised work — informs door interlocks, viewing windows, and remote-racking on the MV cubicle.",
  },
];

export function Standards() {
  return (
    <Section
      id="standards"
      eyebrow="Standards & Compliance"
      title={
        <>
          Built to<br />
          <span className="text-electric glow-text">International Code.</span>
        </>
      }
      subtitle="Every choice cited above is rooted in published standards. The website's calculations and component selections trace back to these documents."
      align="center"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {STANDARDS.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="card p-6"
          >
            <div className="display-number text-electric text-xs uppercase tracking-widest mb-2">
              {s.code}
            </div>
            <h3 className="font-display text-lg text-white mb-2">{s.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
