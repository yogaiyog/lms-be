"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentBadgeUpdateSchema = exports.studentBadgeCreateSchema = void 0;
const zod_1 = require("zod");
exports.studentBadgeCreateSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    badgeId: zod_1.z.string().uuid(),
    earnedAt: zod_1.z.coerce.date().optional(),
});
exports.studentBadgeUpdateSchema = exports.studentBadgeCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
