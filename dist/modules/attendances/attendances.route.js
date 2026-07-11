"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendancesRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const attendances_schema_1 = require("./attendances.schema");
exports.attendancesRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.attendance,
    createSchema: attendances_schema_1.attendanceCreateSchema,
    updateSchema: attendances_schema_1.attendanceUpdateSchema,
    include: {
        schedule: true,
        student: true,
        tutor: true,
        assessment: {
            include: {
                scores: {
                    include: { aspect: true },
                    orderBy: { aspect: { order: "asc" } },
                },
            },
        },
    },
    afterCreate: async (payload, item) => {
        const { scheduleId, studentId, date, status } = payload;
        if (status === "RESCHEDULE")
            return;
        const schedule = await prisma_1.prisma.schedule.findUnique({
            where: { id: scheduleId },
            select: { classId: true },
        });
        if (!schedule)
            return;
        const enrollment = await prisma_1.prisma.enrollment.findUnique({
            where: {
                studentId_classId: { studentId, classId: schedule.classId },
            },
        });
        if (!enrollment || enrollment.totalMeetLeft <= 0)
            return;
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.enrollment.update({
                where: { id: enrollment.id },
                data: { totalMeetLeft: { decrement: 1 } },
            }),
            prisma_1.prisma.meetUsage.create({
                data: {
                    enrollmentId: enrollment.id,
                    scheduleId,
                    studentId,
                    attendanceId: item.id,
                    date: new Date(date),
                },
            }),
        ]);
    },
});
