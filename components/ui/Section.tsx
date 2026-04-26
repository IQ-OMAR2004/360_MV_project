"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  align = "left",
}: SectionProps) {
  return (
    <section id={id} className={`relative py-24 lg:py-32 px-6 lg:px-12 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`mb-14 ${align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}`}
          >
            {eyebrow && (
              <div className={`badge bg-electric/10 text-electric border border-electric/20 mb-5 ${align === "center" ? "mx-auto" : ""}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-5 text-lg text-text-secondary leading-relaxed">{subtitle}</p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionDivider() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="divider-glow" />
    </div>
  );
}
