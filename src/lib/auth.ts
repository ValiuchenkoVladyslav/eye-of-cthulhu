import "server-only";

// quantum computers will break all asymmetric cryptography soon
// while for chacha you still have to exhaust large search space
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { cookies, headers } from "next/headers";
import { int, object, type output, string } from "zod/v4";
import { Text } from "~/lib/text";

if (!process.env.TOKEN_SK) {
   throw new Error("Missing TOKEN_SK");
}

const sk = Uint8Array.fromHex(process.env.TOKEN_SK);
if (sk.length !== 32) {
   throw new Error("Invalid TOKEN_SK length");
}

const claimsSchema = object({
   name: string(),
   untilMs: int(),
});

export function issueSinkToken(name: string, untilMs: number) {
   const nonce = crypto.getRandomValues(new Uint8Array(24));

   const claims = JSON.stringify({
      name,
      untilMs,
   } satisfies output<typeof claimsSchema>);

   const raw = xchacha20poly1305(sk, nonce).encrypt(Text.encode(claims));

   return new Uint8Array([...nonce, ...raw]).toHex();
}

function decodeToken(token: string) {
   try {
      const arr = Uint8Array.fromHex(token);

      const claimsRaw = xchacha20poly1305(sk, arr.slice(0, 24)).decrypt(
         arr.slice(24),
      );

      const claims = claimsSchema.parse(JSON.parse(Text.decode(claimsRaw)));
      if (Date.now() >= claims.untilMs) {
         return null;
      }

      return claims;
   } catch {
      return null;
   }
}

export async function authCtx() {
   const [header, cookie] = await Promise.all([headers(), cookies()]);

   // cookie for dashboard auth
   const authCookie = cookie.get("Authorization");
   if (authCookie) {
      return decodeToken(authCookie.value);
   }

   // header for sink auth
   const authHeader = header.get("Authorization");
   if (authHeader) {
      return decodeToken(authHeader);
   }

   return null;
}
