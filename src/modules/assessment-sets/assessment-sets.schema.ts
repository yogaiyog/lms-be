import { z } from "zod";

export const assessmentSetCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  imageUrl: z.string().trim().min(1).optional().nullable(),
});

export const assessmentSetUpdateSchema = assessmentSetCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
