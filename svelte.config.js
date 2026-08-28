import adapter from "@sveltejs/adapter-static";

export const PRERENDER_ENTRIES = [
  "/",
  "/about",
  "/changelog",
  "/licence",
  "/learn",
  "/learn/frameworks",
  "/learn/frameworks/ism",
  "/learn/frameworks/ism/e8",
  "/learn/frameworks/ism/irap",
  "/learn/frameworks/nzism",
  "/learn/frameworks/picerl",
  "/learn/risk",
  "/learn/risk/methodology",
  "/learn/threat",
  "/learn/threat/mitre-attack",
  "/learn/threat/stix-taxii",
  "/learn/vulnerability",
  "/learn/vulnerability/cvss",
  "/learn/vulnerability/epss",
  "/blog",
  "/blog/irap-assessed-not-certified-or-accredited",
  "/blog/rss.xml",
];

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: "404.html",
      strict: true,
    }),
    prerender: {
      crawl: true,
      entries: PRERENDER_ENTRIES,
      handleHttpError: "fail",
      handleMissingId: "fail",
    },
  },
};

export default config;
