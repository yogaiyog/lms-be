"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeUpdateSchema = exports.badgeCreateSchema = void 0;
const zod_1 = require("zod");
exports.badgeCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url(),
    xpBonus: zod_1.z.number().int().min(0).optional(),
});
exports.badgeUpdateSchema = exports.badgeCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
