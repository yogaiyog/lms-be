"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentUpdateSchema = exports.enrollmentCreateSchema = void 0;
const zod_1 = require("zod");
exports.enrollmentCreateSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    classId: zod_1.z.string().uuid().optional(),
    curriculumId: zod_1.z.string().uuid(),
    joinedAt: zod_1.z.coerce.date().optional(),
    totalMeetPurchased: zod_1.z.number().int().min(0).optional(),
    totalMeetLeft: zod_1.z.number().int().min(0).optional(),
});
exports.enrollmentUpdateSchema = zod_1.z.object({
    classId: zod_1.z.string().uuid().nullable().optional(),
    totalMeetPurchased: zod_1.z.number().int().min(0).optional(),
    totalMeetLeft: zod_1.z.number().int().min(0).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
