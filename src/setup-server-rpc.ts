//! https://orpc.dev/docs/adapters/next

import "server-only";

import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";

import { router } from "~/app/api/[[...all]]/router";

globalThis.$rpc = createRouterClient(router, {
   async context() {
      // todo validate auth here
      const _reqHeaders = await headers();

      return {};
   },
});
