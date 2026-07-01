import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { usersRouter } from "../modules/users/users.route";
import { parentProfilesRouter } from "../modules/parent-profiles/parent-profiles.route";
import { tutorProfilesRouter } from "../modules/tutor-profiles/tutor-profiles.route";
import { studentProfilesRouter } from "../modules/student-profiles/student-profiles.route";
import { academicRouter } from "../modules/academic/academic.route";
import { gamificationRouter } from "../modules/gamification/gamification.route";
import { healthRouter } from "./health.route";
import { docsRouter } from "./docs.route";
import { requestClassRouter } from "../modules/request-class/request-class.route";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/docs", docsRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/parent-profiles", parentProfilesRouter);
apiRouter.use("/tutor-profiles", tutorProfilesRouter);
apiRouter.use("/student-profiles", studentProfilesRouter);
apiRouter.use("/academic", academicRouter);
apiRouter.use("/gamification", gamificationRouter);
apiRouter.use("/request-class", requestClassRouter);
