"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicTaskUpdateSchema = exports.topicTaskCreateSchema = void 0;
const zod_1 = require("zod");
exports.topicTaskCreateSchema = zod_1.z.object({
    topicId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(["SCRATCH", "QUIZ", "PYTHON"]).default("SCRATCH"),
    code: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1),
    url: zod_1.z.string().optional().nullable(),
    order: zod_1.z.number().int().min(0).optional().default(0),
    isCapstone: zod_1.z.boolean().optional().default(false),
    autoComplete: zod_1.z.boolean().optional().default(false),
    instructions: zod_1.z.string().optional().nullable(),
    defaultCode: zod_1.z.string().optional().nullable(),
});
exports.topicTaskUpdateSchema = exports.topicTaskCreateSchema.partial().omit({ topicId: true }).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
