"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceUpdateSchema = exports.invoiceCreateSchema = void 0;
const zod_1 = require("zod");
exports.invoiceCreateSchema = zod_1.z.object({
    enrollmentId: zod_1.z.string().uuid(),
    description: zod_1.z.string().optional(),
    meetCount: zod_1.z.number().int().min(0).optional(),
    subtotal: zod_1.z.number().min(0).optional(),
    registrationFee: zod_1.z.number().min(0).optional(),
    taxPercent: zod_1.z.number().min(0).optional(),
    dueDate: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
});
exports.invoiceUpdateSchema = zod_1.z
    .object({
    enrollmentId: zod_1.z.string().uuid().optional(),
    description: zod_1.z.string().nullable().optional(),
    meetCount: zod_1.z.number().int().min(0).optional(),
    subtotal: zod_1.z.number().min(0).optional(),
    registrationFee: zod_1.z.number().min(0).nullable().optional(),
    taxPercent: zod_1.z.number().min(0).nullable().optional(),
    dueDate: zod_1.z.coerce.date().nullable().optional(),
    notes: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(["DRAFT", "UNPAID", "PAID", "PARTIAL", "REFUNDED", "CANCELLED"]).optional(),
})
    .refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
