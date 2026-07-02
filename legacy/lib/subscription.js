/* ============================================================
   LUNERVIA — 구독/결제 로직 (subscription layer)
   ------------------------------------------------------------
   · UI 코드(modules.html / checkout.html)와 분리된 도메인 로직.
   · 지금은 실제 결제 미연동. 나중에 Toss Payments / PortOne / Stripe
     같은 "정기결제(빌링키)" API 를 서버에 붙일 때, 프런트는 이 파일의
     함수 시그니처만 그대로 쓰면 되도록 seam 을 미리 갈라 둔다.

   ⚠ 보안 원칙 (반드시 지킴)
     - secret key, 빌링키(billingKey) 원문, customerKey 매핑 등 민감정보는
       절대 프런트엔드에 두지 않는다. 전부 서버에서만 다룬다.
     - 프런트는 "결제 수단 등록을 서버에 요청" 하고, 서버가 발급·승인한
       결과(상태/토큰 식별자)만 받는다. 아래 createSubscriptionDraft 가
       만드는 draft 에도 원문 키가 아니라 자리표시자(null)만 들어간다.
   ============================================================ */

/** 결제 주기. 현재는 월간만 운용. */
export const BILLING_CYCLE = Object.freeze({
  MONTHLY: "monthly",
});

/** 구독 상태 — 서버가 정기결제 결과로 갱신하는 값. */
export const SUBSCRIPTION_STATUS = Object.freeze({
  PENDING: "pending", // 신청서 작성 / 결제수단 등록 전
  ACTIVE: "active", // 정상 결제 중
  PAUSED: "paused", // 일시 정지
  CANCELED: "canceled", // 해지
});

/** 모듈(상품) 노출 상태 — data/modules.js 의 status 와 짝. */
export const MODULE_STATUS = Object.freeze({
  AVAILABLE: "available", // 바로 상담/신청 가능
  CONTACT: "contact", // 문의 후 범위·가격 확정
});

/**
 * 정기결제 공급자 설정.
 * public-safe 한 값만 둔다(공개돼도 되는 식별/모드). secret 은 여기 없음.
 * 실제 연동 시 storeId 같은 공개 식별자만 채우고, 승인은 서버에서 한다.
 */
export const PAYMENT_PROVIDERS = Object.freeze({
  toss: { id: "toss", label: "Toss Payments", mode: "billing", enabled: false },
  portone: { id: "portone", label: "PortOne", mode: "billing", enabled: false },
  stripe: { id: "stripe", label: "Stripe", mode: "subscription", enabled: false },
});

/**
 * 구독 신청 초안(draft)을 만든다.
 * 실제 결제 전 단계의 "신청서" 모양으로, 서버로 보낼 최소 정보만 담는다.
 * 민감정보(billingKey/secret)는 담지 않는다 — 자리만 null 로 비워 둔다.
 *
 * @param {string} planId
 * @param {{ customerId?: string|null }} [opts]
 * @returns {{
 *   planId: string, billingCycle: string, status: string,
 *   startedAt: string|null, canceledAt: string|null,
 *   nextBillingDate: string|null, customerId: string|null,
 *   paymentMethodToken: string|null, lastPaymentStatus: string|null,
 *   createdAt: string
 * }}
 */
export function createSubscriptionDraft(planId, opts = {}) {
  return {
    planId,
    billingCycle: BILLING_CYCLE.MONTHLY,
    status: SUBSCRIPTION_STATUS.PENDING,
    startedAt: null,
    canceledAt: null,
    nextBillingDate: null,
    customerId: opts.customerId ?? null,
    // 빌링키 원문이 아니라, 서버가 돌려줄 토큰의 "자리"만 둔다.
    paymentMethodToken: null,
    lastPaymentStatus: null,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 체크아웃(결제) 페이지 URL 을 만든다.
 * 지금은 정적 스텁(checkout.html?plan=)이지만, 시그니처가 고정이라
 * 나중에 라우트가 바뀌어도 호출부는 그대로 둘 수 있다.
 * @param {string} planId
 * @returns {string}
 */
export function buildCheckoutUrl(planId) {
  const safe = encodeURIComponent(String(planId || "").trim());
  return `checkout.html?plan=${safe}`;
}

/**
 * 모듈/구독 상태를 화면 라벨로 바꾼다.
 * 색에만 의존하지 않도록 항상 "텍스트 라벨"을 함께 돌려준다.
 * @param {string} status
 * @param {"ko"|"en"} [lang]
 * @returns {{ label: string, tone: "ready"|"contact"|"paused"|"muted" }}
 */
export function getStatusMeta(status, lang = "ko") {
  const ko = {
    available: { label: "상담 가능", tone: "ready" },
    contact: { label: "문의 후 확정", tone: "contact" },
    active: { label: "이용 중", tone: "ready" },
    paused: { label: "일시 정지", tone: "paused" },
    canceled: { label: "해지됨", tone: "muted" },
    pending: { label: "신청 전", tone: "muted" },
  };
  const en = {
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

/**
 * 월간 가격을 화면 문자열로 만든다.
 * monthlyPrice 가 확정(숫자)이면 "₩29,000 / 월" 형태,
 * 아직 null 이면 모듈에 적힌 priceLabel("월간 결제" 등)을 그대로 쓴다.
 * @param {{ monthlyPrice: number|null, priceLabel: string }} mod
 * @param {"ko"|"en"} [lang]
 * @returns {string}
 */
export function formatMonthlyPrice(mod, lang = "ko") {
  if (mod && typeof mod.monthlyPrice === "number") {
    const won = mod.monthlyPrice.toLocaleString("ko-KR");
    return lang === "en" ? `₩${won} / mo` : `₩${won} / 월`;
  }
  return (mod && mod.priceLabel) || (lang === "en" ? "Monthly" : "월간 결제");
}

/**
 * 화면에 쓸 가격 라벨을 언어 안전하게 돌려준다.
 * - monthlyPrice 가 숫자면 "₩29,000 / 월" 형태(formatMonthlyPrice)
 * - 아직 null 이면 모듈 상태(status)에 맞는 라벨을 언어별로 돌려준다.
 *   (데이터의 priceLabel 은 한국어 원문이라 EN 에서 새지 않도록 여기서 매핑)
 * @param {{ monthlyPrice:number|null, status:string, priceLabel?:string }} mod
 * @param {"ko"|"en"} [lang]
 * @returns {string}
 */
export function getPriceLabel(mod, lang = "ko") {
  if (mod && typeof mod.monthlyPrice === "number") {
    return formatMonthlyPrice(mod, lang);
  }
  const labels = {
    ko: { available: "월간 결제", contact: "문의 후 확정" },
    en: { available: "Monthly", contact: "Set after a chat" },
  };
  const dict = labels[lang] || labels.ko;
  return (
    (mod && dict[mod.status]) ||
    (mod && mod.priceLabel) ||
    (lang === "en" ? "Monthly" : "월간 결제")
  );
}

/**
 * [미연동 seam] 결제수단(빌링키) 등록 요청.
 * 정기결제는 빌링키 발급·승인을 반드시 서버에서 처리해야 한다.
 * 프런트에서 직접 부르면 안 되므로, 지금은 명시적으로 막아 둔다.
 * 연동 시: 이 함수 본문을 "서버 엔드포인트 호출"로 바꾸기만 하면 된다.
 * @returns {Promise<never>}
 */
export async function requestBillingAuthorization() {
  throw new Error(
    "[subscription] 정기결제 빌링키 발급/승인은 서버에서 처리해야 합니다. " +
      "프런트엔드에서 secret/billingKey 를 다루지 마세요."
  );
}
