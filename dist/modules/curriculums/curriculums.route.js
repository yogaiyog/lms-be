"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curriculumsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const prisma_error_1 = require("../../lib/prisma-error");
const app_error_1 = require("../../utils/app-error");
const curriculums_schema_1 = require("./curriculums.schema");
exports.curriculumsRouter = (0, express_1.Router)();
const commonInclude = {
    topics: {
        orderBy: { order: "asc" },
        include: { tasks: { orderBy: { order: "asc" } } },
    },
    assessmentSet: {
        include: { aspects: { orderBy: { order: "asc" } } },
    },
    categories: {
        include: { category: true },
    },
};
function handleError(error, _req, res, next) {
    const appError = (0, prisma_error_1.mapPrismaError)(error);
    if (appError.statusCode >= 500)
        return next(appError);
    return res.status(appError.statusCode).json({ success: false, message: appError.message, code: appError.code });
}
exports.curriculumsRouter.get("/", async (req, res, next) => {
    try {
        const where = {};
        if (req.query.categoryIds) {
            where.categories = {
                some: { categoryId: { in: req.query.categoryIds.split(",") } },
            };
        }
        const data = await prisma_1.prisma.curriculum.findMany({ where, include: commonInclude });
        return res.json({ success: true, data });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.curriculumsRouter.get("/:id", async (req, res, next) => {
    try {
        const item = await prisma_1.prisma.curriculum.findUnique({ where: { id: req.params.id }, include: commonInclude });
        if (!item)
            throw new app_error_1.AppError("Record not found", 404);
        return res.json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.curriculumsRouter.post("/", async (req, res, next) => {
    try {
        const payload = curriculums_schema_1.curriculumCreateSchema.parse(req.body);
        const { categoryIds, ...rest } = payload;
        const item = await prisma_1.prisma.curriculum.create({
            data: {
                ...rest,
                categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
            },
            include: commonInclude,
        });
        return res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.curriculumsRouter.patch("/:id", async (req, res, next) => {
    try {
        const payload = curriculums_schema_1.curriculumUpdateSchema.parse(req.body);
        const { categoryIds, ...rest } = payload;
        const updateData = { ...rest };
        if (categoryIds) {
            updateData.categories = {
                deleteMany: {},
                create: categoryIds.map((categoryId) => ({ categoryId })),
            };
        }
        const item = await prisma_1.prisma.curriculum.update({
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
exports.curriculumsRouter.delete("/:id", async (req, res, next) => {
    try {
        await prisma_1.prisma.curriculum.delete({ where: { id: req.params.id } });
        return res.json({ success: true, data: null });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
