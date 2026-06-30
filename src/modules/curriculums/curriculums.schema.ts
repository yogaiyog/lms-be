import { z } from "zod";

export const curriculumCreateSchema = z.object({
  classId: z.string().uuid(),
  name: z.string().min(1),
});

export const curriculumUpdateSchema = curriculumCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
