"use client";

import { use } from "react";
import type { getRecentIncidents } from "./actions";

export function RecentIncidents(props: {
   incidents: ReturnType<typeof getRecentIncidents>;
}) {
   const incident = use(props.incidents);

   return (
      <>
         {incident.length === 0 && <h2>No records.</h2>}

         {incident.map((event) => (
            <div key={event.process}>{JSON.stringify(event)}</div>
         ))}
      </>
   );
}
