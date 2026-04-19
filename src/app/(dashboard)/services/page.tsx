import { Suspense } from "react";
import { getServices } from "./actions";
import { AddServiceForm } from "./add-service-form";
import { Services } from "./services";

export default function ServicesPage() {
   return (
      <div className="w-full flex flex-col gap-4">
         <section className="bg-sc rounded-xl flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-1">
               <h2 className="text-lg font-semibold">Add service</h2>
               <p className="text-sm opacity-75">
                  Create a service entry for ingest and configure warning/error
                  webhooks.
               </p>
            </div>

            <AddServiceForm />
         </section>

         <section className="flex flex-col gap-3">
            <div>
               <h1 className="text-xl font-semibold">Services</h1>
               <p className="text-sm opacity-75">
                  View all configured services and manage their notification
                  webhooks.
               </p>
            </div>

            <Suspense fallback={<p>loading...</p>}>
               <Services services={getServices()} />
            </Suspense>
         </section>
      </div>
   );
}
