import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { attendanceCreateSchema, attendanceUpdateSchema } from "./attendances.schema";

export const attendancesRouter = createCrudRouter({
  delegate: prisma.attendance,
  createSchema: attendanceCreateSchema,
  updateSchema: attendanceUpdateSchema,
  include: {
    schedule: true,
    student: true,
    assessment: {
      include: {
        scores: {
          include: { aspect: true },
          orderBy: { aspect: { order: "asc" as const } },
        },
      },
    },
  },
  afterCreate: async (payload, _item) => {
    const { scheduleId, studentId, date } = payload as any;

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      select: { classId: true },
    });
    if (!schedule) return;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: { studentId, classId: schedule.classId },
      },
    });
    if (!enrollment || enrollment.totalMeetLeft <= 0) return;

    await prisma.$transaction([
      prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { totalMeetLeft: { decrement: 1 } },
      }),
      prisma.meetUsage.create({
        data: {
          enrollmentId: enrollment.id,
          scheduleId,
          studentId,
          date: new Date(date),
        },
      }),
    ]);
  },
});
