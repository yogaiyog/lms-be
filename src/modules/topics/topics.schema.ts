import { z } from "zod";

export const topicCreateSchema = z.object({
  curriculumId: z.string().uuid().optional(),
  title: z.string().min(1),
  imageUrl: z.string().trim().min(1).optional().nullable(),
  materialLink: z.string().url().optional().nullable().or(z.literal("")),
  exampleProjectLink: z.string().url().optional().nullable().or(z.literal("")),
  videoYoutubeUrl: z.string().url().optional().nullable().or(z.literal("")),
  videoUploadUrl: z.string().url().optional().nullable().or(z.literal("")),
  goals: z.string().optional().nullable(),
  tools: z.string().optional().nullable(),
  order: z.number().int().min(0).optional(),
});

export const topicUpdateSchema = topicCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
