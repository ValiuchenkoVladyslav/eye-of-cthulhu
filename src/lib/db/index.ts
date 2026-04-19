import "server-only";

import { Database } from "bun:sqlite";
import { env } from "~/env";

const db = new Database(env.DB_URL, { strict: true });

export function migrateDb() {
   db.run(`
      PRAGMA journal_mode = DELETE;
      PRAGMA synchronous = NORMAL;
      PRAGMA temp_store = MEMORY;
      PRAGMA cache_size = 30000;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS Invite (
         code TEXT PRIMARY KEY
      ) STRICT, WITHOUT ROWID;

      CREATE TABLE IF NOT EXISTS User (
         id INTEGER PRIMARY KEY AUTOINCREMENT,

         inviteCode TEXT NOT NULL,
         username TEXT NOT NULL UNIQUE CHECK(length(username) > 2),
         password TEXT NOT NULL,

         FOREIGN KEY (inviteCode) REFERENCES Invite(code)
      ) STRICT;

      CREATE TABLE IF NOT EXISTS Session (
         id TEXT PRIMARY KEY,
         expiresAt TEXT NOT NULL,
         userId INTEGER NOT NULL,

         FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
      ) STRICT, WITHOUT ROWID;

      CREATE TABLE IF NOT EXISTS Service (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         ingestToken TEXT NOT NULL UNIQUE
      ) STRICT;
   `);
}

export class Invite {
   code!: string;

   static create(code?: string) {
      const inviteCode =
         code ?? crypto.getRandomValues(new Uint8Array(32)).toHex();

      return db
         .query("INSERT INTO Invite (code) VALUES (?) RETURNING *")
         .as(Invite)
         .get(inviteCode);
   }

   static delete(code: string) {
      return db.prepare("DELETE FROM Invite WHERE code = ?").run(code);
   }
}

const blake = new Bun.CryptoHasher("blake2b256");

export class User {
   id!: number;
   inviteCode!: string;
   username!: string;
   password!: string;

   static insert(user: Omit<User, "id">) {
      return db
         .query(
            "INSERT INTO User (inviteCode, username, password) VALUES (?, ?, ?) RETURNING *",
         )
         .as(User)
         .get(user.inviteCode, user.username, user.password);
   }

   static getAll() {
      return db.query("SELECT * FROM User").as(User).all();
   }

   static getById(id: number) {
      return db.query("SELECT * FROM User WHERE id = ?").as(User).get(id);
   }

   static getByUsername(username: string) {
      return db
         .query("SELECT * FROM User WHERE username = ?")
         .as(User)
         .get(username);
   }

   static delete(id: number) {
      return db.prepare("DELETE FROM User WHERE id = ?").run(id);
   }
}

export class Session {
   id!: string;
   expiresAt!: string;
   userId!: number;

   static insert(session: Session) {
      const hashed = blake.update(session.id).digest("hex");

      return db
         .query(
            "INSERT INTO Session (id, expiresAt, userId) VALUES (?, ?, ?) RETURNING *",
         )
         .as(Session)
         .get(hashed, session.expiresAt, session.userId);
   }

   static getById(id: string) {
      const hashed = blake.update(id).digest("hex");

      return db
         .query("SELECT * FROM Session WHERE id = ?")
         .as(Session)
         .get(hashed);
   }

   static delete(id: string) {
      const hashed = blake.update(id).digest("hex");

      return db.prepare("DELETE FROM Session WHERE id = ?").run(hashed);
   }
}

export class Service {
   id!: number;
   name!: string;
   ingestToken!: string;

   static insert(service: Omit<Service, "id">) {
      const hashed = blake.update(service.ingestToken).digest("hex");

      return db
         .query(
            "INSERT INTO Service (name, ingestToken) VALUES (?, ?) RETURNING *",
         )
         .as(Service)
         .get(service.name, hashed);
   }

   static getById(id: string) {
      return db.query("SELECT * FROM Service WHERE id = ?").as(Service).get(id);
   }

   static getByIngestToken(token: string) {
      const hashed = blake.update(token).digest("hex");

      return db
         .query("SELECT * FROM Service WHERE ingestToken = ?")
         .as(Service)
         .get(hashed);
   }

   static delete(id: string) {
      return db.prepare("DELETE FROM Service WHERE id = ?").run(id);
   }
}
