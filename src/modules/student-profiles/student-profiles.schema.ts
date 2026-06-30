import { Category } from "@prisma/client";
import { z } from "zod";

export const studentProfileCreateSchema = z.object({
  userId: z.string().uuid(),
  parentId: z.string().uuid(),
  fullName: z.string().min(1),
  nickname: z.string().min(1),
  birthDate: z.coerce.date(),
  avatarUrl: z.string().url().optional().nullable(),
  category: z.nativeEnum(Category),
  totalXp: z.number().int().min(0).optional(),
  currentStreak: z.number().int().min(0).optional(),
  lastActive: z.coerce.date().optional().nullable(),
});

export const studentProfileUpdateSchema = studentProfileCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
