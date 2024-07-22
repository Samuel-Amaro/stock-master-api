ALTER TABLE "supplier" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "idCategory" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "idSuppliers" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier" DROP COLUMN IF EXISTS "contry";