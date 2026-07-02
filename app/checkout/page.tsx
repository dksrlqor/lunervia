import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "상담 신청",
  description:
    "월간 모듈 상담 신청 — 온라인 결제는 아직 열지 않았습니다. Instagram DM으로 범위를 확인한 뒤 시작합니다.",
  robots: { index: false },
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutView />
    </Suspense>
  );
}
