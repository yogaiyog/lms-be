import { z } from "zod";

export const tutorCostCreateSchema = z.object({
  classType: z.string().min(1),
  cost: z.number().nonnegative(),
  description: z.string().optional().nullable(),
});

export const tutorCostUpdateSchema = z.object({
  classType: z.string().min(1).optional(),
  cost: z.number().nonnegative().optional(),
  description: z.string().optional().nullable(),
}).refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
