import "server-only";

import { z } from "zod";

/**
 * Foundation env contract. Provider secrets become required when the
 * corresponding feature is wired (auth, DB, Redis, R2, email).
 */
const boolish = z
  .enum(["true", "false"])
  .optional()
  .transform((value) => value === "true");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  R2_ACCOUNT_ID: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET_NAME: z.string().min(1).optional(),
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
  /** Optional custom S3 API endpoint; defaults to account R2 endpoint. */
  R2_ENDPOINT: z.string().url().optional(),
  EMAIL_FROM: z.string().email().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  // --- ArCa ---
  ARCA_TEST_MODE: boolish,
  ARCA_BANK: z.string().min(1).optional(),
  ARCA_USERNAME: z.string().min(1).optional(),
  ARCA_PASSWORD: z.string().min(1).optional(),
  ARCA_LIVE_USERNAME: z.string().min(1).optional(),
  ARCA_LIVE_PASSWORD: z.string().min(1).optional(),
  // --- Idram ---
  IDRAM_TEST_MODE: boolish,
  IDRAM_DEV_MOCK: boolish,
  IDRAM_GET_PAYMENT_URL: z.string().url().optional(),
  IDRAM_REC_ACCOUNT: z.string().min(1).optional(),
  IDRAM_SECRET_KEY: z.string().min(1).optional(),
  IDRAM_LIVE_REC_ACCOUNT: z.string().min(1).optional(),
  IDRAM_LIVE_SECRET_KEY: z.string().min(1).optional(),
  // --- Payment reconciliation / cron ---
  CRON_SECRET: z.string().min(1).optional(),
  PAYMENT_RECONCILE_INTERVAL_MINUTES: z.string().min(1).optional(),
  PAYMENT_PENDING_TIMEOUT_MINUTES: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | undefined;

/** Empty or whitespace-only env values → undefined (optional fields). */
function optionalEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function resolvePublicBaseUrl(): string | undefined {
  return optionalEnv(
    process.env.R2_PUBLIC_BASE_URL || process.env.R2_PUBLIC_URL,
  );
}

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    AUTH_SECRET: optionalEnv(process.env.AUTH_SECRET),
    DATABASE_URL: optionalEnv(process.env.DATABASE_URL),
    UPSTASH_REDIS_REST_URL: optionalEnv(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: optionalEnv(process.env.UPSTASH_REDIS_REST_TOKEN),
    R2_ACCOUNT_ID: optionalEnv(process.env.R2_ACCOUNT_ID),
    R2_ACCESS_KEY_ID: optionalEnv(process.env.R2_ACCESS_KEY_ID),
    R2_SECRET_ACCESS_KEY: optionalEnv(process.env.R2_SECRET_ACCESS_KEY),
    R2_BUCKET_NAME: optionalEnv(process.env.R2_BUCKET_NAME),
    R2_PUBLIC_BASE_URL: resolvePublicBaseUrl(),
    R2_ENDPOINT: optionalEnv(process.env.R2_ENDPOINT),
    EMAIL_FROM: optionalEnv(process.env.EMAIL_FROM),
    RESEND_API_KEY: optionalEnv(process.env.RESEND_API_KEY),
    ARCA_TEST_MODE: optionalEnv(process.env.ARCA_TEST_MODE),
    ARCA_BANK: optionalEnv(process.env.ARCA_BANK),
    ARCA_USERNAME: optionalEnv(process.env.ARCA_USERNAME),
    ARCA_PASSWORD: optionalEnv(process.env.ARCA_PASSWORD),
    ARCA_LIVE_USERNAME: optionalEnv(process.env.ARCA_LIVE_USERNAME),
    ARCA_LIVE_PASSWORD: optionalEnv(process.env.ARCA_LIVE_PASSWORD),
    IDRAM_TEST_MODE: optionalEnv(process.env.IDRAM_TEST_MODE),
    IDRAM_DEV_MOCK: optionalEnv(process.env.IDRAM_DEV_MOCK),
    IDRAM_GET_PAYMENT_URL: optionalEnv(process.env.IDRAM_GET_PAYMENT_URL),
    IDRAM_REC_ACCOUNT: optionalEnv(process.env.IDRAM_REC_ACCOUNT),
    IDRAM_SECRET_KEY: optionalEnv(process.env.IDRAM_SECRET_KEY),
    IDRAM_LIVE_REC_ACCOUNT: optionalEnv(process.env.IDRAM_LIVE_REC_ACCOUNT),
    IDRAM_LIVE_SECRET_KEY: optionalEnv(process.env.IDRAM_LIVE_SECRET_KEY),
    CRON_SECRET: optionalEnv(process.env.CRON_SECRET),
    PAYMENT_RECONCILE_INTERVAL_MINUTES: optionalEnv(
      process.env.PAYMENT_RECONCILE_INTERVAL_MINUTES,
    ),
    PAYMENT_PENDING_TIMEOUT_MINUTES: optionalEnv(
      process.env.PAYMENT_PENDING_TIMEOUT_MINUTES,
    ),
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

/** Database URL is required for Drizzle client and migrations. */
export function requireDatabaseUrl(): string {
  const { DATABASE_URL } = getEnv();

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  return DATABASE_URL;
}
