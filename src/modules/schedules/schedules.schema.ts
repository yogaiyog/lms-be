import { DayOfWeek } from "../../types/enums";
import { z } from "zod";

export const scheduleCreateSchema = z.object({
  classId: z.string().uuid(),
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  meetLink: z.string().url(),
  topic: z.string().min(1).optional().nullable(),
  topicId: z.string().uuid().optional().nullable(),
  date: z.coerce.date(),
  isDone: z.boolean().optional(),
});

export const scheduleUpdateSchema = scheduleCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
