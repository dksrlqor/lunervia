/* ============================================================
   LUNERVIA — 구독/결제 로직 (subscription layer)
   ------------------------------------------------------------
   · legacy/lib/subscription.js 를 TypeScript 로 이식. 시그니처 유지.
   · 실제 결제 미연동. Toss Payments / PortOne / Stripe 정기결제를
     서버(서버리스 함수)에 붙일 때 프런트는 이 시그니처만 그대로 쓴다.

   ⚠ 보안 원칙
     - secret key, billingKey 원문, customerKey 매핑 등 민감정보는
       절대 프런트엔드에 두지 않는다. 전부 서버에서만 다룬다.
   ============================================================ */

export const BILLING_CYCLE = Object.freeze({
  MONTHLY: "monthly",
} as const);
export type BillingCycle = (typeof BILLING_CYCLE)[keyof typeof BILLING_CYCLE];

export const SUBSCRIPTION_STATUS = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  CANCELED: "canceled",
} as const);
export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const MODULE_STATUS = Object.freeze({
  AVAILABLE: "available",
  CONTACT: "contact",
} as const);
export type ModuleStatus = (typeof MODULE_STATUS)[keyof typeof MODULE_STATUS];

/** public-safe 한 식별/모드만. secret 은 여기 없음 — 승인은 서버에서. */
export const PAYMENT_PROVIDERS = Object.freeze({
  toss: { id: "toss", label: "Toss Payments", mode: "billing", enabled: false },
  portone: { id: "portone", label: "PortOne", mode: "billing", enabled: false },
  stripe: { id: "stripe", label: "Stripe", mode: "subscription", enabled: false },
} as const);

export interface SubscriptionDraft {
  planId: string;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startedAt: string | null;
  canceledAt: string | null;
  nextBillingDate: string | null;
  customerId: string | null;
  /** 빌링키 원문이 아니라 서버가 돌려줄 토큰의 "자리"만 둔다. */
  paymentMethodToken: string | null;
  lastPaymentStatus: string | null;
  createdAt: string;
}

export function createSubscriptionDraft(
  planId: string,
  opts: { customerId?: string | null } = {},
): SubscriptionDraft {
  return {
    planId,
    billingCycle: BILLING_CYCLE.MONTHLY,
    status: SUBSCRIPTION_STATUS.PENDING,
    startedAt: null,
    canceledAt: null,
    nextBillingDate: null,
    customerId: opts.customerId ?? null,
    paymentMethodToken: null,
    lastPaymentStatus: null,
    createdAt: new Date().toISOString(),
  };
}

/** 라우트가 바뀌어도 호출부는 그대로 — 시그니처 고정. */
export function buildCheckoutUrl(planId: string): string {
  const safe = encodeURIComponent(String(planId || "").trim());
  return `/checkout?plan=${safe}`;
}

export type StatusTone = "ready" | "contact" | "paused" | "muted";

export function getStatusMeta(
  status: string,
  lang: "ko" | "en" = "ko",
): { label: string; tone: StatusTone } {
  const ko: Record<string, { label: string; tone: StatusTone }> = {
    available: { label: "상담 가능", tone: "ready" },
    contact: { label: "문의 후 확정", tone: "contact" },
    active: { label: "이용 중", tone: "ready" },
    paused: { label: "일시 정지", tone: "paused" },
    canceled: { label: "해지됨", tone: "muted" },
    pending: { label: "신청 전", tone: "muted" },
  };
  const en: Record<string, { label: string; tone: StatusTone }> = {
    available: { label: "Open to talk", tone: "ready" },
    contact: { label: "Set after a chat", tone: "contact" },
    active: { label: "Active", tone: "ready" },
    paused: { label: "Paused", tone: "paused" },
    canceled: { label: "Canceled", tone: "muted" },
    pending: { label: "Not started", tone: "muted" },
  };
  const dict = lang === "en" ? en : ko;
  return dict[status] || { label: status, tone: "muted" };
}

export function formatMonthlyPrice(
  mod: { monthlyPrice: number | null; priceLabel?: string },
  lang: "ko" | "en" = "ko",
): string {
  if (mod && typeof mod.monthlyPrice === "number") {
    const won = mod.monthlyPrice.toLocaleString("ko-KR");
    return lang === "en" ? `₩${won} / mo` : `₩${won} / 월`;
  }
  return (mod && mod.priceLabel) || (lang === "en" ? "Monthly" : "월간 결제");
}

export function getPriceLabel(
  mod: { monthlyPrice: number | null; status: string; priceLabel?: string },
  lang: "ko" | "en" = "ko",
): string {
  if (mod && typeof mod.monthlyPrice === "number") {
    return formatMonthlyPrice(mod, lang);
  }
  const labels = {
    ko: { available: "월간 결제", contact: "문의 후 확정" } as Record<string, string>,
    en: { available: "Monthly", contact: "Set after a chat" } as Record<string, string>,
  };
  const dict = labels[lang] || labels.ko;
  return (
    (mod && dict[mod.status]) ||
    (mod && mod.priceLabel) ||
    (lang === "en" ? "Monthly" : "월간 결제")
  );
}

/**
 * [미연동 seam] 정기결제 빌링키 발급/승인은 반드시 서버에서.
 * 연동 시 이 함수 본문을 "서버 엔드포인트 호출"로 바꾸기만 하면 된다.
 */
export async function requestBillingAuthorization(): Promise<never> {
  throw new Error(
    "[subscription] 정기결제 빌링키 발급/승인은 서버에서 처리해야 합니다. " +
      "프런트엔드에서 secret/billingKey 를 다루지 마세요.",
  );
}
