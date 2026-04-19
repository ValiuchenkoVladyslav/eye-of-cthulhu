import type { NextConfig } from "next";

export default {
   output: "standalone",

   // https://github.com/vercel/next.js/discussions/64330
   turbopack: {
      resolveAlias: {
         "../build/polyfills/polyfill-module": "./src/empty-polyfill.js",
         "next/dist/build/polyfills/polyfill-module": "./src/empty-polyfill.js",
      },
   },
} satisfies NextConfig;
