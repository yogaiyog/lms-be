import { z } from "zod";

export const badgeCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().url(),
  xpBonus: z.number().int().min(0).optional(),
});

export const badgeUpdateSchema = badgeCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
