import type { Metadata } from "next";
import WhyView from "@/components/why/WhyView";

export const metadata: Metadata = {
  title: "루네르비아를 만든 이유",
  description:
    "왜 만들었는지, 여기 적어 둡니다 — 이름의 뜻, 받아줘를 만들며 배운 것, 일하는 방식, 그리고 앞으로. 루네르비아를 만든 사람이 직접 쓴 글.",
  alternates: { canonical: "/why" },
};

export default function WhyPage() {
  return <WhyView />;
}
