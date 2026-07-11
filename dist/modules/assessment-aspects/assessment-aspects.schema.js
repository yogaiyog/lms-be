"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentAspectUpdateSchema = exports.assessmentAspectCreateSchema = void 0;
const zod_1 = require("zod");
exports.assessmentAspectCreateSchema = zod_1.z.object({
    assessmentSetId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().nullable(),
    icon: zod_1.z.string().optional().nullable(),
    minScore: zod_1.z.number().int().min(0).default(1),
    maxScore: zod_1.z.number().int().min(1).default(5),
    order: zod_1.z.number().int().min(0).default(0),
});
exports.assessmentAspectUpdateSchema = exports.assessmentAspectCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
