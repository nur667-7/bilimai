import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const reservations = sqliteTable("reservations", { id:text("id").primaryKey(),userHash:text("user_hash").notNull(),day:text("day").notNull(),minute:integer("minute").notNull() }, t=>[index("quota_user_day").on(t.userHash,t.day),index("quota_day").on(t.day),index("quota_user_minute").on(t.userHash,t.minute)]);

