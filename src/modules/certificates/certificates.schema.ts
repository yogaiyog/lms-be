import { z } from "zod";

export const certificateCreateSchema = z.object({
  studentId: z.string().uuid(),
  curriculumId: z.string().uuid(),
  certificateNumber: z.string().min(1),
  grade: z.string().optional().nullable(),
  filePath: z.string().optional().nullable(),
});

export const certificateUpdateSchema = z.object({
  grade: z.string().optional().nullable(),
  filePath: z.string().optional().nullable(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);

export const certificateGenerateSchema = z.object({
  name: z.string().min(1),
  course: z.string().min(1),
  date: z.string().min(1),
  certificateNumber: z.string().min(1),
  instructor: z.string().min(1),
  grade: z.string().optional(),
});

export const certificateBatchGenerateSchema = z.object({
  entries: z.array(certificateGenerateSchema).min(1),
});
