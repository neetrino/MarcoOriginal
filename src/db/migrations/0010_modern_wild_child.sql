CREATE TYPE "public"."product_type" AS ENUM('SIMPLE', 'VARIABLE');--> statement-breakpoint
CREATE TABLE "product_variant_attribute_values" (
	"id" uuid PRIMARY KEY NOT NULL,
	"variant_id" uuid NOT NULL,
	"attribute_value_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" text NOT NULL,
	"price_amount" integer NOT NULL,
	"compare_at_amount" integer,
	"discount_type" "discount_type",
	"discount_value" integer,
	"discount_starts_at" timestamp with time zone,
	"discount_ends_at" timestamp with time zone,
	"stock_on_hand" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_price_nonneg_chk" CHECK ("product_variants"."price_amount" >= 0),
	CONSTRAINT "product_variants_compare_nonneg_chk" CHECK ("product_variants"."compare_at_amount" IS NULL OR "product_variants"."compare_at_amount" >= 0),
	CONSTRAINT "product_variants_stock_nonneg_chk" CHECK ("product_variants"."stock_on_hand" >= 0)
);
--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT "media_assets_owner_chk";--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "product_variant_id" uuid;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_type" "product_type" DEFAULT 'SIMPLE' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_attribute_values" ADD CONSTRAINT "product_variant_attribute_values_attribute_value_id_attribute_values_id_fk" FOREIGN KEY ("attribute_value_id") REFERENCES "public"."attribute_values"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_variant_attribute_values_uidx" ON "product_variant_attribute_values" USING btree ("variant_id","attribute_value_id");--> statement-breakpoint
CREATE INDEX "product_variant_attribute_values_value_idx" ON "product_variant_attribute_values" USING btree ("attribute_value_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_sku_uidx" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_assets_product_variant_idx" ON "media_assets" USING btree ("product_variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_product_variant_uidx" ON "media_assets" USING btree ("product_variant_id") WHERE "media_assets"."product_variant_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_chk" CHECK ((
        ("media_assets"."upload_status" = 'PENDING'
          AND "media_assets"."product_id" IS NULL
          AND "media_assets"."product_variant_id" IS NULL
          AND "media_assets"."category_id" IS NULL
          AND "media_assets"."brand_id" IS NULL
          AND "media_assets"."hero_slide_id" IS NULL
          AND "media_assets"."blog_post_id" IS NULL
          AND "media_assets"."reel_id" IS NULL
          AND "media_assets"."attribute_value_id" IS NULL)
        OR ("media_assets"."role" = 'BRANDING' AND "media_assets"."purpose" IS NOT NULL)
        OR (
          ("media_assets"."product_id" IS NOT NULL)::int
          + ("media_assets"."product_variant_id" IS NOT NULL)::int
          + ("media_assets"."category_id" IS NOT NULL)::int
          + ("media_assets"."brand_id" IS NOT NULL)::int
          + ("media_assets"."hero_slide_id" IS NOT NULL)::int
          + ("media_assets"."blog_post_id" IS NOT NULL)::int
          + ("media_assets"."reel_id" IS NOT NULL)::int
          + ("media_assets"."attribute_value_id" IS NOT NULL)::int
        ) = 1
      ));