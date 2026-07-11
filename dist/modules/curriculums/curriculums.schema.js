"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curriculumUpdateSchema = exports.curriculumCreateSchema = void 0;
const zod_1 = require("zod");
exports.curriculumCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    assessmentSetId: zod_1.z.string().uuid().optional().nullable(),
    categoryIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
});
exports.curriculumUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    assessmentSetId: zod_1.z.string().uuid().optional().nullable(),
    categoryIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
