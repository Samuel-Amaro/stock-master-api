ALTER TABLE "category" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "idUser" integer NOT NULL;