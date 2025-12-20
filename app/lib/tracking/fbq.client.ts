/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-explicit-any */
type FbqFunction = {
  (method: "init", pixelId: string, params?: FbqEventParameters): void;
  (
    method: "track",
    event: FbqStandardEvent,
    parameters?: FbqEventParameters
  ): void;
  (
    method: "trackCustom",
    eventName: string,
    parameters?: FbqEventParameters
  ): void;
};

type FbqStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Search"
  | "AddToCart"
  | "AddToWishlist"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "Schedule"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe";

type FbqEventParameters = Record<string, any>;

declare global {
  interface Window {
    _fbqInitialized?: boolean;
    fbq?: FbqFunction;
    _fbq: any;
  }
}

function init(pixelId: string, params?: FbqEventParameters) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "undefined") return;

  (function (f: Window, b: Document, e: string, v: string) {
    if (f.fbq) return;

    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });

    if (!f._fbq) f._fbq = n;

    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];

    const t = b.createElement(e) as HTMLScriptElement;
    t.async = !0;
    t.src = v;

    const s = b.getElementsByTagName(e)[0] as HTMLScriptElement;
    s.parentNode?.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  window.fbq!("init", pixelId, params);
  window.fbq!("track", "PageView");
}

async function track(event: FbqStandardEvent, params?: FbqEventParameters) {
  if (typeof window === "undefined") return;

  let attempt = 0;

  while (!window.fbq) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    attempt++;

    if (attempt > 10) {
      console.error("Failed to track event", event, params);
      return;
    }
  }

  window.fbq("track", event, params);
}

export default {
  init,
  track,
};
