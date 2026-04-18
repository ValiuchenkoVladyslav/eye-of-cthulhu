export async function register() {
   if (typeof window !== "undefined") {
      return;
   }

   console.log("[instrumentation.ts] setting up dbs");
   const db = await import("~/db");

   db.migrateDb();
   try {
      db.Invite.create((await import("~/env")).env.ROOT_INVITE);
   } catch {
      console.log("[instrumentation.ts] root invite creation skipped");
   }

   await (await import("~/db/ch")).migrateCh();

   console.log("[instrumentation.ts] set up dbs");
}
