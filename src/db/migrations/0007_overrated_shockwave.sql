CREATE TABLE "attribute_values" (
	"id" uuid PRIMARY KEY NOT NULL,
	"attribute_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"color_hex" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attribute_values_kind_chk" CHECK ("attribute_values"."kind" IN ('COLOR', 'IMAGE')),
	CONSTRAINT "attribute_values_payload_chk" CHECK ((
        ("attribute_values"."kind" = 'COLOR' AND "attribute_values"."color_hex" ~ '^#[0-9A-Fa-f]{6}$')
        OR ("attribute_values"."kind" = 'IMAGE' AND "attribute_values"."color_hex" IS NULL)
      ))
);
--> statement-breakpoint
CREATE TABLE "attributes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"translations" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT "media_assets_owner_chk";--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "attribute_value_id" uuid;--> statement-breakpoint
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attribute_values_attribute_idx" ON "attribute_values" USING btree ("attribute_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attribute_values_color_uidx" ON "attribute_values" USING btree ("attribute_id","color_hex") WHERE "attribute_values"."kind" = 'COLOR' AND "attribute_values"."color_hex" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "attributes_key_uidx" ON "attributes" USING btree ("key");--> statement-breakpoint
CREATE INDEX "attributes_created_idx" ON "attributes" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_attribute_value_id_attribute_values_id_fk" FOREIGN KEY ("attribute_value_id") REFERENCES "public"."attribute_values"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_assets_attribute_value_idx" ON "media_assets" USING btree ("attribute_value_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_attribute_value_uidx" ON "media_assets" USING btree ("attribute_value_id") WHERE "media_assets"."attribute_value_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_chk" CHECK ((
        ("media_assets"."upload_status" = 'PENDING'
          AND "media_assets"."product_id" IS NULL
          AND "media_assets"."category_id" IS NULL
          AND "media_assets"."brand_id" IS NULL
          AND "media_assets"."hero_slide_id" IS NULL
          AND "media_assets"."blog_post_id" IS NULL
          AND "media_assets"."reel_id" IS NULL
          AND "media_assets"."attribute_value_id" IS NULL)
        OR ("media_assets"."role" = 'BRANDING' AND "media_assets"."purpose" IS NOT NULL)
        OR (
          ("media_assets"."product_id" IS NOT NULL)::int
          + ("media_assets"."category_id" IS NOT NULL)::int
          + ("media_assets"."brand_id" IS NOT NULL)::int
          + ("media_assets"."hero_slide_id" IS NOT NULL)::int
          + ("media_assets"."blog_post_id" IS NOT NULL)::int
          + ("media_assets"."reel_id" IS NOT NULL)::int
          + ("media_assets"."attribute_value_id" IS NOT NULL)::int
        ) = 1
      ));