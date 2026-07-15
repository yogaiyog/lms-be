"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageSchema = exports.IMAGE_MIMETYPES = void 0;
const zod_1 = require("zod");
exports.IMAGE_MIMETYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];
exports.uploadImageSchema = zod_1.z.object({
    file: zod_1.z
        .any()
        .refine((f) => !!f, "File gambar wajib diunggah")
        .refine((f) => exports.IMAGE_MIMETYPES.includes(f.mimetype), "Format file tidak didukung. Gunakan jpg, png, webp, atau gif")
        .refine((f) => f.size <= 10 * 1024 * 1024, "Ukuran file maksimal 10MB"),
});
