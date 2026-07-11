import { Category } from "../../types/enums";
import { z } from "zod";

const studentProfileBase = z.object({
  userId: z.string().uuid(),
  parentId: z.string().uuid(),
  fullName: z.string().min(1),
  nickname: z.string().min(1),
  birthDate: z.coerce.date(),
  avatarUrl: z.string().url().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  category: z.nativeEnum(Category).optional(),
  totalXp: z.number().int().min(0).optional(),
  currentStreak: z.number().int().min(0).optional(),
  lastActive: z.coerce.date().optional().nullable(),
  school: z.string().optional().nullable(),
});

export const studentProfileCreateSchema = studentProfileBase.transform(
  ({ category, ...rest }) => rest,
);

export const studentProfileUpdateSchema = studentProfileBase.partial().extend({
  isActive: z.boolean().optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
).transform(
  ({ category, ...rest }) => rest,
);
