import type { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma";
import { Role } from "../types/enums";

type AuthInfo = { userId: string; role: Role } | undefined;

/**
 * Apakah user yang login boleh membaca/menulis data milik `studentId`?
 * - ADMIN, TUTOR : semua siswa
 * - PARENT       : hanya anaknya sendiri
 * - STUDENT      : hanya dirinya sendiri
 */
export async function canAccessStudent(auth: AuthInfo, studentId: string): Promise<boolean> {
  if (!auth || !studentId) return false;
  if (auth.role === Role.ADMIN || auth.role === Role.TUTOR) return true;

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { userId: true, parent: { select: { userId: true } } },
  });
  if (!student) return false;

  if (auth.role === Role.STUDENT) return student.userId === auth.userId;
  if (auth.role === Role.PARENT) return student.parent?.userId === auth.userId;
  return false;
}

type ScopeWriteRule = {
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  path: RegExp;
  /** studentId target dari request; null = tidak terkait siswa tertentu (boleh). */
  studentId: (req: Request) => string | null | undefined;
};

type ScopeOptions = {
  /** Cari studentId pemilik record untuk rute GET /:id. */
  findStudentIdById?: (id: string) => Promise<string | null | undefined>;
  /** Operasi tulis yang boleh dilakukan PARENT/STUDENT. Selain ini → 403. */
  writes?: ScopeWriteRule[];
};

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function deny(res: Response, status: 403 | 404, message: string) {
  return res.status(status).json({ success: false, message, code: status === 403 ? "FORBIDDEN" : "NOT_FOUND" });
}

/**
 * Batasi resource milik siswa (enrollment, sertifikat, galeri, absensi, badge, laporan)
 * untuk PARENT & STUDENT: hanya boleh menyentuh data siswa miliknya.
 * ADMIN & TUTOR diteruskan tanpa batasan.
 *
 * Bentuk rute yang dikenali (relatif terhadap mount): GET /student/:studentId,
 * GET /?studentId=..., GET /:id (lewat findStudentIdById).
 */
export function scopeToOwnStudents(opts: ScopeOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = req.auth;
      if (!auth || auth.role === Role.ADMIN || auth.role === Role.TUTOR) return next();

      if (!READ_METHODS.has(req.method)) {
        const rule = opts.writes?.find((w) => w.method === req.method && w.path.test(req.path));
        if (!rule) return deny(res, 403, "Role tidak memiliki akses");
        const sid = rule.studentId(req);
        if (sid === null) return next();
        if (!sid || !(await canAccessStudent(auth, sid))) {
          return deny(res, 403, "Tidak boleh mengakses siswa ini");
        }
        return next();
      }

      const byStudentPath = req.path.match(/^\/student\/([^/]+)\/?$/);
      const queryStudentId = typeof req.query.studentId === "string" ? req.query.studentId : undefined;
      let sid = byStudentPath?.[1] ?? queryStudentId;

      if (!sid) {
        const byId = req.path.match(/^\/([^/]+)\/?$/);
        if (!byId || !opts.findStudentIdById) {
          // Daftar tanpa filter siswa (mis. GET /) hanya untuk admin/tutor.
          return deny(res, 403, "Sertakan studentId");
        }
        sid = (await opts.findStudentIdById(byId[1])) ?? undefined;
        if (!sid) return deny(res, 404, "Record not found");
      }

      if (!(await canAccessStudent(auth, sid))) {
        return byStudentPath || queryStudentId
          ? deny(res, 403, "Tidak boleh mengakses siswa ini")
          : deny(res, 404, "Record not found");
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
