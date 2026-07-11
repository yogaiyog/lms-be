"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classesRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const classes_schema_1 = require("./classes.schema");
const prisma_error_1 = require("../../lib/prisma-error");
const app_error_1 = require("../../utils/app-error");
exports.classesRouter = (0, express_1.Router)();
const commonInclude = {
    tutors: true,
    category: true,
    enrollments: {
        include: {
            meetUsages: true,
        },
    },
    schedules: true,
    announcements: true,
    curriculum: {
        include: {
            topics: true,
            assessmentSet: {
                include: {
                    aspects: { orderBy: { order: "asc" } },
                },
            },
        },
    },
};
exports.classesRouter.get("/", async (req, res, next) => {
    try {
        const where = {};
        if (req.query.tutorId) {
            where.tutors = { some: { id: req.query.tutorId } };
        }
        const data = await prisma_1.prisma.class.findMany({
            where,
            include: commonInclude,
        });
        return res.json({ success: true, data });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.classesRouter.get("/:id", async (req, res, next) => {
    try {
        const item = await prisma_1.prisma.class.findUnique({
            where: { id: req.params.id },
            include: commonInclude,
        });
        if (!item)
            throw new app_error_1.AppError("Record not found", 404);
        return res.json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.classesRouter.post("/", async (req, res, next) => {
    try {
        const payload = classes_schema_1.classCreateSchema.parse(req.body);
        const lastClass = await prisma_1.prisma.class.findFirst({
            orderBy: { batch: "desc" },
            select: { batch: true },
        });
        const batch = (lastClass?.batch ?? 0) + 1;
        const { tutorIds, category, ...rest } = payload;
        const item = await prisma_1.prisma.class.create({
            data: {
                ...rest,
                batch,
                tutors: { connect: tutorIds.map((id) => ({ id })) },
            },
            include: commonInclude,
        });
        return res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.classesRouter.patch("/:id", async (req, res, next) => {
    try {
        const payload = classes_schema_1.classUpdateSchema.parse(req.body);
        const { tutorIds, category, ...rest } = payload;
        const updateData = { ...rest };
        if (tutorIds) {
            updateData.tutors = { set: tutorIds.map((id) => ({ id })) };
        }
        const item = await prisma_1.prisma.class.update({
            where: { id: req.params.id },
            data: updateData,
            include: commonInclude,
        });
        return res.json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.classesRouter.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.enrollment.updateMany({ where: { classId: id }, data: { classId: null } });
        await prisma_1.prisma.requestClass.updateMany({ where: { prevClassId: id }, data: { prevClassId: null } });
        await prisma_1.prisma.requestClass.updateMany({ where: { approvedClassId: id }, data: { approvedClassId: null } });
        const item = await prisma_1.prisma.class.delete({
            where: { id },
        });
        return res.json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
function handleError(error, _req, res, next) {
    const appError = (0, prisma_error_1.mapPrismaError)(error);
    if (appError.statusCode >= 500)
        return next(appError);
    return res.status(appError.statusCode).json({
        success: false,
        message: appError.message,
        code: appError.code,
    });
}
