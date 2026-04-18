import { Suspense } from "react";
import type { EventBucketSize } from "~/db/ch";
import { getEventBuckets, getProcessLogs, getRecentIncidents } from "./actions";
import { EventBarChart } from "./event-bar-chart";
import { ProcessLogsSidebar } from "./process-logs-sidebar";
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
      <div className="flex gap-2">
         <div className="w-86 bg-sc rounded-xl flex flex-col gap-3 p-3">
            <div>
               <h1>Recent incidents</h1>
               <p className="text-sm text-white/65">
                  Select an incident to inspect every log from that process.
               </p>
            </div>

            <Suspense fallback={<p>loading...</p>}>
               <RecentIncidents
                  incidents={getRecentIncidents()}
                  selectedProcess={selectedProcess}
               />
            </Suspense>
         </div>

         {selectedProcess ? (
            <Suspense
               fallback={
                  <div className="flex-1 bg-sc rounded-xl p-3">loading...</div>
               }
            >
               <ProcessLogsSidebar
                  process={selectedProcess}
                  logs={getProcessLogs(selectedProcess)}
               />
            </Suspense>
         ) : (
            <aside className="flex-1 bg-sc rounded-xl hidden p-3 text-sm text-white/65 xl:block">
               Pick an incident to open the process log sidebar.
            </aside>
         )}
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
