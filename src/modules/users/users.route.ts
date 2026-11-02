import bcrypt from "bcryptjs";
import { Router, type NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { mapPrismaError } from "../../lib/prisma-error";
import { safeUserSelect } from "../../lib/safe-user";
import { AppError } from "../../utils/app-error";
import { requireRole } from "../auth/auth.middleware";
import { Role } from "../../types/enums";
import { userCreateSchema, userUpdateSchema } from "./users.schema";

const PASSWORD_SALT_ROUNDS = 12;

// Kolom aman + profil. Tidak pernah mengirim password / token reset / token verifikasi.
const userSelect = {
  ...safeUserSelect,
  parentProfile: true,
  tutorProfile: true,
  studentProfile: true,
} as const;

function handleError(error: unknown, _req: Request, res: Response, next: NextFunction) {
  const appError = mapPrismaError(error);
  if (appError.statusCode >= 500) return next(appError);
  return res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    code: appError.code,
  });
}

export const usersRouter = Router();

// Seluruh endpoint user hanya untuk ADMIN.
usersRouter.use(requireRole(Role.ADMIN));

usersRouter.get("/", async (req, res, next) => {
  try {
    const takeRaw = Number(req.query.take);
    const skipRaw = Number(req.query.skip);
    const take = Number.isFinite(takeRaw) ? Math.min(Math.max(Math.trunc(takeRaw), 1), 100) : 20;
    const skip = Number.isFinite(skipRaw) ? Math.max(Math.trunc(skipRaw), 0) : 0;

    const data = await prisma.user.findMany({ select: userSelect, take, skip });
    return res.json({ success: true, data, meta: { take, skip, count: data.length } });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.user.findUnique({ where: { id: req.params.id }, select: userSelect });
    if (!item) throw new AppError("Record not found", 404);
    return res.json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const { password, ...rest } = userCreateSchema.parse(req.body);
    const item = await prisma.user.create({
      data: { ...rest, password: await bcrypt.hash(password, PASSWORD_SALT_ROUNDS) },
      select: userSelect,
    });
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

usersRouter.patch("/:id", async (req, res, next) => {
  try {
    const { password, ...rest } = userUpdateSchema.parse(req.body);
    const item = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(password ? { password: await bcrypt.hash(password, PASSWORD_SALT_ROUNDS) } : {}),
      },
      select: userSelect,
    });

    // Password diganti admin → cabut semua sesi lama user tsb.
    if (password) {
      await prisma.refreshToken.updateMany({
        where: { userId: req.params.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    if (req.auth?.userId === req.params.id) {
      throw new AppError("Tidak bisa menghapus akun sendiri", 400);
    }
    const item = await prisma.user.delete({ where: { id: req.params.id }, select: safeUserSelect });
    return res.json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});
