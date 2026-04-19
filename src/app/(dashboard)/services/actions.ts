"use server";

import { revalidatePath } from "next/cache";

import { userAuth } from "~/auth";
import { Service, ServiceWebhook } from "~/db";
import {
   addServiceWebhookDto,
   createServiceDto,
   deleteServiceDto,
   deleteServiceWebhookDto,
   prettifyError,
} from "~/dto";

type ServiceWebhookHeader = {
   key: string;
   value: string;
};

export async function getServices() {
   await userAuth();

   return Service.getAll().map((service) => ({
      id: service.id,
      name: service.name,
      webhooks: ServiceWebhook.getByServiceId(service.id).map((webhook) => ({
         id: webhook.id,
         serviceId: webhook.serviceId,
         url: webhook.url,
         headers: JSON.parse(webhook.headersJson) as ServiceWebhookHeader[],
      })),
   }));
}

export async function createService(data: unknown) {
   await userAuth();

   const parsed = createServiceDto.safeParse(data);
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   const created = Service.insert({ name: parsed.data.name });

   revalidatePath("/services");

   return created;
}

export async function deleteService(data: unknown) {
   await userAuth();

   const parsed = deleteServiceDto.safeParse(data);
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   Service.delete(parsed.data.serviceId);

   revalidatePath("/services");
}

export async function addServiceWebhook(data: unknown) {
   await userAuth();

   const parsed = addServiceWebhookDto.safeParse(data);
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   const service = Service.getById(parsed.data.serviceId);
   if (!service) {
      return new Error("Service not found");
   }

   ServiceWebhook.insert({
      serviceId: parsed.data.serviceId,
      url: parsed.data.url,
      headersJson: JSON.stringify(parsed.data.headers),
   });

   revalidatePath("/services");
}

export async function deleteServiceWebhook(data: unknown) {
   await userAuth();

   const parsed = deleteServiceWebhookDto.safeParse(data);
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   ServiceWebhook.delete(parsed.data.webhookId);

   revalidatePath("/services");
}
