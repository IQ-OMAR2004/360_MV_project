"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "challenge", label: "Challenge" },
  { id: "nameplate", label: "Nameplate" },
  { id: "sld", label: "SLD" },
  { id: "calculations", label: "Calculations" },
  { id: "simulation", label: "Simulation" },
  { id: "methods", label: "Methods" },
  { id: "interaction", label: "Gen↔Motor" },
  { id: "vendors", label: "Vendors" },
  { id: "capex", label: "Trade-off" },
  { id: "recommendation", label: "Verdict" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink-950/80 backdrop-blur-xl border-b border-ink-600/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-3 font-display font-bold text-white">
          <span className="relative inline-flex w-7 h-7 items-center justify-center">
            <span className="absolute inset-0 rounded-md bg-spark-gradient opacity-90 blur-[1px]" />
            <span className="relative text-ink-950 text-xs font-black">EE</span>
          </span>
          <span className="text-sm tracking-widest uppercase">EE360 / 252</span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="px-3 py-1.5 text-xs font-medium tracking-wide text-text-secondary hover:text-electric transition-colors uppercase"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#recommendation"
          className="hidden lg:inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-electric text-ink-950 hover:bg-electric-300 transition-colors shadow-glow-electric"
        >
          Final Verdict
          <span aria-hidden>→</span>
        </a>

        <button
          aria-label="Toggle menu"
          className="lg:hidden text-white p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-0.5 bg-electric mb-1.5" />
          <span className="block w-6 h-0.5 bg-electric mb-1.5" />
          <span className="block w-4 h-0.5 bg-electric" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink-600 bg-ink-950/95 backdrop-blur-xl">
          <ul className="flex flex-col p-4 gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm text-text-secondary hover:text-electric"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
