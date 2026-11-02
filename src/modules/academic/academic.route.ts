import { Router } from "express";
import { requireRole, requireRoleForWrites } from "../auth/auth.middleware";
import { Role } from "../../types/enums";
import { prisma } from "../../lib/prisma";
import { scopeToOwnStudents } from "../../lib/student-access";

const adminWrites = requireRoleForWrites(Role.ADMIN);
const adminOnly = requireRole(Role.ADMIN);
import { classesRouter } from "../classes/classes.route";
import { enrollmentsRouter } from "../enrollments/enrollments.route";
import { schedulesRouter } from "../schedules/schedules.route";
import { attendancesRouter } from "../attendances/attendances.route";
import { announcementsRouter } from "../announcements/announcements.route";
import { curriculumsRouter } from "../curriculums/curriculums.route";
import { topicsRouter } from "../topics/topics.route";
import { tutorSlotsRouter } from "../tutor-slots/tutor-slots.route";
import { assessmentSetsRouter } from "../assessment-sets/assessment-sets.route";
import { assessmentAspectsRouter } from "../assessment-aspects/assessment-aspects.route";
import { attendanceAssessmentsRouter } from "../attendance-assessments/attendance-assessments.route";
import { attendanceAssessmentScoresRouter } from "../attendance-assessment-scores/attendance-assessment-scores.route";
import { reportsRouter } from "./reports.route";
import { savedReportsRouter } from "./saved-reports.route";
import { certificatesRouter } from "../certificates/certificates.route";
import { categoriesRouter } from "../categories/categories.route";
import { studentTopicProgressRouter } from "../student-topic-progress/student-topic-progress.route";
import { roadmapRouter } from "../roadmap/roadmap.route";
import { quizRouter } from "../quiz/quiz.route";
import { topicTaskRouter } from "../topic-task/topic-task.route";
import { invoicesRouter } from "../invoices/invoices.route";
import { paymentsRouter } from "../payments/payments.route";
import { eventsRouter } from "./events.route";
import { expensesRouter } from "../expenses/expenses.route";
import { tutorCostsRouter } from "../tutor-costs/tutor-costs.route";

export const academicRouter = Router();

academicRouter.use("/classes", adminWrites, classesRouter);
academicRouter.use(
  "/enrollments",
  scopeToOwnStudents({
    findStudentIdById: async (id) =>
      (await prisma.enrollment.findUnique({ where: { id }, select: { studentId: true } }))?.studentId,
    // Parent mendaftarkan anaknya ke kurikulum.
    writes: [{ method: "POST", path: /^\/?$/, studentId: (req) => req.body?.studentId }],
  }),
  enrollmentsRouter,
);
academicRouter.use("/schedules", schedulesRouter);
academicRouter.use(
  "/attendances",
  scopeToOwnStudents({
    findStudentIdById: async (id) =>
      (await prisma.attendance.findUnique({ where: { id }, select: { studentId: true } }))?.studentId,
  }),
  attendancesRouter,
);
academicRouter.use("/announcements", announcementsRouter);
academicRouter.use("/curriculums", adminWrites, curriculumsRouter);
academicRouter.use("/topics", adminWrites, topicsRouter);
academicRouter.use("/tutor-slots", tutorSlotsRouter);
academicRouter.use("/assessment-sets", adminWrites, assessmentSetsRouter);
academicRouter.use("/assessment-aspects", adminWrites, assessmentAspectsRouter);
academicRouter.use("/attendance-assessments", attendanceAssessmentsRouter);
academicRouter.use("/attendance-assessment-scores", attendanceAssessmentScoresRouter);
academicRouter.use("/reports", reportsRouter);
academicRouter.use("/saved-reports", scopeToOwnStudents(), savedReportsRouter);
academicRouter.use(
  "/certificates",
  scopeToOwnStudents({
    findStudentIdById: async (id) =>
      (await prisma.certificate.findUnique({ where: { id }, select: { studentId: true } }))?.studentId,
    // Pratinjau PDF sertifikat (data dikirim klien, tidak menyimpan apa pun).
    writes: [{ method: "POST", path: /^\/generate-pdf\/?$/, studentId: () => null }],
  }),
  certificatesRouter,
);
academicRouter.use("/categories", adminWrites, categoriesRouter);
academicRouter.use("/student-topic-progress", studentTopicProgressRouter);
academicRouter.use("/roadmap", roadmapRouter);
// Guard role ada di dalam quizRouter: siswa boleh POST /answer & /submit, tulis soal khusus ADMIN.
academicRouter.use("/quiz", quizRouter);
academicRouter.use("/topic-tasks", adminWrites, topicTaskRouter);
academicRouter.use("/invoices", invoicesRouter);
academicRouter.use("/payments", paymentsRouter);
academicRouter.use("/expenses", requireRole(Role.ADMIN, Role.TUTOR), expensesRouter);
academicRouter.use("/tutor-costs", adminOnly, tutorCostsRouter);
academicRouter.use("/events", eventsRouter);
