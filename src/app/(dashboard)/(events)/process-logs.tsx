"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use } from "react";
import type { getProcessLogs } from "./actions";

function getLogTypeClassName(type: "log" | "warning" | "error") {
   if (type === "error") {
      return "rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300";
   }

   if (type === "warning") {
      return "rounded-full bg-yellow-500/15 px-2 py-1 text-xs font-semibold text-yellow-200";
   }

   return "rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white/75";
}

export function ProcessLogs(props: {
   process: string;
   logs: ReturnType<typeof getProcessLogs>;
}) {
   const logs = use(props.logs);
   const pathname = usePathname();
   const searchParams = useSearchParams();

   function exportJson() {
      const file = new Blob([JSON.stringify(logs, null, 2)], {
         type: "application/json",
      });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${props.process}.json`;
      link.click();

      URL.revokeObjectURL(url);
   }

   function getCloseHref() {
      const nextSearchParams = new URLSearchParams(searchParams.toString());

      nextSearchParams.delete("process");

      const query = nextSearchParams.toString();

      return query.length > 0 ? `${pathname}?${query}` : pathname;
   }

   return (
      <>
         <header className="flex items-start justify-between gap-3 border-b border-white/10 p-3">
            <div className="min-w-0">
               <p className="text-sm text-white/65">Process</p>
               <h2 className="truncate font-semibold">{props.process}</h2>
            </div>

            <div className="flex items-center gap-2">
               <button
                  type="button"
                  onClick={exportJson}
                  className="rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/5"
               >
                  Export JSON
               </button>

               <Link
                  href={getCloseHref()}
                  scroll={false}
                  className="rounded-md border border-white/10 px-2 py-1 text-sm hover:bg-white/5"
               >
                  Close
               </Link>
            </div>
         </header>

         <div className="flex-1 overflow-y-scroll p-3 flex flex-col gap-2">
            {logs.length === 0 && <p>No logs for this process.</p>}

            {logs.map((log) => (
               <div
                  key={`${log.timestamp}:${log.type}:${log.source}:${log.message}`}
                  className="rounded-lg border border-white/10 p-3"
               >
                  <div className="flex items-start justify-between gap-3">
                     <div className="flex gap-2 items-center">
                        <span className={getLogTypeClassName(log.type)}>
                           {log.type}
                        </span>

                        <p className="text-sm text-white/65">
                           At {log.timestamp} in {log.source}
                        </p>
                     </div>

                     <ul className="flex gap-1">
                        {log.tags.map((tag) => (
                           <li
                              key={tag}
                              className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70"
                           >
                              {tag}
                           </li>
                        ))}
                     </ul>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                     {log.message}
                  </p>
               </div>
            ))}
         </div>
      </>
   );
}
