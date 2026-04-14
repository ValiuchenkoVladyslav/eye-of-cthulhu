//! https://vercel.com/kb/guide/connection-pooling-with-functions

import "server-only";

import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({
   connectionString: process.env.DB_URL,
   idleTimeoutMillis: 5_000,
});

attachDatabasePool(pool);

export const db = drizzle({
   client: pool,
   schema,
});

export * from "./schema";
