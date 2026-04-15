import type { NextConfig } from "next";

export default {
   cacheComponents: true,
   experimental: {
      authInterrupts: true,
      staleTimes: {
         dynamic: 180,
      },
   },

   // https://github.com/vercel/next.js/discussions/64330
   turbopack: {
      resolveAlias: {
         "../build/polyfills/polyfill-module": "./src/empty-polyfill.js",
         "next/dist/build/polyfills/polyfill-module": "./src/empty-polyfill.js",
      },
   },
} satisfies NextConfig;
