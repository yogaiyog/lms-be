import { z } from "zod";

export const invoiceCreateSchema = z.object({
  enrollmentId: z.string().uuid(),
  description: z.string().optional(),
  meetCount: z.number().int().min(0).optional(),
  subtotal: z.number().min(0).optional(),
  registrationFee: z.number().min(0).optional(),
  taxPercent: z.number().min(0).optional(),
  dueDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const invoiceUpdateSchema = z
  .object({
    enrollmentId: z.string().uuid().optional(),
    description: z.string().nullable().optional(),
    meetCount: z.number().int().min(0).optional(),
    subtotal: z.number().min(0).optional(),
    registrationFee: z.number().min(0).nullable().optional(),
    taxPercent: z.number().min(0).nullable().optional(),
    dueDate: z.coerce.date().nullable().optional(),
    notes: z.string().nullable().optional(),
    status: z.enum(["DRAFT", "UNPAID", "PAID", "PARTIAL", "REFUNDED", "CANCELLED"]).optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field must be provided",
  );
