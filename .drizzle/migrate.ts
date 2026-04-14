import { readFile } from "node:fs/promises";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const db = drizzle({
   client: new Pool({
      connectionString: process.env.DB_URL,
   }),
});

const content = await readFile(
   new URL("./migrations.sql", import.meta.url),
   "utf8",
);

const statements = content
   .split("--STATEMENT_BREAKPOINT")
   .map((s) => s.trim())
   .filter((s) => s.length > 0);

for (const statement of statements) {
   console.log("[migration] applying:");
   console.log(statement);
   await db.execute(sql.raw(statement));
}
