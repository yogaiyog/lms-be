"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialRegisterSchema = void 0;
const enums_1 = require("../../types/enums");
const zod_1 = require("zod");
exports.trialRegisterSchema = zod_1.z.object({
    parent: zod_1.z
        .object({
        parentId: zod_1.z.string().uuid().optional(),
        fullName: zod_1.z.string().min(1).optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().min(8).max(100).optional(),
        phone: zod_1.z.string().min(1).optional(),
    })
        .refine((p) => !!p.parentId ||
        (!!p.fullName && !!p.email && !!p.password && !!p.phone), "Parent harus berisi parentId (pilih existing) atau data lengkap untuk dibuat baru"),
    student: zod_1.z.object({
        fullName: zod_1.z.string().min(1),
        nickname: zod_1.z.string().min(1),
        birthDate: zod_1.z.coerce.date(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8).max(100),
        categoryId: zod_1.z.string().uuid(),
        school: zod_1.z.string().optional().nullable(),
    }),
    curriculumId: zod_1.z.string().uuid(),
    tutorId: zod_1.z.string().uuid(),
    className: zod_1.z.string().min(1).optional(),
    isOnline: zod_1.z.boolean().optional().default(true),
    slot: zod_1.z.object({
        dayOfWeek: zod_1.z.nativeEnum(enums_1.DayOfWeek),
        startTime: zod_1.z.string().min(1),
        endTime: zod_1.z.string().min(1),
    }),
    startDate: zod_1.z.coerce.date(),
});
