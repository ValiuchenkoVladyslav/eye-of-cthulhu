import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

import { router } from "../src/app/api/[[...all]]/router";

const generator = new OpenAPIGenerator({
   schemaConverters: [new ZodToJsonSchemaConverter()],
});

const spec = await generator.generate(router, {
   info: {
      title: "Eye Of Cthulhu API",
      version: "1.0.0",
   },
});

console.log(JSON.stringify(spec, null, 2));
