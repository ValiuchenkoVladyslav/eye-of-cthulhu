import "server-only";

import type { RouterClient } from "@orpc/server";
// import { pos } from "~/auth";

export const router = {};

export type Router = RouterClient<typeof router>;
