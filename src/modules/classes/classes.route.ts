import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { classCreateSchema, classUpdateSchema } from "./classes.schema";

export const classesRouter = createCrudRouter({
  delegate: prisma.class,
  createSchema: classCreateSchema,
  updateSchema: classUpdateSchema,
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.tutorId) where.tutorId = req.query.tutorId;
    return where;
  },
  include: {
    tutor: true,
    enrollments: true,
    schedules: true,
    announcements: true,
    curriculum: {
      include: {
        topics: true,
      },
    },
  },
});
