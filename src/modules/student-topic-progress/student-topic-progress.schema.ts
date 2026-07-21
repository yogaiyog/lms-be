import { z } from "zod";

// metadata bisa string (JSON string) atau object (akan distorage sebagai JSON string).
const metadataField = z
  .union([z.string(), z.record(z.unknown())])
  .optional()
  .nullable();

export const studentTopicProgressUpsertSchema = z.object({
  studentId: z.string().min(1),
  // Either topicTaskId (UUID) or code (e.g. "m1") resolved via lookup.
  topicTaskId: z.string().uuid().optional(),
  topicTaskCode: z.string().min(1).optional(),
  status: z.enum(["available", "in_progress", "completed"]),
  metadata: metadataField,
}).refine(
  (value) => value.topicTaskId || value.topicTaskCode,
  "Either topicTaskId or topicTaskCode is required",
);

export const studentTopicProgressUpdateSchema = z.object({
  status: z.enum(["available", "in_progress", "completed"]).optional(),
  metadata: metadataField,
});