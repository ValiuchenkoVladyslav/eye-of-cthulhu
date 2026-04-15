"use server";

import { redirect } from "next/navigation";
import { setUserAuth } from "~/auth";
import { db, users } from "~/db";
import { prettifyError, signUpDto } from "~/dto";

export async function signUp(_: unknown, form: FormData) {
   const parsed = signUpDto.safeParse(Object.fromEntries(form));
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   const password = await Bun.password.hash(parsed.data.password);

   await db.insert(users).values({
      id: parsed.data.invite,
      username: parsed.data.username,
      password,
   });

   await setUserAuth(parsed.data.username);

   redirect("/");
}
