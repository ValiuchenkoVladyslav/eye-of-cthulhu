import { array, coerce, hex, NEVER, object, string, url } from "zod/v4";

export { prettifyError } from "zod/v4";

export const signUpDto = object({
   username: string().trim().min(3).max(14),
   password: string().trim().min(8).max(120),
   invite: hex(),
});

export const signInDto = signUpDto.omit({ invite: true });

export const createServiceDto = object({
   name: string().trim().min(1).max(120),
});

const idDto = coerce.number().int().nonnegative();

export const deleteServiceDto = object({
   serviceId: idDto,
});

export const serviceWebhookHeaderDto = object({
   key: string().trim().min(1).max(120),
   value: string().trim().min(1).max(600),
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
   url: url(),
   headers: serviceWebhookHeadersJsonDto,
});

export const deleteServiceWebhookDto = object({
   webhookId: idDto,
});
