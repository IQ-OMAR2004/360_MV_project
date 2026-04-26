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
  variant?: "dark" | "red" | "darker";
}

const variantClass: Record<NonNullable<SectionProps["variant"]>, string> = {
  dark:   "bg-black",
  darker: "bg-[#0D1117]",
  red:    "section-red bg-[#EB1B26]",
};

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  align = "left",
  variant = "dark",
}: SectionProps) {
  const bg = variantClass[variant];

  return (
    <section id={id} className={`relative py-24 lg:py-32 px-6 lg:px-12 ${bg} ${className}`}>
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
              <div className={`flex items-center gap-3 mb-5 ${align === "center" ? "justify-center" : ""}`}>
                <span className="block w-6 h-[2px] bg-[#EB1B26]" />
                <span
                  className="text-[11px] font-black uppercase tracking-[0.18em]"
                  style={{ color: variant === "red" ? "rgba(255,255,255,0.85)" : "#EB1B26" }}
                >
                  {eyebrow}
                </span>
              </div>
            )}
            {title && (
              <h2
                className="font-display font-black leading-[0.95] tracking-tight text-white"
                style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-5 leading-[1.65]"
                style={{
                  fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                  color: variant === "red" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)",
                }}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionDivider({ dashed = false }: { dashed?: boolean }) {
  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {dashed ? (
          <div className="divider-dashed" />
        ) : (
          <div className="divider-glow" />
        )}
      </div>
    </div>
  );
}
