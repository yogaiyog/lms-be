"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../auth/auth.middleware");
const minio_1 = require("../../services/minio");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
const ENTITY_TYPES = [
    "avatar",
    "topic",
    "badge",
    "certificate",
    "announcement",
    "general",
    "quiz",
];
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new app_error_1.AppError("Format file tidak didukung", 400));
        }
        cb(null, true);
    },
});
exports.uploadRouter = (0, express_1.Router)();
exports.uploadRouter.get("/images", auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const entityType = req.query.entityType;
        const entityId = req.query.entityId;
        const where = {};
        if (entityType)
            where.entityType = entityType;
        if (entityId)
            where.entityId = entityId;
        const images = await prisma_1.prisma.image.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 100,
        });
        res.json({ success: true, data: images });
    }
    catch (err) {
        next(err);
    }
});
async function saveImageRecord(url, filename, mimeType, size, entityType, entityId, uploadedBy) {
    return prisma_1.prisma.image.create({
        data: { url, filename, mimeType, size, entityType, entityId, uploadedBy },
    });
}
exports.uploadRouter.post("/image", auth_middleware_1.authenticate, upload.single("file"), async (req, res, next) => {
    try {
        const file = req.file;
        if (!file)
            throw new app_error_1.AppError("File gambar wajib diunggah", 400);
        const entityType = req.body.entityType;
        if (!entityType || !ENTITY_TYPES.includes(entityType)) {
            throw new app_error_1.AppError(`entityType wajib diisi. Pilihan: ${ENTITY_TYPES.join(", ")}`, 400);
        }
        const url = await (0, minio_1.uploadFile)(file.buffer, file.originalname, file.mimetype);
        const record = await saveImageRecord(url, file.originalname, file.mimetype, file.size, entityType, req.body.entityId || null, req.auth?.userId || null);
        res.json({ success: true, data: record });
    }
    catch (err) {
        next(err);
    }
});
exports.uploadRouter.post("/images", auth_middleware_1.authenticate, upload.array("files", 10), async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            throw new app_error_1.AppError("File gambar wajib diunggah", 400);
        }
        const entityType = req.body.entityType;
        if (!entityType || !ENTITY_TYPES.includes(entityType)) {
            throw new app_error_1.AppError(`entityType wajib diisi. Pilihan: ${ENTITY_TYPES.join(", ")}`, 400);
        }
        const results = await Promise.all(files.map((f) => (0, minio_1.uploadFile)(f.buffer, f.originalname, f.mimetype)));
        const records = await Promise.all(results.map((url, i) => saveImageRecord(url, files[i].originalname, files[i].mimetype, files[i].size, entityType, req.body.entityId || null, req.auth?.userId || null)));
        res.json({ success: true, data: records });
    }
    catch (err) {
        next(err);
    }
});
const videoUpload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit for video files
    fileFilter: (_req, file, cb) => {
        const allowed = [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/quicktime",
            "video/x-matroska",
        ];
        if (!allowed.includes(file.mimetype)) {
            return cb(new app_error_1.AppError("Format file video tidak didukung. Gunakan MP4, WebM, QuickTime, atau OGG", 400));
        }
        cb(null, true);
    },
});
exports.uploadRouter.post("/video", auth_middleware_1.authenticate, videoUpload.single("file"), async (req, res, next) => {
    try {
        const file = req.file;
        if (!file)
            throw new app_error_1.AppError("File video wajib diunggah", 400);
        const url = await (0, minio_1.uploadFile)(file.buffer, file.originalname, file.mimetype);
        res.json({
            success: true,
            data: {
                url,
                filename: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
