import { Router } from "express";
import { classesRouter } from "../classes/classes.route";
import { enrollmentsRouter } from "../enrollments/enrollments.route";
import { schedulesRouter } from "../schedules/schedules.route";
import { attendancesRouter } from "../attendances/attendances.route";
import { announcementsRouter } from "../announcements/announcements.route";
import { curriculumsRouter } from "../curriculums/curriculums.route";
import { topicsRouter } from "../topics/topics.route";
import { tutorSlotsRouter } from "../tutor-slots/tutor-slots.route";

export const academicRouter = Router();

academicRouter.use("/classes", classesRouter);
academicRouter.use("/enrollments", enrollmentsRouter);
academicRouter.use("/schedules", schedulesRouter);
academicRouter.use("/attendances", attendancesRouter);
academicRouter.use("/announcements", announcementsRouter);
academicRouter.use("/curriculums", curriculumsRouter);
academicRouter.use("/topics", topicsRouter);
academicRouter.use("/tutor-slots", tutorSlotsRouter);
