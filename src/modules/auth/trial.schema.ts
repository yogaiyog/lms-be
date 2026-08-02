import { DayOfWeek } from "../../types/enums";
import { z } from "zod";

export const trialRegisterSchema = z.object({
  parent: z
    .object({
      parentId: z.string().uuid().optional(),
      fullName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      password: z.string().min(8).max(100).optional(),
      phone: z.string().min(1).optional(),
    })
    .refine(
      (p) =>
        !!p.parentId ||
        (!!p.fullName && !!p.email && !!p.password && !!p.phone),
      "Parent harus berisi parentId (pilih existing) atau data lengkap untuk dibuat baru",
    ),
  student: z.object({
    fullName: z.string().min(1),
    nickname: z.string().min(1),
    birthDate: z.coerce.date(),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    categoryId: z.string().uuid(),
    school: z.string().optional().nullable(),
  }),
  curriculumId: z.string().uuid(),
  tutorId: z.string().uuid(),
  className: z.string().min(1).optional(),
  isOnline: z.boolean().optional().default(true),
  slot: z.object({
    dayOfWeek: z.nativeEnum(DayOfWeek),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
  }),
  startDate: z.coerce.date(),
});
