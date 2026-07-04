import { Category, ClassType } from "../../types/enums";
import { z } from "zod";

export const classCreateSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(ClassType).optional().default("BATCH"),
  category: z.nativeEnum(Category),
  tutorId: z.string().uuid(),
  curriculumId: z.string().uuid().optional().nullable(),
  startDate: z.string().datetime(),
  isActive: z.boolean().optional(),
});

export const classUpdateSchema = classCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
