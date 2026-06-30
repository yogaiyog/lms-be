import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  studentProfileCreateSchema,
  studentProfileUpdateSchema,
} from "./student-profiles.schema";

export const studentProfilesRouter = createCrudRouter({
  delegate: prisma.studentProfile,
  createSchema: studentProfileCreateSchema,
  updateSchema: studentProfileUpdateSchema,
  include: {
    user: true,
    parent: true,
    enrollments: true,
    attendances: true,
    badgeLogs: true,
  },
});
