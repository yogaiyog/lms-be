import { z } from "zod";

export const IMAGE_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const uploadImageSchema = z.object({
  file: z
    .any()
    .refine((f: Express.Multer.File) => !!f, "File gambar wajib diunggah")
    .refine(
      (f: Express.Multer.File) => IMAGE_MIMETYPES.includes(f.mimetype as never),
      "Format file tidak didukung. Gunakan jpg, png, webp, atau gif",
    )
    .refine(
      (f: Express.Multer.File) => f.size <= 10 * 1024 * 1024,
      "Ukuran file maksimal 10MB",
    ),
});
