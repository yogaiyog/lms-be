"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentsRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const enrollments_schema_1 = require("./enrollments.schema");
const prisma_error_1 = require("../../lib/prisma-error");
const app_error_1 = require("../../utils/app-error");
const include = { student: true, class: true, curriculum: true };
const baseRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.enrollment,
    createSchema: enrollments_schema_1.enrollmentCreateSchema,
    updateSchema: enrollments_schema_1.enrollmentUpdateSchema,
    include,
});
const router = (0, express_1.Router)();
exports.enrollmentsRouter = router;
// GET unassigned enrollments by curriculumId
router.get("/unassigned/:curriculumId", async (req, res, next) => {
    try {
        const { curriculumId } = req.params;
        const enrollments = await prisma_1.prisma.enrollment.findMany({
            where: { curriculumId, classId: null },
            include: { student: { include: { user: { select: { email: true } } } } },
        });
        return res.json({ success: true, data: enrollments });
    }
    catch (error) {
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// POST — custom with curriculum validation + duplicate check
router.post("/", async (req, res, next) => {
    try {
        const payload = enrollments_schema_1.enrollmentCreateSchema.parse(req.body);
        const curriculum = await prisma_1.prisma.curriculum.findUnique({
            where: { id: payload.curriculumId },
            select: { _count: { select: { topics: true } } },
        });
        if (!curriculum)
            throw new app_error_1.AppError("Curriculum not found", 404);
        const maxTopics = curriculum._count.topics;
        const totalMeetPurchased = payload.totalMeetPurchased ?? 0;
        if (totalMeetPurchased > maxTopics) {
            throw new app_error_1.AppError(`totalMeetPurchased (${totalMeetPurchased}) cannot exceed curriculum topics (${maxTopics})`, 400);
        }
        // Validate PRIVATE class — max 1 enrollment
        if (payload.classId) {
            const cls = await prisma_1.prisma.class.findUnique({
                where: { id: payload.classId },
                select: { type: true, _count: { select: { enrollments: true } } },
            });
            if (cls?.type === "PRIVATE" && cls._count.enrollments >= 1) {
                throw new app_error_1.AppError("Private class can only have 1 student", 400);
            }
        }
        // Prevent duplicate unassigned enrollment for same student+curriculum
        if (!payload.classId) {
            const existing = await prisma_1.prisma.enrollment.findFirst({
                where: { studentId: payload.studentId, curriculumId: payload.curriculumId, classId: null },
            });
            if (existing) {
                throw new app_error_1.AppError("Student already has an unassigned enrollment for this curriculum", 409);
            }
        }
        const item = await prisma_1.prisma.enrollment.create({
            data: {
                studentId: payload.studentId,
                classId: payload.classId ?? undefined,
                curriculumId: payload.curriculumId,
                totalMeetPurchased,
                totalMeetLeft: payload.totalMeetLeft ?? totalMeetPurchased,
                ...(payload.joinedAt ? { joinedAt: payload.joinedAt } : {}),
            },
            include,
        });
        return res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message).join("; "),
            });
        }
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// GET enrollments by studentId
router.get("/student/:studentId", async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const enrollments = await prisma_1.prisma.enrollment.findMany({
            where: { studentId },
            include: { ...include, curriculum: true },
        });
        return res.json({ success: true, data: enrollments });
    }
    catch (error) {
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// PATCH — custom with PRIVATE class validation
router.patch("/:id", async (req, res, next) => {
    try {
        const payload = enrollments_schema_1.enrollmentUpdateSchema.parse(req.body);
        if (payload.classId) {
            const cls = await prisma_1.prisma.class.findUnique({
                where: { id: payload.classId },
                select: { type: true, _count: { select: { enrollments: true } } },
            });
            if (cls?.type === "PRIVATE") {
                // Count enrollments already assigned to this class (exclude current enrollment)
                const current = await prisma_1.prisma.enrollment.findUnique({ where: { id: req.params.id } });
                if (!current)
                    throw new app_error_1.AppError("Enrollment not found", 404);
                const count = await prisma_1.prisma.enrollment.count({
                    where: { classId: payload.classId, id: { not: req.params.id } },
                });
                if (count >= 1) {
                    throw new app_error_1.AppError("Private class can only have 1 student", 400);
                }
            }
        }
        const item = await prisma_1.prisma.enrollment.update({
            where: { id: req.params.id },
            data: { ...payload, classId: payload.classId ?? null },
            include,
        });
        return res.json({ success: true, data: item });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message).join("; "),
            });
        }
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// GET enrollment by ID with full includes
router.get("/:id", async (req, res, next) => {
    try {
        const enrollment = await prisma_1.prisma.enrollment.findUnique({
            where: { id: req.params.id },
            include: {
                student: true,
                class: { include: { tutors: true } },
                curriculum: true,
            },
        });
        if (!enrollment) {
            return res.status(404).json({ success: false, message: "Enrollment not found" });
        }
        return res.json({ success: true, data: enrollment });
    }
    catch (error) {
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// Delegate remaining CRUD methods to baseRouter
router.get("/", (req, res, next) => baseRouter(req, res, next));
router.delete("/:id", (req, res, next) => baseRouter(req, res, next));
