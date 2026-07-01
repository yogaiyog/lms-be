import { z } from "zod";
import { Category } from "../../types/enums";

export const curriculumCreateSchema = z.object({
  category: z.nativeEnum(Category),
  name: z.string().min(1),
});

export const curriculumUpdateSchema = curriculumCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
