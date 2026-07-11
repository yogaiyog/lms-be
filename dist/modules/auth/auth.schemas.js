"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSchema = exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.studentRegisterSchema = exports.tutorRegisterSchema = exports.parentRegisterSchema = exports.logoutSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const enums_1 = require("../../types/enums");
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(100),
    fullName: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.logoutSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1).optional(),
});
exports.parentRegisterSchema = exports.registerSchema;
exports.tutorRegisterSchema = exports.registerSchema.extend({
    bio: zod_1.z.string().optional().nullable(),
    avatarUrl: zod_1.z.string().url().optional().nullable(),
    meetLink: zod_1.z.string().url().optional().nullable(),
});
exports.studentRegisterSchema = exports.registerSchema.extend({
    parentId: zod_1.z.string().uuid(),
    nickname: zod_1.z.string().min(1),
    birthDate: zod_1.z.coerce.date(),
    phone: zod_1.z.string().min(1).optional(),
    avatarUrl: zod_1.z.string().url().optional().nullable(),
    categoryId: zod_1.z.string().uuid().optional().nullable(),
    category: zod_1.z.nativeEnum(enums_1.Category).optional(),
    school: zod_1.z.string().optional().nullable(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    password: zod_1.z.string().min(8).max(100),
});
exports.verifyEmailSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
});
exports.roleSchema = zod_1.z.nativeEnum(enums_1.Role);
