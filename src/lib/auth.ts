import "server-only";

// quantum computers will break all asymmetric cryptography soon
// while for chacha you still have to exhaust large search space
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { os } from "@orpc/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { int, object, type output, string } from "zod/v4";

import { env } from "~/env";
import { Text } from "~/text";

const claimsSchema = object({
   name: string(),
   untilMs: int(),
});

export function issueToken(name: string, untilMs: number) {
   const nonce = crypto.getRandomValues(new Uint8Array(24));

   const claims = JSON.stringify({
      name,
      untilMs,
   } satisfies output<typeof claimsSchema>);

   const raw = xchacha20poly1305(env.AUTH_SK, nonce).encrypt(
      Text.encode(claims),
   );

   return new Uint8Array([...nonce, ...raw]).toHex();
}

function decodeToken(token: string) {
   try {
      const arr = Uint8Array.fromHex(token);

      const claimsRaw = xchacha20poly1305(
         env.AUTH_SK,
         arr.slice(0, 24),
      ).decrypt(arr.slice(24));

      const claims = claimsSchema.parse(JSON.parse(Text.decode(claimsRaw)));
      if (Date.now() >= claims.untilMs) {
         return null;
      }

      return claims;
   } catch {
      return null;
   }
}

export async function userAuth() {
   const cookie = await cookies();

   const authCookie = cookie.get("Authorization");
   if (!authCookie) {
      redirect("/sign-in");
   }

   const claims = decodeToken(authCookie.value);
   if (!claims) {
      redirect("/sign-in");
   }

   return claims;
}

export async function setUserAuth(name: string) {
   const cookie = await cookies();

   const exp = Date.now() + 1000 * 60 * 60 * 3;

   cookie.set("Authorization", issueToken(name, exp), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: exp,
   });
}

export const pos = os
   .errors({
      UNAUTHORIZED: {},
   })
   .use(async ({ errors, next }) => {
      const header = await headers();

      const token = header.get("Authorization");
      if (!token) {
         throw errors.UNAUTHORIZED();
      }

      const claims = decodeToken(token);
      if (!claims) {
         throw errors.UNAUTHORIZED();
      }

      return next({
         context: {
            sink: claims.name,
         },
      });
   });
