import { z } from "zod";

export const enrollmentCreateSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid(),
  joinedAt: z.coerce.date().optional(),
});

export const enrollmentUpdateSchema = enrollmentCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
