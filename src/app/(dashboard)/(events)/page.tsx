import { Suspense } from "react";
import type { EventBucketSize } from "~/db/ch";
import { getEventBuckets, getProcessLogs, getRecentIncidents } from "./actions";
import { EventBarChart } from "./event-bar-chart";
import { ProcessLogs } from "./process-logs";
import { RecentIncidents } from "./recent-incidents";

async function EventsChart(props: {
   searchParams: Promise<{
      bucket?: string | string[];
      process?: string | string[];
   }>;
}) {
   const searchParams = await props.searchParams;
   const bucket =
      typeof searchParams.bucket === "string"
         ? searchParams.bucket
         : searchParams.bucket?.[0];
   const bucketSize: EventBucketSize =
      bucket === "day" || bucket === "week" ? bucket : "hour";

   return (
      <EventBarChart
         bucketSize={bucketSize}
         data={getEventBuckets(bucketSize)}
      />
   );
}

async function IncidentsWorkspace(props: {
   searchParams: Promise<{
      bucket?: string | string[];
      process?: string | string[];
   }>;
}) {
   const searchParams = await props.searchParams;
   const selectedProcess =
      typeof searchParams.process === "string"
         ? searchParams.process
         : searchParams.process?.[0];

   return (
      <div className="flex gap-2 h-screen *:h-screen">
         <div className="overflow-y-scroll w-86 bg-sc rounded-xl flex flex-col gap-3 p-3">
            <h1>Recent incidents</h1>

            <RecentIncidents
               incidents={getRecentIncidents()}
               selectedProcess={selectedProcess}
            />
         </div>

         <aside className="flex-1 bg-sc rounded-xl flex flex-col overflow-hidden">
            {selectedProcess ? (
               <ProcessLogs
                  process={selectedProcess}
                  logs={getProcessLogs(selectedProcess)}
               />
            ) : (
               <p className="m-3 opacity-75">
                  Select an incident to open process logs.
               </p>
            )}
         </aside>
      </div>
   );
}

export default function EventsPage(props: {
   searchParams: Promise<{
      bucket?: string | string[];
      process?: string | string[];
   }>;
}) {
   return (
      <div className="w-full flex flex-col gap-2">
         <Suspense fallback={<p>loading...</p>}>
            <EventsChart searchParams={props.searchParams} />
         </Suspense>

         <Suspense fallback={<p>loading...</p>}>
            <IncidentsWorkspace searchParams={props.searchParams} />
         </Suspense>
      </div>
   );
}
