import { z } from "zod";

export const announcementCreateSchema = z.object({
  classId: z.string().uuid(),
  tutorId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
});

export const announcementUpdateSchema = announcementCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
