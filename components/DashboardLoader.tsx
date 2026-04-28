"use client";

/**
 * Client-side wrapper for the heavy interactive Dashboard.
 *
 * Why this file exists: in the Next.js 14 App Router you may NOT pass
 *   `ssr: false` to `next/dynamic` from a Server Component
 *   (https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#dynamic-importing).
 *
 * We need ssr:false because the Dashboard subtree is heavy (Recharts,
 * Framer Motion, Zustand store, jsPDF dynamic import, large client
 * computations) and we don't want it prerendered during the static
 * export build that runs on the Ubuntu CI runner.
 *
 * Solution: do the dynamic import here, inside a Client Component.
 * `app/page.tsx` then renders <DashboardLoader /> as a plain child.
 */

import dynamic from "next/dynamic";

const Dashboard = dynamic(
  () => import("./Dashboard").then((m) => m.Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="bg-black px-6 py-24 text-center border-t border-[#1B2026]">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="block w-6 h-[2px] bg-[#EB1B26]" />
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#EB1B26]">
            Loading interactive dashboard…
          </span>
        </div>
        <div className="text-white/40 text-sm font-mono">
          Booting Zustand store · simulation engine · charts.
        </div>
      </div>
    ),
  },
);

export function DashboardLoader() {
  return <Dashboard />;
}
