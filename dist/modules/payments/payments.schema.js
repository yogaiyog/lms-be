"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midtransChargeSchema = exports.paymentUpdateSchema = exports.paymentCreateSchema = void 0;
const zod_1 = require("zod");
exports.paymentCreateSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().min(0),
    paymentMethod: zod_1.z.string().optional(),
    status: zod_1.z.enum(["PENDING", "SETTLEMENT", "EXPIRED", "DENY", "REFUND"]).optional(),
    transactionId: zod_1.z.string().optional(),
    gateway: zod_1.z.string().optional(),
    paidAt: zod_1.z.coerce.date().optional(),
});
exports.paymentUpdateSchema = zod_1.z
    .object({
    amount: zod_1.z.number().min(0).optional(),
    paymentMethod: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(["PENDING", "SETTLEMENT", "EXPIRED", "DENY", "REFUND"]).optional(),
    transactionId: zod_1.z.string().nullable().optional(),
    gateway: zod_1.z.string().nullable().optional(),
    paidAt: zod_1.z.coerce.date().nullable().optional(),
})
    .refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
exports.midtransChargeSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().uuid(),
    method: zod_1.z.enum(["bank_transfer", "qris", "gopay", "shopeepay", "dana"]),
    bank: zod_1.z.enum(["bca", "bni", "bri", "mandiri", "permata"]).optional(),
    amount: zod_1.z.number().min(1).optional(),
}).refine((value) => (value.method === "bank_transfer" ? !!value.bank : true), "Bank wajib dipilih untuk Virtual Account");
