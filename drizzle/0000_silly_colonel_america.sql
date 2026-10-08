CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_hash` text NOT NULL,
	`day` text NOT NULL,
	`minute` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quota_user_day` ON `reservations` (`user_hash`,`day`);--> statement-breakpoint
CREATE INDEX `quota_day` ON `reservations` (`day`);--> statement-breakpoint
CREATE INDEX `quota_user_minute` ON `reservations` (`user_hash`,`minute`);