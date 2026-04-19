import "server-only";

import { os } from "@orpc/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { Service, Session, User } from "~/db";

export async function userAuth() {
   const cookie = await cookies();

   const authCookie = cookie.get("Authorization");
   if (!authCookie) {
      redirect("/sign-in");
   }

   const session = Session.getById(authCookie.value);
   if (!session) {
      redirect("/sign-in");
   }

   const untilMs = new Date(session.expiresAt).getTime();
   if (!Number.isFinite(untilMs) || Date.now() >= untilMs) {
      Session.delete(session.id);
      redirect("/sign-in");
   }

   const user = User.getById(session.userId);
   if (!user) {
      console.error("[userAuth] Failed to get user for valid session");
      Session.delete(session.id);
      redirect("/sign-in");
   }

   return {
      name: user.username,
      untilMs,
   };
}

export async function setUserAuth(name: string) {
   const cookie = await cookies();
   const user = User.getByUsername(name);
   if (!user) {
      throw new Error(`User not found: ${name}`);
   }

   const exp = Date.now() + 1000 * 60 * 60 * 3;
   const id = crypto.getRandomValues(new Uint8Array(32)).toHex();

   Session.insert({
      id,
      expiresAt: new Date(exp).toISOString(),
      userId: user.id,
   });

   cookie.set("Authorization", id, {
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

      const service = Service.getByIngestToken(token);
      if (!service) {
         throw errors.UNAUTHORIZED();
      }

      return next({
         context: {
            service,
         },
      });
   });
