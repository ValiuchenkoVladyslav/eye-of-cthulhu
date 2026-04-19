"use client";

import { useRef } from "react";
import { useFormAction } from "~/hook/use-form-action";
import { createService } from "./actions";

export function AddServiceForm() {
   const formRef = useRef<HTMLFormElement>(null);
   const [submit, res] = useFormAction(async (data) => {
      const result = await createService(data);
      if (!(result instanceof Error)) {
         formRef.current?.reset();
      }

      return result;
   });

   return (
      <>
         <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3">
            <input
               name="name"
               required
               placeholder="service-api"
               className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
            />

            <button
               type="submit"
               className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium hover:bg-white/5 disabled:opacity-50"
            >
               Create service
            </button>
         </form>

         {res instanceof Error ? (
            <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
               {res.message}
            </p>
         ) : (
            res !== undefined && (
               <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3">
                  <p className="text-sm font-medium">
                     Token created for {res.name}
                  </p>
                  <p className="mt-1 text-sm opacity-80">
                     This is the only time the raw ingest token is shown.
                  </p>
                  <code className="mt-3 block overflow-x-auto rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs">
                     {res.ingestToken}
                  </code>
               </div>
            )
         )}
      </>
   );
}
