import Hero from "@/components/home/Hero";
import WorkSection from "@/components/home/WorkSection";
import CoenaSection from "@/components/home/CoenaSection";
import ContactSection from "@/components/home/ContactSection";

/* 홈 — 아주 단순하게: 히어로, 받아줘(작업), Coena, 문의.
   소개성 콘텐츠(하는 일·프로세스·만든 이유)는 /why 로 통합됐다.
   다크↔라이트 교차: ink → paper → ink → paper → footer(ink). */
export default function Home() {
  return (
    <>
      <Hero />
      <WorkSection />
      <CoenaSection />
      <ContactSection />
    </>
  );
}
