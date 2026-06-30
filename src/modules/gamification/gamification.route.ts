import { Router } from "express";
import { badgesRouter } from "../badges/badges.route";
import { studentBadgesRouter } from "../student-badges/student-badges.route";

export const gamificationRouter = Router();

gamificationRouter.use("/badges", badgesRouter);
gamificationRouter.use("/student-badges", studentBadgesRouter);
