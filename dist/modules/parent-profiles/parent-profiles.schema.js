"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentProfileUpdateSchema = exports.parentProfileCreateSchema = void 0;
const zod_1 = require("zod");
exports.parentProfileCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    fullName: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
});
exports.parentProfileUpdateSchema = exports.parentProfileCreateSchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
