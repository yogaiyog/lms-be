import { Category, Role } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  fullName: z.string().min(1),
  phone: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export const parentRegisterSchema = registerSchema;

export const tutorRegisterSchema = registerSchema.extend({
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const studentRegisterSchema = registerSchema.extend({
  parentId: z.string().uuid(),
  nickname: z.string().min(1),
  birthDate: z.coerce.date(),
  avatarUrl: z.string().url().optional().nullable(),
  category: z.nativeEnum(Category),
});

export const roleSchema = z.nativeEnum(Role);
