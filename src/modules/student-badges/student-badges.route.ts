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
  include: {
    student: true,
    badge: true,
  },
});
