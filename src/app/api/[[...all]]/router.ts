import type { RouterClient } from "@orpc/server";
import { activityEvents, db } from "~/lib/db";
import { os } from "./os";

export const getEvents = os.handler(async () => {
   const events = await db.select().from(activityEvents);

   return events;
});

export const router = {
   getEvents,
};

export type Router = RouterClient<typeof router>;
