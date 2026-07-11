"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceAssessmentUpdateSchema = exports.attendanceAssessmentCreateSchema = void 0;
const zod_1 = require("zod");
exports.attendanceAssessmentCreateSchema = zod_1.z.object({
    attendanceId: zod_1.z.string().uuid(),
    totalScore: zod_1.z.number().int().optional().nullable(),
    percentage: zod_1.z.number().min(0).max(100).optional().nullable(),
    mentorComment: zod_1.z.string().min(1).optional().nullable(),
    projectLink: zod_1.z.string().url().optional().nullable(),
});
exports.attendanceAssessmentUpdateSchema = exports.attendanceAssessmentCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
