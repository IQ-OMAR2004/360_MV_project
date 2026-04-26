"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Section } from "./ui/Section";
import vendors from "@/data/vendors.json";

type Category = "vfd" | "softStarter" | "transformer" | "switchgear" | "generator";

const CATEGORY_LABEL: Record<Category, string> = {
  vfd:         "MV VFDs",
  softStarter: "Soft Starters",
  transformer: "Transformers",
  switchgear:  "MV Switchgear",
  generator:   "Diesel Gensets",
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
      variant="darker"
      eyebrow="Vendor & Equipment Catalog"
      title={<>Real Models.<br /><span style={{ color: "#EB1B26" }}>Real Prices.</span></>}
      subtitle="Indicative pricing and live model numbers from ABB, Siemens, Schneider Electric, Cummins, and Caterpillar — sourced from current product datasheets."
    >
      {/* Category tabs */}
      <div className="flex flex-wrap gap-0 mb-10 border border-[#1B2026]" style={{ borderRadius: "2px" }}>
        {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-1 min-w-[100px] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] border-r last:border-r-0 border-[#1B2026] transition-all ${
              category === c
                ? "bg-[#EB1B26] text-white"
                : "bg-black text-white/40 hover:text-white hover:bg-[#EB1B26]/10"
            }`}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <motion.article
            key={`${item.vendor}-${item.model}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="bg-[#0D1117] border border-[#1B2026] hover:border-[#EB1B26]/40 transition-colors flex flex-col"
            style={{ borderRadius: "2px" }}
          >
            {/* Vendor header strip */}
            <div className="px-5 py-3 border-b border-[#1B2026] flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.15em] text-[#EB1B26]">
                {item.vendor}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                {item.category}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-display font-black text-lg text-white leading-tight">{item.model}</h3>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {item.voltage_kV && (
                  <div className="bg-black border border-[#1B2026] p-2.5" style={{ borderRadius: "1px" }}>
                    <div className="text-white/35 uppercase font-black tracking-widest text-[9px]">Voltage</div>
                    <div className="display-number text-[#EB1B26] mt-1">{item.voltage_kV} kV</div>
                  </div>
                )}
                {item.power_MW && (
                  <div className="bg-black border border-[#1B2026] p-2.5" style={{ borderRadius: "1px" }}>
                    <div className="text-white/35 uppercase font-black tracking-widest text-[9px]">Power</div>
                    <div className="display-number text-[#EB1B26] mt-1">{item.power_MW} MW</div>
                  </div>
                )}
                {item.rating && (
                  <div className="col-span-2 bg-black border border-[#1B2026] p-2.5" style={{ borderRadius: "1px" }}>
                    <div className="text-white/35 uppercase font-black tracking-widest text-[9px]">Rating</div>
                    <div className="display-number text-[#EB1B26] text-[11px] leading-snug mt-1">{item.rating}</div>
                  </div>
                )}
                {item.topology && (
                  <div className="col-span-2">
                    <div className="text-white/35 uppercase font-black tracking-widest text-[9px] mb-1">Topology</div>
                    <div className="text-white/65 text-xs">{item.topology}</div>
                  </div>
                )}
              </div>

              {item.highlights && (
                <ul className="mt-4 space-y-1.5">
                  {item.highlights.map((h) => (
                    <li key={h} className="text-sm text-white/60 flex gap-2">
                      <span className="text-[#EB1B26] mt-0.5 flex-shrink-0">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-4 border-t border-[#1B2026]">
                {item.fit && <p className="text-[11px] italic text-white/40 mb-2">{item.fit}</p>}
                {item.indicative_price_usd && (
                  <div className="display-number text-[#EB1B26] text-base font-black">
                    {item.indicative_price_usd} USD
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
