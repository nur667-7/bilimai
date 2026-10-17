import {sqliteTable,text,integer,blob,primaryKey} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('ic_records',{kind:text('kind').notNull(),id:text('id').notNull(),data:text('data').notNull()},t=>[primaryKey({columns:[t.kind,t.id]})]);
export const meta=sqliteTable('ic_meta',{id:text('id').primaryKey(),revision:integer('revision').notNull().default(0),mutationId:text('mutation_id').notNull().default('initial'),seedVersion:integer('seed_version').notNull().default(0)});
export const sessions=sqliteTable('ic_sessions',{tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull(),csrf:text('csrf').notNull(),expires:text('expires').notNull()});
export const files=sqliteTable('ic_files',{id:text('id').primaryKey(),mime:text('mime').notNull(),content:blob('content',{mode:'buffer'}).notNull()});
