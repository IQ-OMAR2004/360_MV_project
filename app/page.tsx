import { Hero } from "@/components/Hero";
import { DashboardLoader } from "@/components/DashboardLoader";
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
      <DashboardLoader />
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
