CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"translations" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT "media_assets_owner_chk";--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "brand_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "brands_sku_uidx" ON "brands" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "brands_created_idx" ON "brands" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_hy_uidx" ON "brands" USING btree (("translations"->'hy'->>'slug')) WHERE "brands"."translations"->'hy'->>'slug' IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_en_uidx" ON "brands" USING btree (("translations"->'en'->>'slug')) WHERE "brands"."translations"->'en'->>'slug' IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_ru_uidx" ON "brands" USING btree (("translations"->'ru'->>'slug')) WHERE "brands"."translations"->'ru'->>'slug' IS NOT NULL;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_assets_brand_idx" ON "media_assets" USING btree ("brand_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_brand_primary_uidx" ON "media_assets" USING btree ("brand_id") WHERE "media_assets"."brand_id" IS NOT NULL AND "media_assets"."is_primary" = true;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_chk" CHECK ((
        ("media_assets"."upload_status" = 'PENDING'
          AND "media_assets"."product_id" IS NULL
          AND "media_assets"."category_id" IS NULL
          AND "media_assets"."brand_id" IS NULL
          AND "media_assets"."hero_slide_id" IS NULL
          AND "media_assets"."blog_post_id" IS NULL
          AND "media_assets"."reel_id" IS NULL)
        OR ("media_assets"."role" = 'BRANDING' AND "media_assets"."purpose" IS NOT NULL)
        OR (
          ("media_assets"."product_id" IS NOT NULL)::int
          + ("media_assets"."category_id" IS NOT NULL)::int
          + ("media_assets"."brand_id" IS NOT NULL)::int
          + ("media_assets"."hero_slide_id" IS NOT NULL)::int
          + ("media_assets"."blog_post_id" IS NOT NULL)::int
          + ("media_assets"."reel_id" IS NOT NULL)::int
        ) = 1
      ));