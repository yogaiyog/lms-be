"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    DATABASE_URL: zod_1.z.string().min(1),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:3000,capacitor://localhost,file://"),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    ACCESS_TOKEN_TTL_MINUTES: zod_1.z.coerce.number().int().positive().default(15),
    REFRESH_TOKEN_TTL_DAYS: zod_1.z.coerce.number().int().positive().default(30),
    MINIO_ENDPOINT: zod_1.z.string().min(1),
    MINIO_PORT: zod_1.z.coerce.number().int().positive().default(9000),
    MINIO_ACCESS_KEY: zod_1.z.string().min(1),
    MINIO_SECRET_KEY: zod_1.z.string().min(1),
    MINIO_BUCKET: zod_1.z.string().min(1),
    MINIO_USE_SSL: zod_1.z
        .string()
        .default("false")
        .transform((v) => v === "true"),
    MINIO_PUBLIC_URL: zod_1.z.string().optional(),
    COMPANY_NAME: zod_1.z.string().default("Juara Kita"),
    SMTP_HOST: zod_1.z.string().default("smtp.gmail.com"),
    SMTP_PORT: zod_1.z.coerce.number().int().positive().default(587),
    SMTP_ENCRYPTION: zod_1.z.enum(["TLS", "SSL", "NONE"]).default("TLS"),
    SMTP_USERNAME: zod_1.z.string().min(1),
    SMTP_PASSWORD: zod_1.z.string().min(1),
    MIDTRANS_CLIENT_KEY: zod_1.z.string().default(""),
    MIDTRANS_SERVER_KEY: zod_1.z.string().default(""),
    MIDTRANS_MERCHANT_ID: zod_1.z.string().default(""),
    MIDTRANS_IS_PRODUCTION: zod_1.z
        .string()
        .default("false")
        .transform((v) => v === "true"),
    PUBLIC_BASE_URL: zod_1.z.string().default("http://localhost:4000"),
    TUTOR_COST_TRIAL: zod_1.z.coerce.number().int().positive().default(12000),
    TUTOR_COST_BATCH: zod_1.z.coerce.number().int().positive().default(20000),
    TUTOR_COST_PRIVATE: zod_1.z.coerce.number().int().positive().default(30000),
    TUTOR_COST_MAKEUP: zod_1.z.coerce.number().int().positive().default(20000),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("Invalid environment variables");
    console.error(parsedEnv.error.flatten().fieldErrors);
    throw new Error("Environment validation failed");
}
exports.env = parsedEnv.data;
