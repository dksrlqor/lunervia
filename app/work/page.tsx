import type { Metadata } from "next";
import WorkView from "@/components/work/WorkView";

export const metadata: Metadata = {
  title: "작업",
  description:
    "운영 중인 서비스와 실제 작업 — 받아줘(Take My Letter), Lunervia Lab.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <WorkView />;
}
