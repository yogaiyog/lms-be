import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  studentProfileCreateSchema,
  studentProfileUpdateSchema,
} from "./student-profiles.schema";
import type { Request } from "express";

export const studentProfilesRouter = createCrudRouter({
  delegate: prisma.studentProfile,
  createSchema: studentProfileCreateSchema,
  updateSchema: studentProfileUpdateSchema,
  listWhere: (req: Request) => {
    const parentId = req.query.parentId as string | undefined;
    if (parentId) return { parentId };
    return {};
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
