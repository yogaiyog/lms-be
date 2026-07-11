import { z } from "zod";

export const galleryCreateSchema = z.object({
  studentId: z.string().uuid(),
  imageUrl: z.string().min(1),
  caption: z.string().optional(),
});

export const galleryUpdateSchema = z.object({
  imageUrl: z.string().min(1).optional(),
  caption: z.string().optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
