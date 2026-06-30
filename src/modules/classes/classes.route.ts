import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { classCreateSchema, classUpdateSchema } from "./classes.schema";

export const classesRouter = createCrudRouter({
  delegate: prisma.class,
  createSchema: classCreateSchema,
  updateSchema: classUpdateSchema,
  include: {
    tutor: true,
    enrollments: true,
    schedules: true,
    announcements: true,
  },
});
