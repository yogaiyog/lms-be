"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestClassUpdateSchema = exports.requestClassCreateSchema = void 0;
const zod_1 = require("zod");
exports.requestClassCreateSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    parentId: zod_1.z.string().uuid(),
    prevClassId: zod_1.z.string().uuid().optional().nullable(),
    category: zod_1.z.string(),
    curriculum: zod_1.z.string(),
    days: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    sessionCount: zod_1.z.number().int().min(1).max(2).default(1),
    preferredTutorId: zod_1.z.string().uuid().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    status: zod_1.z.string().optional(),
});
exports.requestClassUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPROVED", "REJECTED", "CANCELLED"]).optional(),
    adminNotes: zod_1.z.string().optional().nullable(),
    approvedClassId: zod_1.z.string().uuid().optional().nullable(),
    reviewedBy: zod_1.z.string().uuid().optional(),
    reviewedAt: zod_1.z.string().datetime().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
