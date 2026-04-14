import { os as _os } from "@orpc/server";
import { authCtx } from "~/lib/auth";

export const os = _os
   .errors({
      UNAUTHORIZED: {},
   })
   .use(async ({ errors, next }) => {
      const ctx = await authCtx();
      if (!ctx) {
         throw errors.UNAUTHORIZED();
      }

      return next({
         context: {
            sink: ctx.name,
         },
      });
   });
