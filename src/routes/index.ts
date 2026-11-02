import { Router, type NextFunction, type Request, type Response } from "express";
import { authenticate, requireRole, requireRoleForWrites } from "../modules/auth/auth.middleware";
import { Role } from "../types/enums";
import { prisma } from "../lib/prisma";
import { scopeToOwnStudents } from "../lib/student-access";
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
import { uploadRouter } from "../modules/upload/upload.route";
import { galleriesRouter } from "../modules/galleries/galleries.route";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/docs", docsRouter);
apiRouter.use("/auth", authRouter);

/**
 * Endpoint yang boleh diakses tanpa Bearer token.
 * Semua route yang di-mount SETELAH middleware ini wajib login.
 * - midtrans/notification : webhook Midtrans, diverifikasi pakai signature_key.
 * - events                : SSE, token diverifikasi sendiri lewat query ?token=.
 * - student-topic-progress: SEMENTARA — dipanggil scratch-gui / editor Python lewat
 *   fallbackUrl tanpa token. Ganti dengan progress token (lihat optimation.md 1.3).
 */
const PUBLIC_ENDPOINTS: Array<{ method: string; path: RegExp }> = [
  { method: "POST", path: /^\/academic\/payments\/midtrans\/notification\/?$/ },
  { method: "GET", path: /^\/academic\/events\/?$/ },
  { method: "POST", path: /^\/academic\/student-topic-progress\/?$/ },
];

function authenticateUnlessPublic(req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") return next();
  const isPublic = PUBLIC_ENDPOINTS.some(
    (e) => e.method === req.method && e.path.test(req.path),
  );
  if (isPublic) return next();
  return authenticate(req, res, next);
}

apiRouter.use(authenticateUnlessPublic);
apiRouter.use("/users", usersRouter);
// Data parent (nama, telepon, daftar anak) hanya untuk admin.
apiRouter.use("/parent-profiles", requireRole(Role.ADMIN), parentProfilesRouter);
apiRouter.use("/tutor-profiles", requireRoleForWrites(Role.ADMIN), tutorProfilesRouter);
apiRouter.use("/student-profiles", studentProfilesRouter);
apiRouter.use("/academic", academicRouter);
apiRouter.use("/gamification", gamificationRouter);
apiRouter.use("/request-class", requireRoleForWrites(Role.ADMIN), requestClassRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use(
  "/galleries",
  scopeToOwnStudents({
    findStudentIdById: async (id) =>
      (await prisma.gallery.findUnique({ where: { id }, select: { studentId: true } }))?.studentId,
  }),
  galleriesRouter,
);
