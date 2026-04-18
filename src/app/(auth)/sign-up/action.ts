"use server";

import { redirect } from "next/navigation";

import { setUserAuth } from "~/auth";
import { User } from "~/db";
import { prettifyError, signUpDto } from "~/dto";

export async function signUp(data: unknown) {
   const parsed = signUpDto.safeParse(data);
   if (!parsed.success) {
      return new Error(prettifyError(parsed.error));
   }

   try {
      User.insert({
         inviteCode: parsed.data.invite,
         username: parsed.data.username,
         password: await Bun.password.hash(parsed.data.password),
      });
   } catch {
      return new Error("Invalid invite or username already taken");
   }

   await setUserAuth(parsed.data.username);

   redirect("/");
}
