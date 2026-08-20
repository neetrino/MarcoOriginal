CREATE TABLE "reels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"translations" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reels_like_count_chk" CHECK ("reels"."like_count" >= 0),
	CONSTRAINT "reels_view_count_chk" CHECK ("reels"."view_count" >= 0)
);
--> statement-breakpoint
ALTER TABLE "media_assets" DROP CONSTRAINT "media_assets_owner_chk";--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "reel_id" uuid;--> statement-breakpoint
CREATE INDEX "reels_active_created_idx" ON "reels" USING btree ("is_active","created_at");--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_reel_id_reels_id_fk" FOREIGN KEY ("reel_id") REFERENCES "public"."reels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_assets_reel_idx" ON "media_assets" USING btree ("reel_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_reel_video_uidx" ON "media_assets" USING btree ("reel_id") WHERE "media_assets"."reel_id" IS NOT NULL AND "media_assets"."role" = 'REEL_VIDEO';--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_chk" CHECK ((
        ("media_assets"."upload_status" = 'PENDING'
          AND "media_assets"."product_id" IS NULL
          AND "media_assets"."category_id" IS NULL
          AND "media_assets"."hero_slide_id" IS NULL
          AND "media_assets"."blog_post_id" IS NULL
          AND "media_assets"."reel_id" IS NULL)
        OR ("media_assets"."role" = 'BRANDING' AND "media_assets"."purpose" IS NOT NULL)
        OR (
          ("media_assets"."product_id" IS NOT NULL)::int
          + ("media_assets"."category_id" IS NOT NULL)::int
          + ("media_assets"."hero_slide_id" IS NOT NULL)::int
          + ("media_assets"."blog_post_id" IS NOT NULL)::int
          + ("media_assets"."reel_id" IS NOT NULL)::int
        ) = 1
      ));
