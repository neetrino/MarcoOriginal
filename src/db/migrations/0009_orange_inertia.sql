CREATE TABLE "product_brands" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_brands" ADD CONSTRAINT "product_brands_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_brands" ADD CONSTRAINT "product_brands_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_brands_uidx" ON "product_brands" USING btree ("product_id","brand_id");--> statement-breakpoint
CREATE INDEX "product_brands_brand_idx" ON "product_brands" USING btree ("brand_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_brands_primary_uidx" ON "product_brands" USING btree ("product_id") WHERE "product_brands"."is_primary" = true;