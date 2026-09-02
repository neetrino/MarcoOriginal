-- Preserve marco.am CUID source IDs on catalog entities (uuid → text)
-- and store lossless snapshot payloads for fingerprint verification.

ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "wishlist_items" DROP CONSTRAINT IF EXISTS "wishlist_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "stock_movements_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "order_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "promotions" DROP CONSTRAINT IF EXISTS "promotions_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "promotions" DROP CONSTRAINT IF EXISTS "promotions_category_id_categories_id_fk";--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT IF EXISTS "media_assets_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT IF EXISTS "media_assets_product_variant_id_product_variants_id_fk";--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT IF EXISTS "media_assets_category_id_categories_id_fk";--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT IF EXISTS "media_assets_brand_id_brands_id_fk";--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT IF EXISTS "media_assets_attribute_value_id_attribute_values_id_fk";--> statement-breakpoint
ALTER TABLE "product_categories" DROP CONSTRAINT IF EXISTS "product_categories_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "product_categories" DROP CONSTRAINT IF EXISTS "product_categories_category_id_categories_id_fk";--> statement-breakpoint
ALTER TABLE "product_brands" DROP CONSTRAINT IF EXISTS "product_brands_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "product_brands" DROP CONSTRAINT IF EXISTS "product_brands_brand_id_brands_id_fk";--> statement-breakpoint
ALTER TABLE "product_variants" DROP CONSTRAINT IF EXISTS "product_variants_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" DROP CONSTRAINT IF EXISTS "product_variant_attribute_values_variant_id_product_variants_id";--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" DROP CONSTRAINT IF EXISTS "product_variant_attribute_values_attribute_value_id_attribute_v";--> statement-breakpoint
ALTER TABLE "attribute_values" DROP CONSTRAINT IF EXISTS "attribute_values_attribute_id_attributes_id_fk";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_parent_id_categories_id_fk";--> statement-breakpoint

ALTER TABLE "products" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "parent_id" SET DATA TYPE text USING "parent_id"::text;--> statement-breakpoint
ALTER TABLE "brands" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "attributes" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "attribute_values" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "attribute_values" ALTER COLUMN "attribute_id" SET DATA TYPE text USING "attribute_id"::text;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ALTER COLUMN "variant_id" SET DATA TYPE text USING "variant_id"::text;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ALTER COLUMN "attribute_value_id" SET DATA TYPE text USING "attribute_value_id"::text;--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "product_categories" ALTER COLUMN "category_id" SET DATA TYPE text USING "category_id"::text;--> statement-breakpoint
ALTER TABLE "product_brands" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "product_brands" ALTER COLUMN "brand_id" SET DATA TYPE text USING "brand_id"::text;--> statement-breakpoint
ALTER TABLE "media_assets" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "media_assets" ALTER COLUMN "product_variant_id" SET DATA TYPE text USING "product_variant_id"::text;--> statement-breakpoint
ALTER TABLE "media_assets" ALTER COLUMN "category_id" SET DATA TYPE text USING "category_id"::text;--> statement-breakpoint
ALTER TABLE "media_assets" ALTER COLUMN "brand_id" SET DATA TYPE text USING "brand_id"::text;--> statement-breakpoint
ALTER TABLE "media_assets" ALTER COLUMN "attribute_value_id" SET DATA TYPE text USING "attribute_value_id"::text;--> statement-breakpoint
ALTER TABLE "cart_items" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "wishlist_items" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "stock_movements" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "promotions" ALTER COLUMN "product_id" SET DATA TYPE text USING "product_id"::text;--> statement-breakpoint
ALTER TABLE "promotions" ALTER COLUMN "category_id" SET DATA TYPE text USING "category_id"::text;--> statement-breakpoint

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "source_export" jsonb;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "source_export" jsonb;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "source_export" jsonb;--> statement-breakpoint
ALTER TABLE "attributes" ADD COLUMN IF NOT EXISTS "source_export" jsonb;--> statement-breakpoint

ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_variant_id_product_variants_id" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_attribute_value_id_attribute_v" FOREIGN KEY ("attribute_value_id") REFERENCES "public"."attribute_values"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_brands" ADD CONSTRAINT "product_brands_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_brands" ADD CONSTRAINT "product_brands_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_attribute_value_id_attribute_values_id_fk" FOREIGN KEY ("attribute_value_id") REFERENCES "public"."attribute_values"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;
