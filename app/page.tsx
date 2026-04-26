import { Hero } from "@/components/Hero";
import { Challenge } from "@/components/Challenge";
import { NameplateDashboard } from "@/components/NameplateDashboard";
import { SingleLineDiagram } from "@/components/SingleLineDiagram";
import { Calculations } from "@/components/Calculations";
import { Simulation } from "@/components/Simulation";
import { StartingMethods } from "@/components/StartingMethods";
import { GeneratorMotorInteraction } from "@/components/GeneratorMotorInteraction";
import { VendorCatalog } from "@/components/VendorCatalog";
import { CapexMatrix } from "@/components/CapexMatrix";
import { Recommendation } from "@/components/Recommendation";
import { Standards } from "@/components/Standards";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/ui/Section";

export default function Page() {
  return (
    <>
      <Hero />
      <SectionDivider />
      <Challenge />
      <SectionDivider />
      <NameplateDashboard />
      <SectionDivider />
      <SingleLineDiagram />
      <SectionDivider />
      <Calculations />
      <SectionDivider />
      <Simulation />
      <SectionDivider />
      <StartingMethods />
      <SectionDivider />
      <GeneratorMotorInteraction />
      <SectionDivider />
      <VendorCatalog />
      <SectionDivider />
      <CapexMatrix />
      <SectionDivider />
      <Recommendation />
      <SectionDivider />
      <Standards />
      <Footer />
    </>
  );
}
