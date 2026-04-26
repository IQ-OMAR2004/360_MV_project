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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? "shadow-[0_2px_0_rgba(235,27,38,0.6)]" : ""} bg-black`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-[70px]">

        {/* Logo */}
        <a href="#top" className="flex items-center gap-3 group">
          <span className="flex items-center justify-center w-8 h-8 bg-[#EB1B26] font-black text-white text-xs tracking-widest">
            EE
          </span>
          <span className="font-display font-black text-white text-sm tracking-[0.18em] uppercase">
            EE<span className="text-[#EB1B26]">360</span> / 252
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#recommendation"
          className="hidden lg:inline-flex btn-red text-xs shadow-[0_0_20px_rgba(235,27,38,0.4)]"
        >
          Final Verdict <span aria-hidden>→</span>
        </a>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="lg:hidden p-2 flex flex-col gap-[5px]"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-4 h-0.5 bg-[#EB1B26] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[#0D1117] border-t-2 border-[#EB1B26]">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="border-b border-[#1B2026]">
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:bg-[#EB1B26]/10"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="p-4">
              <a href="#recommendation" onClick={() => setOpen(false)} className="btn-red w-full justify-center">
                Final Verdict →
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
