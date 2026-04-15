import type { NextConfig } from "next";

export default {
   experimental: {
      authInterrupts: true,
   },
} satisfies NextConfig;
