import { Category } from "../../types/enums";
import { z } from "zod";

export const classCreateSchema = z.object({
  name: z.string().min(1),
  category: z.nativeEnum(Category),
  tutorId: z.string().uuid(),
  isActive: z.boolean().optional(),
});

export const classUpdateSchema = classCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
