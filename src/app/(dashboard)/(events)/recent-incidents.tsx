"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use } from "react";
import type { getRecentIncidents } from "./actions";

export function RecentIncidents(props: {
   incidents: ReturnType<typeof getRecentIncidents>;
   selectedProcess?: string;
}) {
   const incidents = use(props.incidents);
   const pathname = usePathname();
   const searchParams = useSearchParams();

   function getIncidentHref(process: string) {
      const params = new URLSearchParams(searchParams.toString());

      params.set("process", process);

      return `${pathname}?${params.toString()}`;
   }

   return (
      <nav className="flex flex-col gap-2">
         {incidents.length === 0 && <h2>No records.</h2>}

         {incidents.map((incident) => (
            <Link
               key={incident.process}
               href={getIncidentHref(incident.process)}
               className={`flex items-start justify-between gap-3 rounded-lg border p-3 duration-150 ${
                  props.selectedProcess === incident.process
                     ? "border-white/30 bg-white/10"
                     : "border-white/10 hover:border-white/20 hover:bg-white/5"
               }`}
            >
               <div className="min-w-0">
                  <p className="truncate font-medium">{incident.process}</p>
                  <p className="text-sm text-white/65">
                     First {incident.firstTimestamp}
                  </p>
                  <p className="text-sm text-white/65">
                     Last {incident.lastTimestamp}
                  </p>
               </div>

               <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                     incident.type === "error"
                        ? "bg-red-500/15 text-red-300"
                        : "bg-yellow-500/15 text-yellow-200"
                  }`}
               >
                  {incident.type}
               </span>
            </Link>
         ))}
      </nav>
   );
}
