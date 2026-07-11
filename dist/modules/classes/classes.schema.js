"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classUpdateSchema = exports.classCreateSchema = void 0;
const enums_1 = require("../../types/enums");
const zod_1 = require("zod");
exports.classCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    type: zod_1.z.nativeEnum(enums_1.ClassType).optional().default("BATCH"),
    category: zod_1.z.nativeEnum(enums_1.Category).optional(),
    categoryId: zod_1.z.string().uuid().optional().nullable(),
    tutorIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
    curriculumId: zod_1.z.string().uuid().optional().nullable(),
    startDate: zod_1.z.string().datetime(),
    isActive: zod_1.z.boolean().optional(),
    isOnline: zod_1.z.boolean().optional(),
    location: zod_1.z.string().optional().nullable(),
});
exports.classUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    type: zod_1.z.nativeEnum(enums_1.ClassType).optional(),
    category: zod_1.z.nativeEnum(enums_1.Category).optional(),
    categoryId: zod_1.z.string().uuid().optional().nullable(),
    tutorIds: zod_1.z.array(zod_1.z.string().uuid()).min(1).optional(),
    curriculumId: zod_1.z.string().uuid().optional().nullable(),
    startDate: zod_1.z.string().datetime().optional(),
    isActive: zod_1.z.boolean().optional(),
    isOnline: zod_1.z.boolean().optional(),
    location: zod_1.z.string().optional().nullable(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
