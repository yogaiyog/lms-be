import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { AppError } from "../../utils/app-error";
import {
  parentProfileCreateSchema,
  parentProfileUpdateSchema,
} from "./parent-profiles.schema";

import type { Request } from "express";

const crudRouter = createCrudRouter({
  delegate: prisma.parentProfile,
  createSchema: parentProfileCreateSchema,
  updateSchema: parentProfileUpdateSchema,
  listWhere: (req: Request) => ({
    isActive: req.query.showArchived === "true" ? undefined : true,
  }),
  include: {
    user: true,
    students: true,
  },
});

export const parentProfilesRouter = Router();

// Custom DELETE — hapus User → cascade ke profile, students, & semua relasi
parentProfilesRouter.delete("/:id", async (req, res, next) => {
  try {
    const profile = await prisma.parentProfile.findUnique({
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

parentProfilesRouter.use(crudRouter);
