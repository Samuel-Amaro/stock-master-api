ALTER TABLE "category" RENAME COLUMN "idUser" TO "idUserWhoCreated";--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "idUserWhoUpdated" integer NOT NULL;