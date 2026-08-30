import { Router } from "express";
import multer from "multer";
import { authenticate } from "../auth/auth.middleware";
import { uploadFile } from "../../services/minio";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

const ENTITY_TYPES = [
  "avatar",
  "topic",
  "badge",
  "certificate",
  "announcement",
  "general",
  "quiz",
] as const;

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new AppError("Format file tidak didukung", 400));
    }
    cb(null, true);
  },
});

export const uploadRouter = Router();

uploadRouter.get(
  "/images",
  authenticate,
  async (req, res, next) => {
    try {
      const entityType = req.query.entityType as string | undefined;
      const entityId = req.query.entityId as string | undefined;

      const where: Record<string, unknown> = {};
      if (entityType) where.entityType = entityType;
      if (entityId) where.entityId = entityId;

      const images = await prisma.image.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
      });

      res.json({ success: true, data: images });
    } catch (err) {
      next(err);
    }
  },
);

async function saveImageRecord(
  url: string,
  filename: string,
  mimeType: string,
  size: number,
  entityType: string,
  entityId: string | null,
  uploadedBy: string | null,
) {
  return prisma.image.create({
    data: { url, filename, mimeType, size, entityType, entityId, uploadedBy },
  });
}

uploadRouter.post(
  "/image",
  authenticate,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const file = req.file;
      if (!file) throw new AppError("File gambar wajib diunggah", 400);

      const entityType = req.body.entityType as string | undefined;
      if (!entityType || !ENTITY_TYPES.includes(entityType as never)) {
        throw new AppError(
          `entityType wajib diisi. Pilihan: ${ENTITY_TYPES.join(", ")}`,
          400,
        );
      }

      const url = await uploadFile(file.buffer, file.originalname, file.mimetype);
      const record = await saveImageRecord(
        url,
        file.originalname,
        file.mimetype,
        file.size,
        entityType,
        req.body.entityId || null,
        req.auth?.userId || null,
      );

      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },
);

uploadRouter.post(
  "/images",
  authenticate,
  upload.array("files", 10),
  async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError("File gambar wajib diunggah", 400);
      }

      const entityType = req.body.entityType as string | undefined;
      if (!entityType || !ENTITY_TYPES.includes(entityType as never)) {
        throw new AppError(
          `entityType wajib diisi. Pilihan: ${ENTITY_TYPES.join(", ")}`,
          400,
        );
      }

      const results = await Promise.all(
        files.map((f) => uploadFile(f.buffer, f.originalname, f.mimetype)),
      );

      const records = await Promise.all(
        results.map((url, i) =>
          saveImageRecord(
            url,
            files[i].originalname,
            files[i].mimetype,
            files[i].size,
            entityType,
            req.body.entityId || null,
            req.auth?.userId || null,
          ),
        ),
      );

      res.json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  },
);

const videoUpload = multer({
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
      return cb(new AppError("Format file video tidak didukung. Gunakan MP4, WebM, QuickTime, atau OGG", 400));
    }
    cb(null, true);
  },
});

uploadRouter.post(
  "/video",
  authenticate,
  videoUpload.single("file"),
  async (req, res, next) => {
    try {
      const file = req.file;
      if (!file) throw new AppError("File video wajib diunggah", 400);

      const url = await uploadFile(file.buffer, file.originalname, file.mimetype);

      res.json({
        success: true,
        data: {
          url,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);
