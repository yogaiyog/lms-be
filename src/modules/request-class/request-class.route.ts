import { prisma } from "../../lib/prisma";
import { safeUserInclude } from "../../lib/safe-user";
import { createCrudRouter } from "../../lib/crud-router";
import { requestClassCreateSchema, requestClassUpdateSchema } from "./request-class.schema";

export const requestClassRouter = createCrudRouter({
  delegate: prisma.requestClass,
  createSchema: requestClassCreateSchema,
  updateSchema: requestClassUpdateSchema,
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.parentId) where.parentId = req.query.parentId;
    if (req.query.studentId) where.studentId = req.query.studentId;
    return where;
  },
  include: {
    student: {
      include: { user: safeUserInclude },
    },
    parent: true,
    prevClass: true,
    preferredTutor: { include: { user: safeUserInclude } },
    approvedClass: true,
  },
});
