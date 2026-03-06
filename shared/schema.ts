import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  streamId: text("stream_id").notNull(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  lang: text("lang").notNull(),
  url: text("url").notNull(),
  quality: text("quality").notNull(),
});

export const insertStreamSchema = createInsertSchema(streams).omit({ id: true });

export type InsertStream = z.infer<typeof insertStreamSchema>;
export type Stream = typeof streams.$inferSelect;
