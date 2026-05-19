import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(16).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_REALTIME_PROVIDER: z.enum(["supabase", "pusher", "none"]).default("supabase"),
  APP_BASE_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success && process.env.NODE_ENV === "production") {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = parsed.success
  ? parsed.data
  : {
      NODE_ENV: "development" as const,
      NEXT_PUBLIC_REALTIME_PROVIDER: "supabase" as const,
    };

export const isProduction = env.NODE_ENV === "production";
