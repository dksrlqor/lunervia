/* ============================================================
   LUNERVIA — 월간 구독형 "모듈" 데이터 (data layer)
   ------------------------------------------------------------
   · legacy/data/modules.js 를 TypeScript 로 이식.
   · UI 와 분리된 순수 데이터. 화면(app/modules)과 결제 로직
     (lib/subscription.ts)은 이 배열만 바라본다.
   · 가격(monthlyPrice)은 아직 확정 전이라 null. priceLabel 로 상태 표시.
   · 결제 키·secret 같은 민감정보는 여기에 절대 두지 않는다(서버 전용).
   ============================================================ */

import type { ModuleStatus } from "@/lib/subscription";

export interface ModuleCopy {
  summary: string;
  target: string;
  features: string[];
  ctaLabel: string;
}

export interface LunerviaModule {
  planId: string;
  name: string;
  billingCycle: "monthly";
  monthlyPrice: number | null;
  priceLabel: string;
  status: ModuleStatus;
  accent?: boolean;
  i18n: { ko: ModuleCopy; en: ModuleCopy };
}

export const LUNERVIA_MODULES: LunerviaModule[] = [
  {
    planId: "starter",
    name: "Starter Module",
    billingCycle: "monthly",
    monthlyPrice: null,
    priceLabel: "월간 결제",
    status: "available",
    i18n: {
      ko: {
        summary:
          "랜딩과 브랜드 소개처럼 한 페이지로 충분한 사이트를 매월 관리합니다.",
        target: "첫 웹사이트가 필요하거나, 있는 사이트를 안정적으로 유지하고 싶은 분",
        features: [
          "기본 UI 수정과 문구 반영",
          "반응형·깨짐 점검",
          "매월 작은 개선 작업",
          "진행 상황 월간 공유",
        ],
        ctaLabel: "모듈 상담하기",
      },
      en: {
        summary:
          "Monthly care for a one-page site — a landing or brand intro.",
        target: "For a first website, or keeping an existing one steady",
        features: [
          "Basic UI edits and copy updates",
          "Responsive and layout checks",
          "Small monthly improvements",
          "Monthly progress updates",
        ],
        ctaLabel: "Talk about this module",
      },
    },
  },
  {
    planId: "growth",
    name: "Growth Module",
    billingCycle: "monthly",
    monthlyPrice: null,
    priceLabel: "월간 결제",
    status: "available",
    accent: true,
    i18n: {
      ko: {
        summary:
          "이미 있는 사이트를 매월 손봐서 더 읽기 쉽고 신뢰가 가게 만듭니다.",
        target: "사이트는 있지만 문의와 전환이 더 나와야 하는 분",
        features: [
          "UX 개선과 섹션 추가",
          "문의 흐름·CTA 개선",
          "모바일 가독성 정리",
          "개선 우선순위 함께 정리",
        ],
        ctaLabel: "월간 모듈 문의하기",
      },
      en: {
        summary:
          "Refine an existing site each month so it reads clearly and earns trust.",
        target: "For a site that should convert better than it does",
        features: [
          "UX improvements and new sections",
          "Inquiry flow and CTA tuning",
          "Mobile readability cleanup",
          "Shared improvement priorities",
        ],
        ctaLabel: "Ask about the monthly module",
      },
    },
  },
  {
    planId: "product",
    name: "Product Module",
    billingCycle: "monthly",
    monthlyPrice: null,
    priceLabel: "월간 결제",
    status: "available",
    i18n: {
      ko: {
        summary:
          "로그인, 대시보드, 데이터 저장 — 실제 서비스 기능을 매월 만들어 갑니다.",
        target: "아이디어를 작동하는 웹서비스로 만들고 싶은 분",
        features: [
          "로그인·사용자 플로우 구현",
          "대시보드·데이터 저장",
          "프론트엔드 기능 개발",
          "takemyletter.site 같은 자체 서비스 확장",
        ],
        ctaLabel: "이 모듈로 시작하기",
      },
      en: {
        summary:
          "Real service features — login, dashboards, stored data — built month over month.",
        target: "For turning an idea into a working web service",
        features: [
          "Login and user-flow implementation",
          "Dashboards and stored data",
          "Frontend feature development",
          "Own-service growth, like takemyletter.site",
        ],
        ctaLabel: "Start with this module",
      },
    },
  },
  {
    planId: "custom",
    name: "Custom Module",
    billingCycle: "monthly",
    monthlyPrice: null,
    priceLabel: "문의 후 확정",
    status: "contact",
    i18n: {
      ko: {
        summary:
          "정해진 범위를 넘는 작업은 상담으로 범위를 맞춘 뒤 진행합니다.",
        target: "장기 협업, 특수 기능, 사이트 전체 리뉴얼처럼 범위를 먼저 정해야 하는 분",
        features: [
          "별도 프로젝트·장기 협업",
          "특수 기능 개발",
          "브랜드 사이트 전체 리뉴얼",
          "범위·일정은 상담 후 확정",
        ],
        ctaLabel: "상담 후 진행하기",
      },
      en: {
        summary:
          "Work beyond a fixed scope — we shape the scope together first, then begin.",
        target: "For long-term collaboration, special features, or a full site renewal",
        features: [
          "Separate projects and long-term work",
          "Special feature development",
          "Full brand-site renewal",
          "Scope and timeline set after consulting",
        ],
        ctaLabel: "Begin after a consultation",
      },
    },
  },
];

export function getModuleByPlanId(planId: string): LunerviaModule | null {
  return LUNERVIA_MODULES.find((m) => m.planId === planId) || null;
}
