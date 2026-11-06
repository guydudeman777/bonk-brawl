import { defineConfig, exports } from "cf/config";

export default defineConfig({
  worker: {
    name: "bonk-brawl",
    compatibilityDate: "2026-11-04",
    entrypoint: "./src/index.js",
    observability: { enabled: true },
    // Only the relay path reaches the Worker; everything else is served straight from static assets.
    assets: { runWorkerFirst: ["/ws/*"] },
    exports: {
      Relay: exports.durableObject({ storage: "sqlite" }),
    },
  },
});
