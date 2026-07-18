import Hero from "@/components/sections/Hero";
import ProofRail from "@/components/sections/ProofRail";
import Builds from "@/components/sections/Builds";
import CasePanel from "@/components/sections/CasePanel";
import Philosophy from "@/components/sections/Philosophy";
import CoenaSection from "@/components/coena/CoenaSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ContactSection from "@/components/sections/ContactSection";

/* 홈 — 하나의 이야기:
   시스템(Hero) → 증거(Proof) → 무엇을(Builds) → 어떻게 증명하나(Case)
   → 왜(Philosophy·라이트) → 제품(Coena) → 방식(Process) → 행동(Contact). */
export default function Home() {
  return (
    <>
      <Hero />
      <ProofRail />
      <Builds />
      <CasePanel />
      <Philosophy />
      <CoenaSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
