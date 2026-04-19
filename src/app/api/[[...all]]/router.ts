import "server-only";

import type { RouterClient } from "@orpc/server";
import { array, int, object, string, enum as zEnum } from "zod/v4";
import { pos } from "~/auth";
import { insertLogEvents } from "~/db/ch";

const IngestLogEventsInputSchema = array(
   object({
      type: zEnum(["log", "warning", "error"]),
      timestamp: string().min(1),
      message: string().min(1),
      process: string().min(1),
      tags: array(string()),
   }),
);

const IngestLogEventsOutputSchema = object({
   inserted: int().min(0),
   source: string(),
});

export const ingestLogEvents = pos
   .route({
      method: "POST",
      path: "/api/ingest/log-events",
      summary: "Ingest log events",
      description:
         "Inserts a batch of log, warning, and error events into ClickHouse for the authenticated service.",
      successStatus: 200,
      successDescription: "Log events ingested successfully.",
      spec: (current) => ({
         ...current,
         parameters: [
            ...(current.parameters ?? []),
            {
               name: "Authorization",
               in: "header",
               required: true,
               description: "Service ingest token.",
               schema: { type: "string" },
            },
         ],
      }),
   })
   .input(IngestLogEventsInputSchema)
   .output(IngestLogEventsOutputSchema)
   .handler(async ({ context, input }) => {
      const events = input.map((event) => ({
         ...event,
         source: context.service.name,
      }));

      const result = await insertLogEvents(events);

      return {
         ...result,
         source: context.service.name,
      };
   });

export const router = {
   ingestLogEvents,
};

export type Router = RouterClient<typeof router>;
