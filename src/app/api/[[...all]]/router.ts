import { os, type RouterClient } from "@orpc/server";

import { db } from "~/lib/db";
import { activityEvents } from "~/lib/db/schema";

export const getEvents = os.handler(async () => {
   const events = await db.select().from(activityEvents);

   return events;
});

export const router = {
   getEvents,
};

export type Router = RouterClient<typeof router>;
