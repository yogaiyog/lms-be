import { z } from "zod";

export const tutorProfileCreateSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  dayoff1: z.number().int().min(0).max(6).optional().nullable(),
  dayoff2: z.number().int().min(0).max(6).optional().nullable(),
});

export const tutorProfileUpdateSchema = tutorProfileCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
