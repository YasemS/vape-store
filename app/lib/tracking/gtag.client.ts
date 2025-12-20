type GtagFunction = {
  (
    method: "event",
    event: GtagStandardEvent,
    parameters?: GtagEventParameters
  ): void;
};

type GtagStandardEvent =
  | "add_payment_info"
  | "add_shipping_info"
  | "add_to_cart"
  | "add_to_wishlist"
  | "begin_checkout"
  | "click"
  | "conversion"
  | "generate_lead"
  | "login"
  | "page_view"
  | "purchase"
  | "refund"
  | "remove_from_cart"
  | "search"
  | "select_content"
  | "select_item"
  | "select_promotion"
  | "set_checkout_option"
  | "share"
  | "sign_up"
  | "timing_complete"
  | "view_cart"
  | "view_item"
  | "view_item_list"
  | "view_promotion"
  | "view_search_results";

type GtagEventParameters = Record<string, any>;

declare global {
  interface Window {
    gtag?: GtagFunction;
    _gtagInitialized?: boolean;
  }
}

function init(gtagId: string) {
  if (typeof window === "undefined") return;
  if (window._gtagInitialized) return;

  const script = document.createElement("script");

  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + gtagId;

  const gtagConfig = document.createElement("script");

  gtagConfig.innerHTML = `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gtagId}');`;

  document.head.appendChild(script);
  document.head.appendChild(gtagConfig);

  window._gtagInitialized = true;
}

async function track(event: GtagStandardEvent, data: GtagEventParameters) {
  let attempt = 0;

  while (!window.gtag) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    attempt++;

    if (attempt > 10) {
      console.error("Failed to track event", event, data);
      return;
    }
  }

  window.gtag("event", event, data);
}

export default {
  init,
  track,
};
