import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().default("http://localhost:3000,capacitor://localhost,file://"),
  JWT_ACCESS_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),

  MINIO_ENDPOINT: z.string().min(1),
  MINIO_PORT: z.coerce.number().int().positive().default(9000),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET: z.string().min(1),
  MINIO_USE_SSL: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  MINIO_PUBLIC_URL: z.string().optional(),

  COMPANY_NAME: z.string().default("Juara Kita"),

  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_ENCRYPTION: z.enum(["TLS", "SSL", "NONE"]).default("TLS"),
  SMTP_USERNAME: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),

  MIDTRANS_CLIENT_KEY: z.string().default(""),
  MIDTRANS_SERVER_KEY: z.string().default(""),
  MIDTRANS_MERCHANT_ID: z.string().default(""),
  MIDTRANS_IS_PRODUCTION: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  PUBLIC_BASE_URL: z.string().default("http://localhost:4000"),
  MIN_TUTOR_SLOTS: z.coerce.number().int().nonnegative().default(10),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

export const env = parsedEnv.data;
