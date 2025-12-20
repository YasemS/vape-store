type DataFastParams = Record<string, any>;

type InitOpts = {
  websiteId: string;
  domain: string;
  allowLocalhost?: boolean;
};

async function init({ websiteId, domain, allowLocalhost }: InitOpts) {
  if (typeof document === "undefined") return;

  const script = document.createElement("script");
  script.defer = true;
  script.setAttribute("data-website-id", websiteId);
  script.setAttribute("data-domain", domain);

  if (allowLocalhost) {
    script.setAttribute("data-allow-localhost", "true");
  }

  script.src = "https://datafa.st/js/script.js";
  document.head.appendChild(script);
}

async function track(event: string, params?: DataFastParams) {
  if (typeof window === "undefined") return;

  const w = window as any;

  w.datafast =
    w.datafast ||
    function () {
      w.datafast.q = w.datafast.q || [];
      w.datafast.q.push(arguments);
    };

  w.datafast(event, params);
}

export default {
  init,
  track,
};
