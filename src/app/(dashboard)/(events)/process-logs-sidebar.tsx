"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use } from "react";
import type { getProcessLogs } from "./actions";

export function ProcessLogsSidebar(props: {
   process: string;
   logs: ReturnType<typeof getProcessLogs>;
}) {
   const logs = use(props.logs);
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const closeHref = getCloseHref(pathname, searchParams);

   return (
      <aside className="flex-1 bg-sc rounded-xl flex h-fit max-h-[calc(100vh-1rem)] min-h-80 flex-col overflow-hidden">
         <div className="flex items-start justify-between gap-3 border-b border-white/10 p-3">
            <div className="min-w-0">
               <p className="text-sm text-white/65">Process</p>
               <h2 className="truncate font-semibold">{props.process}</h2>
            </div>

            <Link
               href={closeHref}
               className="rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/5"
            >
               Close
            </Link>
         </div>

         <div className="flex-1 overflow-y-auto p-3">
            {logs.length === 0 && <p>No logs for this process.</p>}

            <div className="flex flex-col gap-2">
               {logs.map((log) => (
                  <div
                     key={`${log.timestamp}:${log.type}:${log.source}:${log.message}`}
                     className="rounded-lg border border-white/10 p-3"
                  >
                     <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                           <p className="text-sm text-white/65">
                              {formatTimestamp(log.timestamp)}
                           </p>
                           <p className="text-sm text-white/65">{log.source}</p>
                        </div>

                        <span className={getLogTypeClassName(log.type)}>
                           {log.type}
                        </span>
                     </div>

                     <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                        {log.message}
                     </p>

                     {log.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                           {log.tags.map((tag) => (
                              <span
                                 key={tag}
                                 className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70"
                              >
                                 {tag}
                              </span>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </aside>
   );
}

function getCloseHref(pathname: string, searchParams: { toString(): string }) {
   const nextSearchParams = new URLSearchParams(searchParams.toString());

   nextSearchParams.delete("process");

   const query = nextSearchParams.toString();

   return query.length > 0 ? `${pathname}?${query}` : pathname;
}

function formatTimestamp(timestamp: string) {
   return new Date(timestamp).toLocaleString();
}

function getLogTypeClassName(type: "log" | "warning" | "error") {
   if (type === "error") {
      return "rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300";
   }

   if (type === "warning") {
      return "rounded-full bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-200";
   }

   return "rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white/75";
}
