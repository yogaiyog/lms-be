import { z } from "zod";

export const requestClassCreateSchema = z.object({
  studentId: z.string().uuid(),
  parentId: z.string().uuid(),
  prevClassId: z.string().uuid().optional().nullable(),
  category: z.string(),
  curriculum: z.string(),
  days: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  sessionCount: z.number().int().min(1).max(2).default(1),
  preferredTutorId: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.string().optional(),
});

export const requestClassUpdateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CANCELLED"]).optional(),
  adminNotes: z.string().optional().nullable(),
  approvedClassId: z.string().uuid().optional().nullable(),
  reviewedBy: z.string().uuid().optional(),
  reviewedAt: z.string().datetime().optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
