ALTER TABLE "inventory_movement" RENAME COLUMN "idProduct" TO "id_product";--> statement-breakpoint
ALTER TABLE "inventory_movement" RENAME COLUMN "idUser" TO "id_user";--> statement-breakpoint
ALTER TABLE "inventory_movement" DROP CONSTRAINT "inventory_movement_idProduct_product_id_fk";
--> statement-breakpoint
ALTER TABLE "inventory_movement" DROP CONSTRAINT "inventory_movement_idUser_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_id_product_product_id_fk" FOREIGN KEY ("id_product") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_id_user_user_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
