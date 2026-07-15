import { Client } from "minio";
import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = new Client({
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
      useSSL: env.MINIO_USE_SSL,
    });
  }
  return client;
}

export async function ensureBucket(): Promise<void> {
  const mc = getClient();
  const exists = await mc.bucketExists(env.MINIO_BUCKET);
  if (!exists) {
    await mc.makeBucket(env.MINIO_BUCKET);
  }
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string> {
  const mc = getClient();
  await ensureBucket();

  const ext = filename.split(".").pop() || "bin";
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  await mc.putObject(env.MINIO_BUCKET, key, buffer, buffer.length, {
    "Content-Type": mimeType,
  });

  const publicUrl = env.MINIO_PUBLIC_URL || `${env.MINIO_ENDPOINT}:${env.MINIO_PORT}`;
  return `${publicUrl}/${env.MINIO_BUCKET}/${key}`;
}

export async function deleteFile(url: string): Promise<void> {
  const mc = getClient();
  const key = url.split("/").pop();
  if (!key) throw new AppError("Invalid file URL", 400);
  await mc.removeObject(env.MINIO_BUCKET, key);
}
