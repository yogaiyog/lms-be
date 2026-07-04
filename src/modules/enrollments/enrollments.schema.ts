import { z } from "zod";

export const enrollmentCreateSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid().optional(),
  curriculumId: z.string().uuid(),
  joinedAt: z.coerce.date().optional(),
  totalMeetPurchased: z.number().int().min(1).optional(),
  totalMeetLeft: z.number().int().min(0).optional(),
});

export const enrollmentUpdateSchema = z.object({
  classId: z.string().uuid().nullable().optional(),
  totalMeetPurchased: z.number().int().min(1).optional(),
  totalMeetLeft: z.number().int().min(0).optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
