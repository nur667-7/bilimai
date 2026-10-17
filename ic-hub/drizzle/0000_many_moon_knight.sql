CREATE TABLE `ic_files` (
	`id` text PRIMARY KEY NOT NULL,
	`mime` text NOT NULL,
	`content` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ic_meta` (
	`id` text PRIMARY KEY NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`mutation_id` text DEFAULT 'initial' NOT NULL,
	`seed_version` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ic_records` (
	`kind` text NOT NULL,
	`id` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`kind`, `id`)
);
--> statement-breakpoint
CREATE TABLE `ic_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`csrf` text NOT NULL,
	`expires` text NOT NULL
);
