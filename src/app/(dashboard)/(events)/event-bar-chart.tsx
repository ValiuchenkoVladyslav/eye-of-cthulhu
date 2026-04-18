"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { EventBucketSize } from "~/db/ch";
import type { getEventBuckets } from "./actions";

type EventTypeFilter = "all" | "warning" | "error";

const eventTypeColor = {
   warning: "#eab308",
   error: "#dc2626",
} as const;

export function EventBarChart(props: {
   bucketSize: EventBucketSize;
   data: ReturnType<typeof getEventBuckets>;
}) {
   const data = use(props.data);
   const pathname = usePathname();
   const router = useRouter();
   const searchParams = useSearchParams();
   const [eventType, setEventType] = useState<EventTypeFilter>("all");

   function updateBucketSize(nextBucketSize: EventBucketSize) {
      const nextSearchParams = new URLSearchParams(searchParams.toString());

      nextSearchParams.set("bucket", nextBucketSize);
      nextSearchParams.delete("offset");

      router.replace(`${pathname}?${nextSearchParams.toString()}`);
   }

   function drillDown(bucket: string | undefined) {
      if (!bucket || props.bucketSize === "hour") {
         return;
      }

      const nextSearchParams = new URLSearchParams(searchParams.toString());

      nextSearchParams.set("offset", bucket);
      nextSearchParams.set(
         "bucket",
         props.bucketSize === "week" ? "day" : "hour",
      );

      router.replace(`${pathname}?${nextSearchParams.toString()}`);
   }

   return (
      <div className="bg-sc rounded-xl flex flex-col gap-4 w-full p-3">
         <header className="flex gap-2">
            <div className="bg-bg rounded-md px-3 py-2">
               <select
                  className="bg-bg"
                  value={props.bucketSize}
                  onChange={(event) =>
                     updateBucketSize(event.target.value as EventBucketSize)
                  }
               >
                  <option value="hour">Hour</option>
                  <option value="day">Day</option>
                  <option value="week">Week</option>
               </select>
            </div>

            <div className="bg-bg rounded-md px-3 py-2">
               <select
                  className="bg-bg"
                  value={eventType}
                  onChange={(event) =>
                     setEventType(event.target.value as EventTypeFilter)
                  }
               >
                  <option value="all">Warnings + errors</option>
                  <option value="warning">Warnings</option>
                  <option value="error">Errors</option>
               </select>
            </div>
         </header>

         {data.length === 0 && <p>No events.</p>}

         {data.length > 0 && (
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} barGap={4}>
                     <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        minTickGap={20}
                     />
                     <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                     />

                     {(eventType === "all" || eventType === "error") && (
                        <Bar
                           dataKey="errors"
                           stackId="events"
                           fill={eventTypeColor.error}
                           radius={eventType === "error" ? [4, 4, 0, 0] : 0}
                           cursor={
                              props.bucketSize === "hour"
                                 ? "default"
                                 : "pointer"
                           }
                           onClick={(state) => drillDown(state.payload?.bucket)}
                        />
                     )}

                     {(eventType === "all" || eventType === "warning") && (
                        <Bar
                           dataKey="warnings"
                           stackId="events"
                           fill={eventTypeColor.warning}
                           radius={[4, 4, 0, 0]}
                           cursor={
                              props.bucketSize === "hour"
                                 ? "default"
                                 : "pointer"
                           }
                           onClick={(state) => drillDown(state.payload?.bucket)}
                        />
                     )}
                  </BarChart>
               </ResponsiveContainer>
            </div>
         )}
      </div>
   );
}
