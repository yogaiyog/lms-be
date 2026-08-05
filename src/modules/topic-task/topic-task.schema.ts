import { z } from "zod";

export const topicTaskCreateSchema = z.object({
  topicId: z.string().uuid(),
  type: z.enum(["SCRATCH", "QUIZ", "PYTHON"]).default("SCRATCH"),
  code: z.string().min(1),
  label: z.string().min(1),
  url: z.string().optional().nullable(),
  order: z.number().int().min(0).optional().default(0),
  isCapstone: z.boolean().optional().default(false),
  autoComplete: z.boolean().optional().default(false),
  instructions: z.string().optional().nullable(),
  defaultCode: z.string().optional().nullable(),
});

export const topicTaskUpdateSchema = topicTaskCreateSchema.partial().omit({ topicId: true }).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
