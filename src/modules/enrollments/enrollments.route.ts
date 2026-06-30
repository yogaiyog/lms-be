import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { enrollmentCreateSchema, enrollmentUpdateSchema } from "./enrollments.schema";

export const enrollmentsRouter = createCrudRouter({
  delegate: prisma.enrollment,
  createSchema: enrollmentCreateSchema,
  updateSchema: enrollmentUpdateSchema,
  include: {
    student: true,
    class: true,
  },
});
