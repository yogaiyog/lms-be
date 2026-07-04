import { z } from "zod";

export const assessmentAspectCreateSchema = z.object({
  assessmentSetId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  minScore: z.number().int().min(0).default(1),
  maxScore: z.number().int().min(1).default(5),
  order: z.number().int().min(0).default(0),
});

export const assessmentAspectUpdateSchema = assessmentAspectCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
