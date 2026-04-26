"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Section } from "./ui/Section";
import vendors from "@/data/vendors.json";

type Category = "vfd" | "softStarter" | "transformer" | "switchgear" | "generator";

const CATEGORY_LABEL: Record<Category, string> = {
  vfd: "MV VFDs",
  softStarter: "Soft Starters",
  transformer: "Transformers",
  switchgear: "MV Switchgear",
  generator: "Diesel Gensets",
};

const VENDOR_BADGE: Record<string, string> = {
  ABB: "bg-red-500/15 text-red-400 border-red-500/30",
  Siemens: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "Schneider Electric": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Caterpillar: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  Cummins: "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

interface Item {
  vendor: string;
  model: string;
  category: string;
  voltage_kV?: string;
  power_MW?: string;
  topology?: string;
  rating?: string;
  highlights?: string[];
  fit?: string;
  indicative_price_usd?: string;
}

export function VendorCatalog() {
  const [category, setCategory] = useState<Category>("vfd");
  const items = (vendors as Record<Category, Item[]>)[category];

  return (
    <Section
      id="vendors"
      eyebrow="Vendor & Equipment Catalog"
      title={
        <>
          Real Models. Real Prices.<br />
          <span className="text-electric glow-text">No Hand-Wave.</span>
        </>
      }
      subtitle="Indicative pricing and live model numbers from ABB, Siemens, Schneider Electric, Cummins, and Caterpillar — sourced from current product datasheets."
    >
      <div className="flex flex-wrap gap-2 mb-8">
        {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition ${
              category === c
                ? "bg-electric text-ink-950 border-electric shadow-glow-electric"
                : "bg-ink-900 text-text-secondary border-ink-600 hover:border-electric/40"
            }`}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.article
            key={`${item.vendor}-${item.model}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="card p-6 flex flex-col"
          >
            <div className={`badge border self-start mb-4 ${VENDOR_BADGE[item.vendor] ?? "bg-ink-900 border-ink-600 text-text-secondary"}`}>
              {item.vendor}
            </div>
            <h3 className="font-display text-lg text-white">{item.model}</h3>
            <p className="text-xs uppercase tracking-widest text-text-tertiary mt-1">
              {item.category}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {item.voltage_kV && (
                <div>
                  <div className="text-text-tertiary uppercase">Voltage</div>
                  <div className="display-number text-electric">{item.voltage_kV} kV</div>
                </div>
              )}
              {item.power_MW && (
                <div>
                  <div className="text-text-tertiary uppercase">Power</div>
                  <div className="display-number text-electric">{item.power_MW} MW</div>
                </div>
              )}
              {item.rating && (
                <div className="col-span-2">
                  <div className="text-text-tertiary uppercase">Rating</div>
                  <div className="display-number text-electric text-[11px] leading-snug">
                    {item.rating}
                  </div>
                </div>
              )}
              {item.topology && (
                <div className="col-span-2">
                  <div className="text-text-tertiary uppercase">Topology</div>
                  <div className="text-text-secondary">{item.topology}</div>
                </div>
              )}
            </div>

            {item.highlights && (
              <ul className="mt-4 space-y-1.5 text-sm">
                {item.highlights.map((h) => (
                  <li key={h} className="text-text-secondary flex gap-2">
                    <span className="text-electric mt-0.5">▸</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto pt-4 border-t border-ink-700">
              {item.fit && (
                <p className="text-xs italic text-text-tertiary mb-2">{item.fit}</p>
              )}
              {item.indicative_price_usd && (
                <div className="display-number text-spark-amber text-sm">
                  {item.indicative_price_usd} USD
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
