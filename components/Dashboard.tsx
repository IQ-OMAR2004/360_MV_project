"use client";

import { ParameterPanel } from "./ParameterPanel";
import { KPICards } from "./KPICards";
import { SimulationPlots } from "./SimulationPlots";
import { InteractiveSLD } from "./InteractiveSLD";
import { RadarPanel } from "./RadarPanel";
import { AutoRecommendation } from "./AutoRecommendation";
import { ScenarioManager } from "./ScenarioManager";
import { PDFExport } from "./PDFExport";

export function Dashboard() {
  return (
    <section
      id="dashboard"
      className="relative bg-black px-4 lg:px-8 py-12 lg:py-16 border-t border-[#1B2026]"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Title strip */}
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-8 h-[2px] bg-[#EB1B26]" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">
                Interactive Engineering Dashboard
              </span>
            </div>
            <h2 className="font-display font-black text-white leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Move a slider.<br />
              <span style={{ color: "#EB1B26" }}>Watch the system answer.</span>
            </h2>
            <p className="mt-3 text-sm text-white/55 max-w-2xl">
              Every value below is recomputed live from the parameter panel on the left. Drag <span className="text-white font-mono">DOL inrush</span>{" "}from 4× to 8× and watch the genset loading, voltage dip and recommendation react in real time.
            </p>
          </div>
          <PDFExport />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[340px_1fr] gap-5">
          {/* Sidebar — sliders */}
          <ParameterPanel />

          {/* Main column */}
          <div className="space-y-6 min-w-0">
            <KPICards />
            <InteractiveSLD />
            <SimulationPlots />

            <div className="grid lg:grid-cols-2 gap-5">
              <RadarPanel />
              <ScenarioManager />
            </div>

            <AutoRecommendation />
          </div>
        </div>
      </div>
    </section>
  );
}
