import type { Metadata } from "next";
import WhyView from "@/components/why/WhyView";

export const metadata: Metadata = {
  title: "루네르비아를 만든 이유",
  description:
    "Lunervia는 디지털 서비스가 사용자의 실제 문제를 더 명확하고 편리하게 해결해야 한다는 생각에서 출발한 소프트웨어 브랜드입니다.",
  alternates: { canonical: "/why" },
};

export default function WhyPage() {
  return <WhyView />;
}
