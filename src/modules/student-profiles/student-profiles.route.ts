import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { safeUserInclude } from "../../lib/safe-user";
import { createCrudRouter } from "../../lib/crud-router";
import { AppError } from "../../utils/app-error";
import {
  studentProfileCreateSchema,
  studentProfileUpdateSchema,
} from "./student-profiles.schema";
import type { NextFunction, Request, Response } from "express";
import { requireRoleForWrites } from "../auth/auth.middleware";
import { Role } from "../../types/enums";

const crudRouter = createCrudRouter({
  delegate: prisma.studentProfile,
  createSchema: studentProfileCreateSchema,
  updateSchema: studentProfileUpdateSchema,
  listWhere: (req: Request) => {
    // Parent dipaksa ke anaknya sendiri, student ke dirinya sendiri (lihat scopeStudentAccess).
    const parentId = req.scope?.parentId ?? (req.query.parentId as string | undefined);
    const showArchived = req.query.showArchived === "true";
    return {
      isActive: showArchived ? undefined : true,
      ...(parentId ? { parentId } : {}),
      ...(req.scope?.studentId ? { id: req.scope.studentId } : {}),
    };
  },
  include: {
    user: safeUserInclude,
    parent: true,
    category: true,
    enrollments: true,
    attendances: true,
    badgeLogs: true,
  },
});

export const studentProfilesRouter = Router();

/**
 * PARENT hanya boleh melihat anaknya, STUDENT hanya dirinya sendiri.
 * ADMIN & TUTOR melihat semua (tutor butuh daftar siswa di dashboard).
 */
async function scopeStudentAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.auth;
    if (!auth || auth.role === Role.ADMIN || auth.role === Role.TUTOR) return next();

    if (auth.role === Role.PARENT) {
      const parent = await prisma.parentProfile.findUnique({
        where: { userId: auth.userId },
        select: { id: true },
      });
      if (!parent) throw new AppError("Profil parent tidak ditemukan", 403);
      req.scope = { parentId: parent.id };
    } else {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: auth.userId },
        select: { id: true },
      });
      if (!student) throw new AppError("Profil siswa tidak ditemukan", 403);
      req.scope = { studentId: student.id };
    }

    // Detail by id: tolak jika bukan milik user ini.
    const id = req.path.split("/")[1];
    if (req.method === "GET" && id) {
      const target = await prisma.studentProfile.findUnique({
        where: { id },
        select: { id: true, parentId: true },
      });
      const allowed =
        target &&
        ((req.scope.parentId && target.parentId === req.scope.parentId) ||
          (req.scope.studentId && target.id === req.scope.studentId));
      if (!allowed) throw new AppError("Record not found", 404);
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

// Data siswa hanya diubah/dihapus admin. Pendaftaran siswa oleh parent lewat /auth/register/student.
studentProfilesRouter.use(requireRoleForWrites(Role.ADMIN));
studentProfilesRouter.use(scopeStudentAccess);

// Custom DELETE — hapus User → cascade ke profile & semua relasi
studentProfilesRouter.delete("/:id", async (req, res, next) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: req.params.id },
      select: { userId: true },
    });
    if (!profile) throw new AppError("Not found", 404);
    await prisma.user.delete({ where: { id: profile.userId } });
    return res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
});

studentProfilesRouter.use(crudRouter);
