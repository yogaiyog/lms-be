import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { attendanceCreateSchema, attendanceUpdateSchema } from "./attendances.schema";

export const attendancesRouter = createCrudRouter({
  delegate: prisma.attendance,
  createSchema: attendanceCreateSchema,
  updateSchema: attendanceUpdateSchema,
  include: {
    schedule: true,
    student: true,
  },
});
