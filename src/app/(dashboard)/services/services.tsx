"use client";

import { use, useRef, useState } from "react";
import { useFormAction } from "~/hook/use-form-action";
import type { getServices } from "./actions";
import {
   addServiceWebhook,
   deleteService,
   deleteServiceWebhook,
} from "./actions";

type HeaderInput = {
   id: string;
   key: string;
   value: string;
};

type ServicesData = Awaited<ReturnType<typeof getServices>>;

function createHeaderInput(): HeaderInput {
   return {
      id: crypto.randomUUID(),
      key: "",
      value: "",
   };
}

function AddWebhookForm(props: { serviceId: number }) {
   const formRef = useRef<HTMLFormElement>(null);
   const [headers, setHeaders] = useState<HeaderInput[]>([createHeaderInput()]);
   const [submit, res] = useFormAction(async (data) => {
      const result = await addServiceWebhook(data);
      if (result instanceof Error) {
         return result;
      }

      setHeaders([createHeaderInput()]);
      formRef.current?.reset();
   });

   const serializedHeaders = JSON.stringify(
      headers.flatMap((header) => {
         const key = header.key.trim();
         const value = header.value.trim();
         return key && value ? [{ key, value }] : [];
      }),
   );

   return (
      <form
         ref={formRef}
         onSubmit={submit}
         className="flex flex-col gap-3 rounded-lg border border-white/10 p-3"
      >
         <input type="hidden" name="serviceId" value={props.serviceId} />
         <input type="hidden" name="headers" value={serializedHeaders} />

         <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Webhook URL</span>
            <input
               name="url"
               type="url"
               required
               placeholder="https://hooks.example.com/notify"
               className="rounded-lg border border-white/10 bg-transparent px-3 py-2"
            />
         </label>

         <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
               <p className="text-sm font-medium">Headers</p>
               <button
                  type="button"
                  onClick={() =>
                     setHeaders((val) => [...val, createHeaderInput()])
                  }
                  className="rounded-md border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
               >
                  Add header
               </button>
            </div>

            {headers.map((header, index) => (
               <div key={header.id} className="flex gap-2">
                  <input
                     value={header.key}
                     onChange={(event) =>
                        setHeaders((current) =>
                           current.map((item, itemIndex) =>
                              itemIndex === index
                                 ? { ...item, key: event.target.value }
                                 : item,
                           ),
                        )
                     }
                     placeholder="Authorization"
                     className="min-w-0 flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2"
                  />
                  <input
                     value={header.value}
                     onChange={(event) =>
                        setHeaders((current) =>
                           current.map((item, itemIndex) =>
                              itemIndex === index
                                 ? { ...item, value: event.target.value }
                                 : item,
                           ),
                        )
                     }
                     placeholder="Bearer secret"
                     className="min-w-0 flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2"
                  />
                  <button
                     type="button"
                     onClick={() =>
                        setHeaders((current) =>
                           current.length === 1
                              ? [createHeaderInput()]
                              : current.filter((item) => item.id !== header.id),
                        )
                     }
                     className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                  >
                     Remove
                  </button>
               </div>
            ))}
         </div>

         <button
            type="submit"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium hover:bg-white/5 disabled:opacity-50"
         >
            Add webhook
         </button>

         {res instanceof Error && (
            <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
               {res.message}
            </p>
         )}
      </form>
   );
}

function ServiceCard(props: { service: ServicesData[number] }) {
   const [submit] = useFormAction(deleteService);

   return (
      <article className="rounded-xl border border-white/10 bg-sc p-4">
         <div className="flex items-start justify-between gap-3">
            <div>
               <h2 className="text-lg font-semibold">{props.service.name}</h2>
               <p className="text-sm opacity-70">
                  {props.service.webhooks.length} webhook
                  {props.service.webhooks.length === 1 ? "" : "s"}
               </p>
            </div>

            <form onSubmit={submit}>
               <input type="hidden" name="serviceId" value={props.service.id} />

               <button
                  type="submit"
                  className="rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-100 hover:bg-red-500/10"
               >
                  Delete service
               </button>
            </form>
         </div>

         <div className="mt-4 flex flex-col gap-3">
            <div className="rounded-lg border border-white/10 p-3">
               <div className="flex flex-col gap-1">
                  <h3 className="font-medium">Webhook settings</h3>
                  <p className="text-sm opacity-75">
                     Existing webhooks are used for warning and error
                     notifications.
                  </p>
               </div>

               <div className="mt-3 flex flex-col gap-3">
                  {props.service.webhooks.length === 0 && (
                     <p className="text-sm opacity-65">
                        No webhooks configured yet.
                     </p>
                  )}

                  {props.service.webhooks.map((webhook) => (
                     <WebhookCard key={webhook.id} webhook={webhook} />
                  ))}
               </div>
            </div>

            <AddWebhookForm serviceId={props.service.id} />
         </div>
      </article>
   );
}

function DeleteWebhookForm(props: { webhookId: number }) {
   const [submit] = useFormAction(deleteServiceWebhook);

   return (
      <form onSubmit={submit}>
         <input type="hidden" name="webhookId" value={props.webhookId} />

         <button
            type="submit"
            className="rounded-md border border-white/10 px-2 py-1 text-xs hover:bg-white/5"
         >
            Remove
         </button>
      </form>
   );
}

function WebhookCard(props: {
   webhook: ServicesData[number]["webhooks"][number];
}) {
   return (
      <div className="rounded-lg border border-white/10 p-3">
         <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
               <p className="text-sm font-medium">Endpoint</p>
               <code className="mt-1 block overflow-x-auto text-xs opacity-80">
                  {props.webhook.url}
               </code>
            </div>

            <DeleteWebhookForm webhookId={props.webhook.id} />
         </div>

         <div className="mt-3">
            <p className="text-sm font-medium">Headers</p>

            {props.webhook.headers.length === 0 && (
               <p className="mt-1 text-sm opacity-65">No custom headers.</p>
            )}

            {props.webhook.headers.length > 0 && (
               <ul className="mt-2 flex flex-col gap-2">
                  {props.webhook.headers.map((header, index) => (
                     <li
                        // biome-ignore lint/suspicious/noArrayIndexKey: no better way
                        key={`${header.key}:${header.value}:${index}`}
                        className="rounded-md border border-white/10 px-3 py-2 text-sm"
                     >
                        <span className="font-medium">{header.key}</span>:{" "}
                        {header.value}
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </div>
   );
}

export function Services(props: { services: Promise<ServicesData> }) {
   const services = use(props.services);

   if (services.length === 0) {
      return (
         <div className="rounded-xl border border-white/10 bg-sc p-4">
            <p className="opacity-75">No services yet.</p>
         </div>
      );
   }

   return (
      <>
         {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
         ))}
      </>
   );
}
