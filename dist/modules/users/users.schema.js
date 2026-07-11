"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userCreateSchema = void 0;
const enums_1 = require("../../types/enums");
const zod_1 = require("zod");
exports.userCreateSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.nativeEnum(enums_1.Role).optional(),
});
exports.userUpdateSchema = exports.userCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
