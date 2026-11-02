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
