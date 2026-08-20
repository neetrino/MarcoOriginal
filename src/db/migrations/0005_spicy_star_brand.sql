CREATE TYPE "public"."product_sales_class" AS ENUM('RETAIL', 'WHOLESALE');--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sales_class" "product_sales_class" DEFAULT 'RETAIL' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "warranty_years" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_warranty_years_chk" CHECK ("products"."warranty_years" IN (0, 1, 2, 3));