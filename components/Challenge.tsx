"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

const CONCERNS = [
  {
    icon: "⚡",
    title: "10× Voltage Mismatch",
    body: "Source bus is 400 V; the motor demands 4 000 V. A step-up transformer is mandatory — sizing and impedance directly drive starting performance.",
  },
  {
    icon: "🔥",
    title: "Inrush Onto a Small Genset",
    body: "DOL inrush ≈ 1 566 A on the MV side. A typical 1 000 kVA workshop genset would collapse — voltage dip > 50%. The design must prevent this.",
  },
  {
    icon: "📐",
    title: "AVR & Frequency Stability",
    body: "Diesel AVR/governor must ride through transformer magnetising inrush AND motor starting kVA — without dropping the field or stalling the engine.",
  },
  {
    icon: "🛡️",
    title: "MV Switchgear & Protection",
    body: "Switchgear must withstand the MV bus short-circuit level (≈ 6 kA), with full 50/51, 27, 59, 87M, 49 protection coordinated with the LV side.",
  },
  {
    icon: "🧪",
    title: "Test-bay Use Case",
    body: "The motor is being commissioned: only short, repeatable starts and a no-load run. Variable-speed capability is a major plus for diagnostics.",
  },
  {
    icon: "💰",
    title: "CAPEX vs. Capability",
    body: "The right choice trades capital cost (≈ $0.5–0.6 M) against installation complexity, generator stress, and long-term test flexibility.",
  },
];

export function Challenge() {
  return (
    <Section
      id="challenge"
      variant="red"
      eyebrow="The Challenge"
      title={
        <>
          A 400 V source.<br />
          A 4 kV motor.<br />
          A workshop in between.
        </>
      }
      subtitle="The workshop owns a 1.551 MW MV induction motor but only a 400 V diesel generator. Six engineering concerns drive every design choice that follows."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONCERNS.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="bg-black/25 border border-white/20 p-6 hover:bg-black/35 transition-colors"
            style={{ borderRadius: "2px" }}
          >
            <div className="text-2xl mb-3">{c.icon}</div>
            <h3 className="font-display font-black text-white text-lg mb-2">{c.title}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
