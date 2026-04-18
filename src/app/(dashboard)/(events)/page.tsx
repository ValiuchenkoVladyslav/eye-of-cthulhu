import { Suspense } from "react";
import type { EventBucketSize } from "~/db/ch";
import { getEventBuckets, getRecentIncidents } from "./actions";
import { EventBarChart } from "./event-bar-chart";
import { RecentIncidents } from "./recent-incidents";

async function EventsChart(props: {
   searchParams: Promise<{ bucket?: string }>;
}) {
   const searchParams = await props.searchParams;
   const bucketSize: EventBucketSize =
      searchParams.bucket === "day" || searchParams.bucket === "week"
         ? searchParams.bucket
         : "hour";

   return (
      <EventBarChart
         bucketSize={bucketSize}
         data={getEventBuckets(bucketSize)}
      />
   );
}

export default function EventsPage(props: {
   searchParams: Promise<{ bucket?: string }>;
}) {
   return (
      <div className="w-full flex flex-col gap-2">
         <Suspense
            fallback={<div className="bg-sc rounded-xl p-3">loading...</div>}
         >
            <EventsChart searchParams={props.searchParams} />
         </Suspense>

         <h1>Recent incidents</h1>

         <div className="bg-sc rounded-xl flex flex-col gap-2 w-full p-3">
            <Suspense fallback={<p>loading...</p>}>
               <RecentIncidents incidents={getRecentIncidents()} />
            </Suspense>
         </div>
      </div>
   );
}
