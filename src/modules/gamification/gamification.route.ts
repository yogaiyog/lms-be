import { Router } from "express";
import { requireRoleForWrites } from "../auth/auth.middleware";
import { Role } from "../../types/enums";
import { prisma } from "../../lib/prisma";
import { scopeToOwnStudents } from "../../lib/student-access";

const adminWrites = requireRoleForWrites(Role.ADMIN);
import { badgesRouter } from "../badges/badges.route";
import { studentBadgesRouter } from "../student-badges/student-badges.route";

export const gamificationRouter = Router();

gamificationRouter.use("/badges", adminWrites, badgesRouter);
gamificationRouter.use(
  "/student-badges",
  adminWrites,
  scopeToOwnStudents({
    findStudentIdById: async (id) =>
      (await prisma.studentBadge.findUnique({ where: { id }, select: { studentId: true } }))?.studentId,
  }),
  studentBadgesRouter,
);
