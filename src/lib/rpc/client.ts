import "client-only"; // to catch unnecessary roundtrips at build time

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

import type { Router } from "../../app/api/[[...]]/router";

const link = new RPCLink({
   url() {
      return `${location.origin}/`;
   },
});

export const rpc: Router = createORPCClient(link);
