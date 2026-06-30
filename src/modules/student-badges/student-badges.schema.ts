import { z } from "zod";

export const studentBadgeCreateSchema = z.object({
  studentId: z.string().uuid(),
  badgeId: z.string().uuid(),
  earnedAt: z.coerce.date().optional(),
});

export const studentBadgeUpdateSchema = studentBadgeCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
