"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicUpdateSchema = exports.topicCreateSchema = void 0;
const zod_1 = require("zod");
exports.topicCreateSchema = zod_1.z.object({
    curriculumId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().trim().min(1).optional().nullable(),
    materialLink: zod_1.z.string().url().optional().nullable(),
    exampleProjectLink: zod_1.z.string().url().optional().nullable(),
    goals: zod_1.z.string().optional().nullable(),
    tools: zod_1.z.string().optional().nullable(),
    order: zod_1.z.number().int().min(0).optional(),
});
exports.topicUpdateSchema = exports.topicCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
