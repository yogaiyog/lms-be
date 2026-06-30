import { Router } from "express";
import { classesRouter } from "../classes/classes.route";
import { enrollmentsRouter } from "../enrollments/enrollments.route";
import { schedulesRouter } from "../schedules/schedules.route";
import { attendancesRouter } from "../attendances/attendances.route";
import { announcementsRouter } from "../announcements/announcements.route";

export const academicRouter = Router();

academicRouter.use("/classes", classesRouter);
academicRouter.use("/enrollments", enrollmentsRouter);
academicRouter.use("/schedules", schedulesRouter);
academicRouter.use("/attendances", attendancesRouter);
academicRouter.use("/announcements", announcementsRouter);
