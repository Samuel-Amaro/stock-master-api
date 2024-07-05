ALTER TABLE "user" ADD COLUMN "idUser" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_idUser_user_id_fk" FOREIGN KEY ("idUser") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
