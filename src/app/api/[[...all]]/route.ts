import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";

import { router } from "./router";

const handler = new OpenAPIHandler(router, {
   interceptors: [
      onError((error) => {
         console.error(error);
      }),
   ],
});

async function handle(request: Request) {
   const { response } = await handler.handle(request, {
      prefix: "/api",
   });

   return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handle;
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
