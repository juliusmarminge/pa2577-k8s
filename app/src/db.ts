import { asc, eq, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { randomUUID } from "crypto";

/**
 * Create a typesafe database client, for more complext projects
 * this should be in a separate file and be used to generate migration files.
 *
 * For now we just match the statically one defined in the `mysql/` folder.
 */
export const transcript = mysqlTable("transcript", {
  id: varchar("id", { length: 20 }).primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  processed: boolean("processed").notNull().default(false),
  transcript: text("transcript"),
  createdAt: datetime("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

const db = drizzle(
  createPool({
    user: process.env.MYSQL_USER ?? "root",
    password: process.env.MYSQL_PASSWORD ?? "",
    host: process.env.MYSQL_HOST ?? "localhost",
    database: process.env.MYSQL_DATABASE ?? "default",
  }),
  {
    schema: { transcript },
    mode: "default",
  }
);

/**
 * Query wrappers
 */
export const getAllTranscripts = async () =>
  db
    .select({
      id: transcript.id,
      label: transcript.label,
      processed: transcript.processed,
    })
    .from(transcript)
    .orderBy(asc(transcript.createdAt));

export const getTranscriptById = async (id: string) =>
  db
    .select({
      id: transcript.id,
      label: transcript.label,
      processed: transcript.processed,
      transcript: transcript.transcript,
    })
    .from(transcript)
    .where(eq(transcript.id, id))
    .then((rows) => rows[0]);

export const createTranscript = async (label: string) => {
  const id = randomUUID();
  await db.insert(transcript).values({
    id,
    label,
    processed: false,
  });
  return id;
};
