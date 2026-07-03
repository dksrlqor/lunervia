import Hero from "@/components/home/Hero";
import WhyInvite from "@/components/home/WhyInvite";
import Services from "@/components/home/Services";
import WorkSection from "@/components/home/WorkSection";
import ProcessSection from "@/components/home/ProcessSection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkSection />
      <WhyInvite />
      <Services />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
