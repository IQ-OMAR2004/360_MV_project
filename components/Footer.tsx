"use client";

const TEAM = [
  { name: "Team Member 1", role: "Lead — Electrical Design" },
  { name: "Team Member 2", role: "Calculations & Simulation" },
  { name: "Team Member 3", role: "Vendor Research" },
  { name: "Team Member 4", role: "Documentation & Web" },
];

const STANDARDS_BADGES = ["IEC 60034", "IEC 60076", "IEC 62271", "IEC 61800-4", "IEEE-519"];

export function Footer() {
  return (
    <footer className="relative bg-black border-t-2 border-[#EB1B26] pt-16 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center w-10 h-10 bg-[#EB1B26] font-black text-white text-sm">
                EE
              </span>
              <div>
                <div className="font-display font-black text-xl text-white leading-none">EE360 / Term 252</div>
                <div className="text-[11px] font-black uppercase tracking-[0.15em] text-white/40 mt-0.5">KFUPM Electrical Engineering</div>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-md">
              Medium-Voltage Test Power System for a 4 kV, 1.551 MW ABB induction motor.
              An interactive engineering deliverable replacing a traditional PowerPoint report.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {STANDARDS_BADGES.map((s) => (
                <span key={s}
                  className="display-number text-[9px] font-black tracking-[0.12em] px-2.5 py-1 bg-[#EB1B26]/10 border border-[#EB1B26]/30 text-[#EB1B26]"
                  style={{ borderRadius: "1px" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Course */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26] mb-4">Course</div>
            <ul className="space-y-2 text-sm text-white/55">
              <li><span className="text-white font-black">EE360</span> — Power Systems</li>
              <li>Term 252 · KFUPM</li>
              <li>Electrical Engineering Dept.</li>
              <li>Dhahran, Saudi Arabia</li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26] mb-4">Team</div>
            <ul className="space-y-3">
              {TEAM.map((t) => (
                <li key={t.name}>
                  <div className="text-white font-black text-sm">{t.name}</div>
                  <div className="text-white/40 text-[11px]">{t.role}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1B2026] pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-white/35">
          <span className="font-black tracking-wide uppercase">
            © 2026 KFUPM EE360 Term 252 — Engineering deliverable, not for commercial use.
          </span>
          <span className="display-number tracking-widest">v1.0 · build 252.2</span>
        </div>
      </div>

      {/* Bottom red accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#EB1B26] to-transparent" />
    </footer>
  );
}
