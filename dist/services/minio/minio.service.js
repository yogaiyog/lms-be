"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureBucket = ensureBucket;
exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;
const minio_1 = require("minio");
const env_1 = require("../../config/env");
const app_error_1 = require("../../utils/app-error");
let client = null;
function getClient() {
    if (!client) {
        client = new minio_1.Client({
            endPoint: env_1.env.MINIO_ENDPOINT,
            port: env_1.env.MINIO_PORT,
            accessKey: env_1.env.MINIO_ACCESS_KEY,
            secretKey: env_1.env.MINIO_SECRET_KEY,
            useSSL: env_1.env.MINIO_USE_SSL,
        });
    }
    return client;
}
async function ensureBucket() {
    const mc = getClient();
    const exists = await mc.bucketExists(env_1.env.MINIO_BUCKET);
    if (!exists) {
        await mc.makeBucket(env_1.env.MINIO_BUCKET);
    }
}
async function uploadFile(buffer, filename, mimeType) {
    const mc = getClient();
    await ensureBucket();
    const ext = filename.split(".").pop() || "bin";
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    await mc.putObject(env_1.env.MINIO_BUCKET, key, buffer, buffer.length, {
        "Content-Type": mimeType,
    });
    const publicUrl = env_1.env.MINIO_PUBLIC_URL || `${env_1.env.MINIO_ENDPOINT}:${env_1.env.MINIO_PORT}`;
    return `${publicUrl}/${env_1.env.MINIO_BUCKET}/${key}`;
}
async function deleteFile(url) {
    const mc = getClient();
    const key = url.split("/").pop();
    if (!key)
        throw new app_error_1.AppError("Invalid file URL", 400);
    await mc.removeObject(env_1.env.MINIO_BUCKET, key);
}
