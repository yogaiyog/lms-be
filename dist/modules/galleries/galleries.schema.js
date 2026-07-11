"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryUpdateSchema = exports.galleryCreateSchema = void 0;
const zod_1 = require("zod");
exports.galleryCreateSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    imageUrl: zod_1.z.string().min(1),
    caption: zod_1.z.string().optional(),
});
exports.galleryUpdateSchema = zod_1.z.object({
    imageUrl: zod_1.z.string().min(1).optional(),
    caption: zod_1.z.string().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
