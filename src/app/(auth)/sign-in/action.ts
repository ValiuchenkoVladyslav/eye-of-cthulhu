"use server";

import { redirect } from "next/navigation";

import { setUserAuth } from "~/auth";
import { User } from "~/db";
import { prettifyError, signInDto } from "~/dto";

export async function signIn(data: unknown) {
   const parsed = signInDto.safeParse(data);
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   const user = User.getByUsername(parsed.data.username);

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
