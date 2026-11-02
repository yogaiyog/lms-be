import { Router } from "express";
import { requireRoleForWrites } from "../auth/auth.middleware";
import { Role } from "../../types/enums";

const adminWrites = requireRoleForWrites(Role.ADMIN);
import { badgesRouter } from "../badges/badges.route";
import { studentBadgesRouter } from "../student-badges/student-badges.route";

export const gamificationRouter = Router();

gamificationRouter.use("/badges", adminWrites, badgesRouter);
gamificationRouter.use("/student-badges", adminWrites, studentBadgesRouter);
