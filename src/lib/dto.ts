import { array, hex, NEVER, object, string } from "zod/v4";

export { prettifyError } from "zod/v4";

export const signUpDto = object({
   username: string().min(3).max(14),
   password: string().min(8).max(120),
   invite: hex(),
});

export const signInDto = signUpDto.omit({ invite: true });

export const createServiceDto = object({
   name: string().trim().min(1).max(120),
});

const idDto = string()
   .regex(/^[1-9]\d*$/)
   .transform((value) => Number(value));

export const deleteServiceDto = object({
   serviceId: idDto,
});

export const serviceWebhookHeaderDto = object({
   key: string().trim().min(1),
   value: string().trim().min(1),
});

export const serviceWebhookHeadersDto = array(serviceWebhookHeaderDto);

const serviceWebhookHeadersJsonDto = string()
   .transform((value, ctx) => {
      try {
         return JSON.parse(value) as unknown;
      } catch {
         ctx.addIssue({
            code: "custom",
            input: value,
            message: "Invalid headers",
         });

         return NEVER;
      }
   })
   .pipe(serviceWebhookHeadersDto);

export const addServiceWebhookDto = object({
   serviceId: idDto,
   url: string().trim().url(),
   headers: serviceWebhookHeadersJsonDto,
});

export const deleteServiceWebhookDto = object({
   webhookId: idDto,
});
