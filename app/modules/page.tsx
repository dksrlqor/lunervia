import type { Metadata } from "next";
import ModulesView from "@/components/modules/ModulesView";

export const metadata: Metadata = {
  title: "월간 모듈",
  description:
    "매월 정해진 범위를 맡기는 구독형 개발 모듈. Starter, Growth, Product, Custom — 프로젝트가 끝나도 사이트는 계속 나아집니다.",
  alternates: { canonical: "/modules" },
};

export default function ModulesPage() {
  return <ModulesView />;
}
