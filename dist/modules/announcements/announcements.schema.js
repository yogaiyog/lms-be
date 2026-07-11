"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementUpdateSchema = exports.announcementCreateSchema = void 0;
const zod_1 = require("zod");
exports.announcementCreateSchema = zod_1.z.object({
    classId: zod_1.z.string().uuid(),
    tutorId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
});
exports.announcementUpdateSchema = exports.announcementCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
