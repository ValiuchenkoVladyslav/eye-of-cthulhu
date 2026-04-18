"use client";

import { useFormAction } from "~/hook/use-form-action";
import { signIn } from "./action";

export default function SignIn() {
   const [submit, err] = useFormAction(signIn);

   return (
      <form onSubmit={submit} className="flex flex-col gap-2">
         <label>
            <span>Username</span>
            <input
               type="text"
               name="username"
               placeholder="Username"
               required
               className="w-full rounded-lg bg-white/10 py-2 px-3"
            />
         </label>

         <label>
            <span>Password</span>
            <input
               type="password"
               name="password"
               placeholder="Password"
               required
               className="w-full rounded-lg bg-white/10 py-2 px-3"
            />
         </label>

         <p hidden={!err} className="text-red-600 whitespace-pre-wrap">
            {err?.message}
         </p>

         <button
            type="submit"
            className="mt-3 py-2 px-3 self-start bg-white text-black font-semibold rounded-lg"
         >
            Sign In
         </button>
      </form>
   );
}
