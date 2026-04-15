import "server-only";

import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
   id: text("id").primaryKey(),
   username: text("username").notNull(),
   password: text("password").notNull(),
});

export const guessedStatus = pgEnum("guessed_status", ["busy", "free"]);

export const activityEvents = pgTable("activity_event", {
   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
   sink: text("sink").notNull(),
   source: text("source").notNull(),

   timestamp: timestamp("timestamp").notNull(),

   guessedStatus: guessedStatus("guessed_status"),
   note: text("note"),
});
