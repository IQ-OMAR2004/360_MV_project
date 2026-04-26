"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/Section";

const CONCERNS = [
  {
    icon: "⚡",
    title: "10× Voltage Mismatch",
    body:
      "Source bus is 400 V; the motor demands 4 000 V. A step-up transformer is mandatory — sizing and impedance directly drive starting performance.",
  },
  {
    icon: "🔥",
    title: "Inrush Onto a Small Genset",
    body:
      "DOL inrush ≈ 1 566 A on the MV side ≈ 15 660 A on the LV side. A typical 1 000 kVA workshop genset would collapse — voltage dip > 50%.",
  },
  {
    icon: "📐",
    title: "AVR & Frequency Stability",
    body:
      "Diesel AVR/governor must ride through transformer magnetising inrush AND motor starting kVA — without dropping out the field or stalling the engine.",
  },
  {
    icon: "🛡️",
    title: "MV Switchgear & Protection",
    body:
      "MV switchgear must withstand the system short-circuit level (≈ 6 kA), and protection (50/51, 27, 59, 87M, 49) must coordinate with the LV side.",
  },
  {
    icon: "🧪",
    title: "Test-bay Use Case",
    body:
      "The motor is being commissioned: only short, repeatable starts and a no-load run. Variable-speed capability is a major plus for diagnostics.",
  },
  {
    icon: "💰",
    title: "CAPEX vs. Capability",
    body:
      "The right choice trades capital cost (≈ $0.4 – 0.6 M) against installation complexity, generator stress, and long-term reliability.",
  },
];

export function Challenge() {
  return (
    <Section
      id="challenge"
      eyebrow="The Challenge"
      title={
        <>
          A 400 V source.
          <br />A <span className="text-electric glow-text">4 kV</span> motor.
          <br />A workshop in between.
        </>
      }
      subtitle="The KFUPM workshop owns a 1.551 MW MV induction motor but only a 400 V diesel generator. Six engineering concerns drive every choice that follows."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONCERNS.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="card p-6 lg:p-7"
          >
            <div className="text-3xl mb-4">{c.icon}</div>
            <h3 className="font-display font-semibold text-lg text-white mb-2">{c.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
