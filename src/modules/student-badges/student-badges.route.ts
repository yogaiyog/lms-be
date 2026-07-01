import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  studentBadgeCreateSchema,
  studentBadgeUpdateSchema,
} from "./student-badges.schema";

export const studentBadgesRouter = createCrudRouter({
  delegate: prisma.studentBadge,
  createSchema: studentBadgeCreateSchema,
  updateSchema: studentBadgeUpdateSchema,
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.studentId) where.studentId = req.query.studentId;
    return where;
  },
  include: {
    student: true,
    badge: true,
  },
});
