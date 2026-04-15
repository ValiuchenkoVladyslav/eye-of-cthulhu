"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { setUserAuth } from "~/auth";
import { db, users } from "~/db";
import { prettifyError, signInDto } from "~/dto";

export async function signIn(_: unknown, form: FormData) {
   const parsed = signInDto.safeParse(Object.fromEntries(form));
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   const user = await db
      .select()
      .from(users)
      .where(eq(users.username, parsed.data.username))
      .then((res) => res.at(0));

   if (!user) {
      return new Error("Invalid credentials");
   }

   const valid = await Bun.password.verify(parsed.data.password, user.password);
   if (!valid) {
      return new Error("Invalid credentials");
   }

   await setUserAuth(parsed.data.username);

   redirect("/");
}
