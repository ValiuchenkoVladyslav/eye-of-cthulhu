import "server-only";

import { createRouterClient } from "@orpc/server";
import { connection } from "next/server";

import { router } from "../../app/api/[[...]]/router";

export const rpc = createRouterClient(router, {
   async context() {
      // force dynamic rendering for everything
      await connection();

      return {};
   },
});
