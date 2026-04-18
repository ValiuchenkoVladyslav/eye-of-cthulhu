import "server-only";

import { createClient } from "@clickhouse/client";
import { env } from "~/env";

const ch = createClient({
   url: env.CH_URL,
   username: env.CH_USER,
   password: env.CH_PASSWORD,
});

export type LogEventType = "log" | "warning" | "error";

export type LogEvent = {
   type: LogEventType;
   timestamp: string;
   message: string;
   process: string;
   source: string;
   tags: string[];
};

export type LogEventCursor = Pick<
   LogEvent,
   "timestamp" | "type" | "process" | "source"
>;

export type IncidentType = Exclude<LogEventType, "log">;

export type Incident = {
   process: string;
   type: IncidentType;
   timestamp: string;
   firstTimestamp: string;
   lastTimestamp: string;
};

export type EventBucketSize = "hour" | "day" | "week";

export type EventBucket = {
   bucket: string;
   label: string;
   warnings: number;
   errors: number;
};

const incidentFilter = {
   all: "eoc.log_events.type IN ('warning', 'error')",
   warning: "eoc.log_events.type = 'warning'",
   error: "eoc.log_events.type = 'error'",
} as const satisfies Record<"all" | IncidentType, string>;

const eventBucketConfig = {
   hour: {
      bucket: "toStartOfHour(timestamp)",
      label: "%d %b %H:00",
      since: "now() - INTERVAL 24 HOUR",
   },
   day: {
      bucket: "toStartOfDay(timestamp)",
      label: "%d %b",
      since: "now() - INTERVAL 14 DAY",
   },
   week: {
      bucket: "toStartOfWeek(timestamp)",
      label: "%d %b",
      since: "now() - INTERVAL 12 WEEK",
   },
} as const satisfies Record<
   EventBucketSize,
   { bucket: string; label: string; since: string }
>;

async function selectRows<T>(
   query: string,
   query_params?: Record<string, unknown>,
): Promise<T[]> {
   const result = await ch.query({
      query,
      format: "JSONEachRow",
      query_params,
   });

   return result.json<T>();
}

export async function migrateCh() {
   await ch.command({ query: "CREATE DATABASE IF NOT EXISTS eoc" });

   await ch.command({
      query: `
         CREATE TABLE IF NOT EXISTS eoc.log_events
            (
               type Enum8(
                  'log' = 1,
                  'warning' = 2,
                  'error' = 3
               ),
               timestamp DateTime,
               hour UInt8 MATERIALIZED toHour(timestamp),
               message String COMMENT 'Arbitary log message produced by process',
               process String COMMENT 'Anything to mark same process within the system, e.g. request id',
               source LowCardinality(String) COMMENT 'Service name',
               tags Array(LowCardinality(String)) COMMENT 'Additional tags to group logs, e.g. version, commit, dev or test environment'
            )
            ENGINE = MergeTree
            PARTITION BY toWeek(timestamp)
            ORDER BY (timestamp, type, process, source)
            SETTINGS index_granularity = 8192;
      `,
   });
}

export async function selectIncidents(
   type: "all" | IncidentType = "all",
   offset?: Date,
) {
   return selectRows<Incident>(
      `
         SELECT
            process,
            type,
            lastTimestamp AS timestamp,
            firstTimestamp,
            lastTimestamp
         FROM (
            SELECT
               process,
               max(type) AS type,
               min(timestamp) AS firstTimestamp,
               max(timestamp) AS lastTimestamp
            FROM eoc.log_events
            WHERE ${incidentFilter[type]}
            GROUP BY process
         )
         ${offset ? "WHERE lastTimestamp < parseDateTimeBestEffort({offset: String})" : ""}
         ORDER BY lastTimestamp DESC, process ASC
      `,
      offset ? { offset: offset.toISOString() } : undefined,
   );
}

export async function selectProcessLogs(process: string) {
   return selectRows<LogEvent>(
      `
         SELECT
            type,
            timestamp,
            message,
            process,
            source,
            tags
         FROM eoc.log_events
         WHERE process = {process: String}
         ORDER BY
            timestamp ASC,
            type ASC,
            source ASC
      `,
      { process },
   );
}

export async function selectEventBuckets(bucketSize: EventBucketSize) {
   const config = eventBucketConfig[bucketSize];

   return selectRows<EventBucket>(
      `
         SELECT
            toString(bucketStart) AS bucket,
            formatDateTime(bucketStart, '${config.label}') AS label,
            warnings,
            errors
         FROM (
            SELECT
               ${config.bucket} AS bucketStart,
               countIf(type = 'warning') AS warnings,
               countIf(type = 'error') AS errors
            FROM eoc.log_events
            WHERE type IN ('warning', 'error')
               AND timestamp >= ${config.since}
            GROUP BY bucketStart
         )
         ORDER BY bucketStart ASC
      `,
   );
}
