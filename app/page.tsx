import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { Challenge } from "@/components/Challenge";
import { VendorCatalog } from "@/components/VendorCatalog";
import { Standards } from "@/components/Standards";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/ui/Section";

// Heavy interactive dashboard (Recharts, Framer, Zustand, jsPDF dynamic
// import). Render client-only to keep the static-export prerender light
// and avoid any SSR/window edge-cases on the GitHub Actions runner.
const Dashboard = dynamic(
  () => import("@/components/Dashboard").then((m) => m.Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="bg-black px-6 py-24 text-center">
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#EB1B26] mb-3">
          Loading interactive dashboard…
        </div>
        <div className="text-white/40 text-sm">
          Booting Zustand store + simulation engine.
        </div>
      </div>
    ),
  },
);

export default function Page() {
  return (
    <>
      <Hero />
      <SectionDivider />
      <Dashboard />
      <SectionDivider />
      <Challenge />
      <SectionDivider />
      <VendorCatalog />
      <SectionDivider />
      <Standards />
      <Footer />
    </>
  );
}
