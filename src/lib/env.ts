import "server-only";

import { hex, object, url } from "zod/v4";

const envSchema = object({
   ROOT_INVITE: hex(),

   AUTH_SK: hex()
      .transform(Uint8Array.fromHex)
      .refine((val) => val.length === 32),

   DB_URL: url(),
});

export const env = Object.freeze(envSchema.parse(process.env));
