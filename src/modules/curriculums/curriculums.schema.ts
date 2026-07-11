import { z } from "zod";

export const curriculumCreateSchema = z.object({
  name: z.string().min(1),
  assessmentSetId: z.string().uuid().optional().nullable(),
  categoryIds: z.array(z.string().uuid()).min(1),
});

export const curriculumUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  assessmentSetId: z.string().uuid().optional().nullable(),
  categoryIds: z.array(z.string().uuid()).optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
