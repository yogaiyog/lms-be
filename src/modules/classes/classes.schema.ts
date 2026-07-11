import { Category, ClassType } from "../../types/enums";
import { z } from "zod";

export const classCreateSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(ClassType).optional().default("BATCH"),
  category: z.nativeEnum(Category).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  tutorIds: z.array(z.string().uuid()).min(1),
  curriculumId: z.string().uuid().optional().nullable(),
  startDate: z.string().datetime(),
  isActive: z.boolean().optional(),
  isOnline: z.boolean().optional(),
  location: z.string().optional().nullable(),
});

export const classUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.nativeEnum(ClassType).optional(),
  category: z.nativeEnum(Category).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  tutorIds: z.array(z.string().uuid()).min(1).optional(),
  curriculumId: z.string().uuid().optional().nullable(),
  startDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  isOnline: z.boolean().optional(),
  location: z.string().optional().nullable(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
