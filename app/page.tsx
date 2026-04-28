import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { Challenge } from "@/components/Challenge";
import { VendorCatalog } from "@/components/VendorCatalog";
import { Standards } from "@/components/Standards";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/ui/Section";

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
