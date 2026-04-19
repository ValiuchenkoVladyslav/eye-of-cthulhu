import "server-only";

import { hex, object, string, url } from "zod/v4";

const envSchema = object({
   SITE_ORIGIN: url(),

   ROOT_INVITE: hex(),

   DB_URL: string(),

   CH_URL: url(),
   CH_USER: string(),
   CH_PASSWORD: string(),
});

export const env = Object.freeze(envSchema.parse(process.env));
