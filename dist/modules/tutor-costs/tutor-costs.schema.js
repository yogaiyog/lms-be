"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorCostUpdateSchema = exports.tutorCostCreateSchema = void 0;
const zod_1 = require("zod");
exports.tutorCostCreateSchema = zod_1.z.object({
    classType: zod_1.z.string().min(1),
    cost: zod_1.z.number().nonnegative(),
    description: zod_1.z.string().optional().nullable(),
});
exports.tutorCostUpdateSchema = zod_1.z.object({
    classType: zod_1.z.string().min(1).optional(),
    cost: zod_1.z.number().nonnegative().optional(),
    description: zod_1.z.string().optional().nullable(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
