"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateBatchGenerateSchema = exports.certificateGenerateSchema = exports.certificateUpdateSchema = exports.certificateCreateSchema = void 0;
const zod_1 = require("zod");
exports.certificateCreateSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    curriculumId: zod_1.z.string().uuid(),
    certificateNumber: zod_1.z.string().min(1),
    grade: zod_1.z.string().optional().nullable(),
    filePath: zod_1.z.string().optional().nullable(),
});
exports.certificateUpdateSchema = zod_1.z.object({
    grade: zod_1.z.string().optional().nullable(),
    filePath: zod_1.z.string().optional().nullable(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
exports.certificateGenerateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    course: zod_1.z.string().min(1),
    date: zod_1.z.string().min(1),
    certificateNumber: zod_1.z.string().min(1),
    instructor: zod_1.z.string().min(1),
    grade: zod_1.z.string().optional(),
});
exports.certificateBatchGenerateSchema = zod_1.z.object({
    entries: zod_1.z.array(exports.certificateGenerateSchema).min(1),
});
