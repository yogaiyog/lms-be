import { z } from "zod";

export const parentProfileCreateSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().min(1),
  phone: z.string().min(1),
});

export const parentProfileUpdateSchema = parentProfileCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
