import { z } from "zod";

export const attendanceAssessmentCreateSchema = z.object({
  attendanceId: z.string().uuid(),
  totalScore: z.number().int().optional().nullable(),
  percentage: z.number().min(0).max(100).optional().nullable(),
  mentorComment: z.string().min(1).optional().nullable(),
});

export const attendanceAssessmentUpdateSchema = attendanceAssessmentCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
