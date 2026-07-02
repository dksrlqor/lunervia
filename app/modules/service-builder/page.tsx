import type { Metadata } from "next";
import ServiceBuilderView from "@/components/modules/ServiceBuilderView";

export const metadata: Metadata = {
  title: "Service Builder Module",
  description:
    "복붙 프롬프트가 아니라 AI를 위한 작업 시스템. ChatGPT·Claude·Gemini·Cursor에서 일정한 품질의 서비스 진단을 뽑아내는 문서형 모듈.",
  alternates: { canonical: "/modules/service-builder" },
};

export default function ServiceBuilderPage() {
  return <ServiceBuilderView />;
}
