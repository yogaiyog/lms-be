import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { AppError } from "../../utils/app-error";
import {
  studentProfileCreateSchema,
  studentProfileUpdateSchema,
} from "./student-profiles.schema";
import type { Request } from "express";

const crudRouter = createCrudRouter({
  delegate: prisma.studentProfile,
  createSchema: studentProfileCreateSchema,
  updateSchema: studentProfileUpdateSchema,
  listWhere: (req: Request) => {
    const parentId = req.query.parentId as string | undefined;
    const showArchived = req.query.showArchived === "true";
    return {
      isActive: showArchived ? undefined : true,
      ...(parentId ? { parentId } : {}),
    };
  },
  include: {
    user: true,
    parent: true,
    category: true,
    enrollments: true,
    attendances: true,
    badgeLogs: true,
  },
});

export const studentProfilesRouter = Router();

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
