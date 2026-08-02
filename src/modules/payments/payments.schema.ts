import { z } from "zod";

export const paymentCreateSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().min(0),
  paymentMethod: z.string().optional(),
  status: z.enum(["PENDING", "SETTLEMENT", "EXPIRED", "DENY", "REFUND"]).optional(),
  transactionId: z.string().optional(),
  gateway: z.string().optional(),
  paidAt: z.coerce.date().optional(),
});

export const paymentUpdateSchema = z
  .object({
    amount: z.number().min(0).optional(),
    paymentMethod: z.string().nullable().optional(),
    status: z.enum(["PENDING", "SETTLEMENT", "EXPIRED", "DENY", "REFUND"]).optional(),
    transactionId: z.string().nullable().optional(),
    gateway: z.string().nullable().optional(),
    paidAt: z.coerce.date().nullable().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field must be provided",
  );

export const midtransChargeSchema = z.object({
  invoiceId: z.string().uuid(),
  method: z.enum(["bank_transfer", "qris", "gopay", "shopeepay", "dana"]),
  bank: z.enum(["bca", "bni", "bri", "mandiri", "permata"]).optional(),
  amount: z.number().min(1).optional(),
}).refine(
  (value) => (value.method === "bank_transfer" ? !!value.bank : true),
  "Bank wajib dipilih untuk Virtual Account",
);
