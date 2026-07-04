import { z } from "zod";

export const attendanceAssessmentScoreCreateSchema = z.object({
  assessmentId: z.string().uuid(),
  aspectId: z.string().uuid(),
  score: z.number().int().min(1).max(5),
  notes: z.string().min(1).optional().nullable(),
});

export const attendanceAssessmentScoreUpdateSchema = z.object({
  score: z.number().int().min(1).max(5).optional(),
  notes: z.string().min(1).optional().nullable(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
