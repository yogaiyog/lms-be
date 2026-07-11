"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorProfileUpdateSchema = exports.tutorProfileCreateSchema = void 0;
const zod_1 = require("zod");
exports.tutorProfileCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    fullName: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
    bio: zod_1.z.string().optional().nullable(),
    avatarUrl: zod_1.z.string().url().optional().nullable(),
    meetLink: zod_1.z.string().url().optional().nullable(),
    dayoff1: zod_1.z.number().int().min(0).max(6).optional().nullable(),
    dayoff2: zod_1.z.number().int().min(0).max(6).optional().nullable(),
});
exports.tutorProfileUpdateSchema = exports.tutorProfileCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
