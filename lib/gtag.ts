// Google Ads (gtag.js) conversion helpers.
// The base tag (AW-17936741119) is loaded site-wide in app/layout.tsx. These
// helpers fire specific conversions and are safe no-ops if gtag is not ready.
// Each conversion is de-duplicated so it can fire only once (see guards).

declare global {
  interface Window {
    dataLayer?: unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

// Public client-side conversion labels (not secrets).
const PURCHASE_SEND_TO = "AW-17936741119/nxj7CPOa7uocEP_l8-hC";
const QUIZ_SEND_TO = "AW-17936741119/L2R7CPaa7uocEP_l8-hC";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gtagEvent(...args: any[]): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false; // base tag not ready; caller may retry
  }
  window.gtag(...args);
  return true;
}

// ── Purchase — fire exactly once per user ($9 one-time lifetime purchase) ──
// Guards: an in-memory set (re-render / poll callback / SPA re-nav) + a
// persistent localStorage marker keyed to the user id (survives refresh, back
// navigation, and repeat visits to /results?success=true).
const firedPurchase = new Set<string>();

export function firePurchaseConversionOnce(userId: string): boolean {
  const key = `citytwin_gads_purchase:${userId}`;
  if (firedPurchase.has(key)) return false;
  try {
    if (localStorage.getItem(key) === "1") {
      firedPurchase.add(key);
      return false;
    }
  } catch {}
  const fired = gtagEvent("event", "conversion", {
    send_to: PURCHASE_SEND_TO,
    value: 9.0,
    currency: "USD",
  });
  if (fired) {
    firedPurchase.add(key);
    try {
      localStorage.setItem(key, "1");
    } catch {}
  }
  return fired;
}

// ── Quiz-completed — fire once per completed quiz ──
// find/page arms a "pending" sessionStorage marker at submit; this fires when
// the free match renders and CONSUMES the marker, so it cannot re-fire on
// re-render or revisit. A new quiz re-arms the marker.
const QUIZ_PENDING_KEY = "citytwin_quiz_conversion_pending";
let firedQuizThisLoad = false;

export function markQuizCompleted(): void {
  try {
    sessionStorage.setItem(QUIZ_PENDING_KEY, "1");
  } catch {}
}

export function fireQuizConversionOnce(): boolean {
  if (firedQuizThisLoad) return false;
  let pending = false;
  try {
    pending = sessionStorage.getItem(QUIZ_PENDING_KEY) === "1";
  } catch {}
  if (!pending) return false;
  const fired = gtagEvent("event", "conversion", { send_to: QUIZ_SEND_TO });
  if (fired) {
    firedQuizThisLoad = true;
    try {
      sessionStorage.removeItem(QUIZ_PENDING_KEY);
    } catch {}
  }
  return fired;
}
