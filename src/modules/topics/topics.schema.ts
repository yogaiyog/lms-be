import { z } from "zod";

export const topicCreateSchema = z.object({
  curriculumId: z.string().uuid().optional(),
  title: z.string().min(1),
  materialLink: z.string().url().optional().nullable(),
  exampleProjectLink: z.string().url().optional().nullable(),
  goals: z.string().optional().nullable(),
  tools: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
});

export const topicUpdateSchema = topicCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
