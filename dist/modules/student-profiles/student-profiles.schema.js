"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentProfileUpdateSchema = exports.studentProfileCreateSchema = void 0;
const enums_1 = require("../../types/enums");
const zod_1 = require("zod");
const studentProfileBase = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    parentId: zod_1.z.string().uuid(),
    fullName: zod_1.z.string().min(1),
    nickname: zod_1.z.string().min(1),
    birthDate: zod_1.z.coerce.date(),
    avatarUrl: zod_1.z.string().url().optional().nullable(),
    categoryId: zod_1.z.string().uuid().optional().nullable(),
    category: zod_1.z.nativeEnum(enums_1.Category).optional(),
    totalXp: zod_1.z.number().int().min(0).optional(),
    currentStreak: zod_1.z.number().int().min(0).optional(),
    lastActive: zod_1.z.coerce.date().optional().nullable(),
    school: zod_1.z.string().optional().nullable(),
});
exports.studentProfileCreateSchema = studentProfileBase.transform(({ category, ...rest }) => rest);
exports.studentProfileUpdateSchema = studentProfileBase.partial().extend({
    isActive: zod_1.z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided").transform(({ category, ...rest }) => rest);
