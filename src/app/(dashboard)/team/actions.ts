"use server";

import { userAuth } from "~/auth";
import { User } from "~/db";

export async function getMembers() {
   await userAuth();

   return User.getAll().map((user) => ({ ...user }));
}
