"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentSetUpdateSchema = exports.assessmentSetCreateSchema = void 0;
const zod_1 = require("zod");
exports.assessmentSetCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().nullable(),
    imageUrl: zod_1.z.string().trim().min(1).optional().nullable(),
});
exports.assessmentSetUpdateSchema = exports.assessmentSetCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
