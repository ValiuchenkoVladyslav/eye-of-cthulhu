import type { RouterClient } from "@orpc/server";
import { pos } from "~/auth";
import { activityEvents, db } from "~/db";

export const getEvents = pos.handler(async () => {
   const events = await db.select().from(activityEvents);

   return events;
});

export const router = {
   getEvents,
};

export type Router = RouterClient<typeof router>;
