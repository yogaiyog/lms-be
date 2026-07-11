"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_middleware_1 = require("../auth/auth.middleware");
const report_pdf_service_1 = require("../../services/report-pdf/report-pdf.service");
exports.reportsRouter = (0, express_1.Router)();
const reportPdfService = new report_pdf_service_1.ReportPdfService();
exports.reportsRouter.get("/schedule/:scheduleId", auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const scheduleId = Array.isArray(req.params.scheduleId) ? req.params.scheduleId[0] : req.params.scheduleId;
        // Get schedule with attendances and assessments
        const schedule = await prisma_1.prisma.schedule.findUnique({
            where: { id: scheduleId },
            include: {
                class: {
                    include: {
                        tutors: true,
                    },
                },
                attendances: {
                    include: {
                        student: true,
                        assessment: {
                            include: {
                                scores: {
                                    include: {
                                        aspect: true,
                                    },
                                },
                            },
                        },
                    },
                },
                topicRef: true,
            },
        });
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        // Process each student's data
        const studentsReports = schedule.attendances
            .filter((att) => att.assessment) // Only include students with assessment
            .map((attendance) => {
            const assessment = attendance.assessment;
            // Calculate total score and percentage
            const totalScore = assessment.scores.reduce((sum, s) => sum + s.score, 0);
            const maxPossibleScore = assessment.scores.reduce((sum, s) => sum + s.aspect.maxScore, 0);
            const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
            // Generate summary based on percentage
            let summary = "";
            if (percentage >= 80) {
                summary = `Siswa ${attendance.student.nickname} menunjukkan performa yang sangat baik pada sesi ini.`;
            }
            else if (percentage >= 60) {
                summary = `Siswa ${attendance.student.nickname} menunjukkan performa yang cukup baik, tetapi masih ada ruang untuk improvement.`;
            }
            else if (percentage >= 40) {
                summary = `Siswa ${attendance.student.nickname} membutuhkan perhatian lebih, performa pada sesi ini masih kurang memuaskan.`;
            }
            else {
                summary = `Siswa ${attendance.student.nickname} membutuhkan bimbingan intensif, performa pada sesi ini sangat kurang.`;
            }
            // Generate per-aspect analysis with narratives
            const aspectAnalysis = assessment.scores.map((s) => {
                const pct = s.aspect.maxScore > 0 ? (s.score / s.aspect.maxScore) * 100 : 0;
                const isStrength = pct >= 50;
                const studentName = attendance.student.nickname || attendance.student.fullName;
                const desc = s.aspect.description ? ` yaitu ${s.aspect.description}` : "";
                const narrative = isStrength
                    ? `${studentName} memiliki kelebihan di ${s.aspect.title}${desc}`
                    : `${studentName} memiliki kekurangan di ${s.aspect.title}${desc}`;
                return {
                    aspectTitle: s.aspect.title,
                    aspectDescription: s.aspect.description,
                    icon: s.aspect.icon,
                    score: s.score,
                    maxScore: s.aspect.maxScore,
                    percentage: pct,
                    type: isStrength ? "strength" : "weakness",
                    narrative,
                };
            });
            return {
                student: {
                    id: attendance.student.id,
                    fullName: attendance.student.fullName,
                    nickname: attendance.student.nickname,
                },
                attendance: {
                    status: attendance.status,
                    notes: attendance.notes,
                },
                assessment: {
                    percentage: assessment.percentage ?? percentage,
                    mentorComment: assessment.mentorComment,
                    totalScore,
                    maxPossibleScore,
                    scores: assessment.scores.map((s) => ({
                        aspectTitle: s.aspect.title,
                        aspectDescription: s.aspect.description,
                        score: s.score,
                        maxScore: s.aspect.maxScore,
                        notes: s.notes,
                    })),
                },
                summary,
                aspectAnalysis,
            };
        });
        // Calculate class average
        const classAverage = studentsReports.length > 0
            ? studentsReports.reduce((sum, r) => sum + r.assessment.percentage, 0) / studentsReports.length
            : 0;
        const report = {
            schedule: {
                id: schedule.id,
                date: schedule.date,
                topic: schedule.topic,
                topicRef: schedule.topicRef,
                className: schedule.class.name,
                tutorName: schedule.class.tutors.map((t) => t.fullName).join(", "),
            },
            classAverage,
            students: studentsReports,
        };
        res.json({
            success: true,
            data: report,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.reportsRouter.get("/student/:studentId/report-summary", auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const studentId = Array.isArray(req.params.studentId) ? req.params.studentId[0] : req.params.studentId;
        const attendanceIds = typeof req.query.attendanceIds === "string"
            ? req.query.attendanceIds.split(",").filter(Boolean)
            : [];
        if (attendanceIds.length === 0) {
            return res.status(400).json({ message: "attendanceIds query param required" });
        }
        const attendances = await prisma_1.prisma.attendance.findMany({
            where: {
                id: { in: attendanceIds },
                studentId,
                assessment: { isNot: null },
            },
            include: {
                student: true,
                schedule: true,
                assessment: {
                    include: {
                        scores: {
                            include: {
                                aspect: true,
                            },
                        },
                    },
                },
            },
        });
        if (attendances.length === 0) {
            return res.status(404).json({ message: "No attendances found" });
        }
        const statusCounts = { PRESENT: 0, LATE: 0, ABSENT: 0, SICK: 0, PERMISSION: 0 };
        let totalScore = 0;
        let maxScore = 0;
        const topicsSet = new Set();
        for (const att of attendances) {
            const assessment = att.assessment;
            const scores = assessment.scores ?? [];
            totalScore += assessment.totalScore ?? scores.reduce((sum, s) => sum + s.score, 0);
            maxScore += scores.reduce((sum, s) => sum + s.aspect.maxScore, 0);
            if (statusCounts[att.status] !== undefined) {
                statusCounts[att.status]++;
            }
            if (att.schedule?.topic) {
                topicsSet.add(att.schedule.topic);
            }
        }
        const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
        res.json({
            success: true,
            data: {
                student: {
                    id: attendances[0].student.id,
                    fullName: attendances[0].student.fullName,
                    nickname: attendances[0].student.nickname,
                },
                generatedAt: new Date().toISOString(),
                selectedCount: attendances.length,
                totalScore,
                maxScore,
                scorePercentage,
                statusCounts,
                topics: Array.from(topicsSet),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.reportsRouter.get("/class/:classId/done-schedules", auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const classId = Array.isArray(req.params.classId) ? req.params.classId[0] : req.params.classId;
        const schedules = await prisma_1.prisma.schedule.findMany({
            where: {
                classId,
                isDone: true,
                attendances: {
                    some: {
                        assessment: {
                            isNot: null,
                        },
                    },
                },
            },
            include: {
                attendances: {
                    include: {
                        assessment: true,
                    },
                },
                topicRef: true,
            },
            orderBy: {
                date: "desc",
            },
        });
        res.json({
            success: true,
            data: schedules,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.reportsRouter.post("/generate-pdf", auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const pdfBuffer = await reportPdfService.generatePdf(req.body);
        const filename = `laporan-${(req.body.student?.fullName || "siswa").toLowerCase().replace(/\s+/g, "-")}.pdf`;
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": pdfBuffer.length.toString(),
        });
        res.send(pdfBuffer);
    }
    catch (error) {
        next(error);
    }
});
