//! https://orpc.dev/docs/adapters/next

import "server-only";

import { createRouterClient } from "@orpc/server";
import { connection } from "next/server";

import { router } from "~/app/api/[[...all]]/router";

globalThis.$rpc = createRouterClient(router, {
   async context() {
      // force dynamic rendering
      await connection();

      return {};
   },
});
