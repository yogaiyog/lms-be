import { AttendanceStatus } from "@prisma/client";
import { z } from "zod";

export const attendanceCreateSchema = z.object({
  scheduleId: z.string().uuid(),
  studentId: z.string().uuid(),
  date: z.coerce.date(),
  status: z.nativeEnum(AttendanceStatus).optional(),
  notes: z.string().min(1).optional().nullable(),
});

export const attendanceUpdateSchema = attendanceCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
