//! https://orpc.dev/docs/adapters/next

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

import type { Router } from "~/app/api/[[...all]]/router";

declare global {
   var $rpc: Router | undefined;
}

const link = new RPCLink({
   url() {
      return `${location.origin}/`;
   },
});

export const rpc: Router = globalThis.$rpc ?? createORPCClient(link);
