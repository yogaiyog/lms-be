"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceAssessmentScoreUpdateSchema = exports.attendanceAssessmentScoreCreateSchema = void 0;
const zod_1 = require("zod");
exports.attendanceAssessmentScoreCreateSchema = zod_1.z.object({
    assessmentId: zod_1.z.string().uuid(),
    aspectId: zod_1.z.string().uuid(),
    score: zod_1.z.number().int().min(1).max(5),
    notes: zod_1.z.string().min(1).optional().nullable(),
});
exports.attendanceAssessmentScoreUpdateSchema = zod_1.z.object({
    score: zod_1.z.number().int().min(1).max(5).optional(),
    notes: zod_1.z.string().min(1).optional().nullable(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
