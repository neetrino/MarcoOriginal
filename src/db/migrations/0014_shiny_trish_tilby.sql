ALTER TABLE "promotions" DROP CONSTRAINT "promotions_kind_chk";--> statement-breakpoint
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_single_target_chk";--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "brand_id" text;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "promotions_brand_idx" ON "promotions" USING btree ("brand_id");--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_kind_chk" CHECK ((
        ("promotions"."kind" = 'COUPON' AND "promotions"."code" IS NOT NULL)
        OR (
          "promotions"."kind" = 'AUTOMATIC'
          AND "promotions"."code" IS NULL
          AND (
            (
              "promotions"."product_id" IS NOT NULL
              AND "promotions"."category_id" IS NULL
              AND "promotions"."brand_id" IS NULL
            )
            OR (
              "promotions"."product_id" IS NULL
              AND "promotions"."category_id" IS NOT NULL
              AND "promotions"."brand_id" IS NULL
            )
            OR (
              "promotions"."product_id" IS NULL
              AND "promotions"."category_id" IS NULL
              AND "promotions"."brand_id" IS NOT NULL
            )
          )
        )
      ));--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_single_target_chk" CHECK ((
        ("promotions"."product_id" IS NOT NULL)::int
        + ("promotions"."category_id" IS NOT NULL)::int
        + ("promotions"."brand_id" IS NOT NULL)::int
      ) <= 1);