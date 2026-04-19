import "server-only";

import type { RouterClient } from "@orpc/server";
import { array, int, object, string, enum as zEnum } from "zod/v4";
import { pos } from "~/auth";
import { ServiceWebhook } from "~/db";
import { insertLogEvents } from "~/db/ch";
import { env } from "~/env";

type ServiceWebhookHeader = {
   key: string;
   value: string;
};

async function notifyWebhook(webhook: ServiceWebhook, process: string) {
   const url = new URL(env.SITE_ORIGIN);
   url.searchParams.set("process", process);

   const headers = JSON.parse(webhook.headersJson) as ServiceWebhookHeader[];

   const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
         "Content-Type": "text/plain",
         ...Object.fromEntries(
            headers.map((header) => [header.key, header.value]),
         ),
      },
      body: url.toString(),
   });

   if (!response.ok) {
      throw new Error(
         `Webhook responded with status ${response.status} for ${webhook.url}`,
      );
   }
}

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
      const result = await insertLogEvents(
         input.map((event) => ({
            ...event,
            source: context.service.name,
         })),
      );

      const notifyingProcesses = new Set(
         input
            .filter((evt) => evt.type === "warning" || evt.type === "error")
            .map((evt) => evt.process),
      );

      if (notifyingProcesses.size > 0) {
         const webhooks = ServiceWebhook.getByServiceId(context.service.id);
         const processes = [...notifyingProcesses];

         await Promise.all(
            webhooks.flatMap((webhook) =>
               processes.map(async (process) => {
                  try {
                     await notifyWebhook(webhook, process);
                  } catch (error) {
                     console.error(
                        "[ingestLogEvents] Failed to notify webhook",
                        {
                           webhookId: webhook.id,
                           url: webhook.url,
                           process,
                           error,
                        },
                     );
                  }
               }),
            ),
         );
      }

      return {
         ...result,
         source: context.service.name,
      };
   });

export const router = {
   ingestLogEvents,
};

export type Router = RouterClient<typeof router>;
