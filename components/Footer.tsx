"use client";

const TEAM = [
  { name: "Team Member 1", role: "Lead — Electrical Design" },
  { name: "Team Member 2", role: "Calculations & Simulation" },
  { name: "Team Member 3", role: "Vendor Research" },
  { name: "Team Member 4", role: "Documentation & Web" },
];

export function Footer() {
  return (
    <footer className="relative pt-20 pb-10 px-6 lg:px-12 border-t border-ink-700 bg-ink-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative inline-flex w-9 h-9 items-center justify-center">
                <span className="absolute inset-0 rounded-md bg-spark-gradient opacity-90 blur-[1px]" />
                <span className="relative text-ink-950 text-sm font-black">EE</span>
              </span>
              <span className="font-display font-bold text-xl text-white">EE360 / Term 252</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md">
              Medium-Voltage Test Power System for a 4 kV, 1.551 MW ABB induction motor.
              An interactive engineering deliverable from the KFUPM Electrical Engineering
              Department.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["IEC 60034", "IEC 60076", "IEC 62271", "IEC 61800-4", "IEEE-519"].map((s) => (
                <span
                  key={s}
                  className="display-number text-[10px] tracking-wider px-2.5 py-1 rounded-full bg-ink-800 border border-ink-600 text-electric/80"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Course */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-text-tertiary mb-3">Course</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <span className="text-white">EE360</span> — Power Systems
              </li>
              <li>Term 252 · KFUPM</li>
              <li>Electrical Engineering Dept.</li>
              <li>Dhahran, Saudi Arabia</li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-text-tertiary mb-3">Team</h4>
            <ul className="space-y-2 text-sm">
              {TEAM.map((t) => (
                <li key={t.name}>
                  <div className="text-white">{t.name}</div>
                  <div className="text-text-tertiary text-xs">{t.role}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-glow mb-6" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-tertiary">
          <span>© 2026 KFUPM EE360 Term 252 Project Team. Engineering deliverable — not for commercial use.</span>
          <span className="display-number">v1.0 · build 252.1</span>
        </div>
      </div>

      {/* glow underline */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-spark-gradient blur-sm" />
    </footer>
  );
}
