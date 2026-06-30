import { Role } from "../../types/enums";
import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).optional(),
});

export const userUpdateSchema = userCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
