import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import WorkSection from "@/components/home/WorkSection";
import ProcessSection from "@/components/home/ProcessSection";
import Philosophy from "@/components/home/Philosophy";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WorkSection />
      <ProcessSection />
      <Philosophy />
      <ContactSection />
    </>
  );
}
