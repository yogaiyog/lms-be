"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicTaskRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
const prisma_error_1 = require("../../lib/prisma-error");
const topic_task_schema_1 = require("./topic-task.schema");
exports.topicTaskRouter = (0, express_1.Router)();
const commonInclude = {
    quiz: {
        include: {
            questions: {
                orderBy: { createdAt: "asc" },
            },
        },
    },
    topic: { select: { id: true, title: true } },
};
function handleError(error, _req, res, next) {
    const appError = (0, prisma_error_1.mapPrismaError)(error);
    if (appError.statusCode >= 500)
        return next(appError);
    return res.status(appError.statusCode).json({ success: false, message: appError.message, code: appError.code });
}
exports.topicTaskRouter.get("/", async (req, res, next) => {
    try {
        const where = {};
        if (req.query.topicId)
            where.topicId = req.query.topicId;
        const data = await prisma_1.prisma.topicTask.findMany({
            where,
            include: commonInclude,
            orderBy: { order: "asc" },
        });
        return res.json({ success: true, data });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.topicTaskRouter.get("/:id", async (req, res, next) => {
    try {
        const item = await prisma_1.prisma.topicTask.findUnique({ where: { id: req.params.id }, include: commonInclude });
        if (!item)
            throw new app_error_1.AppError("Record not found", 404);
        return res.json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.topicTaskRouter.post("/", async (req, res, next) => {
    try {
        const payload = topic_task_schema_1.topicTaskCreateSchema.parse(req.body);
        const item = await prisma_1.prisma.topicTask.create({ data: payload, include: commonInclude });
        if (payload.type === "QUIZ") {
            await prisma_1.prisma.quiz.create({
                data: { taskId: item.id },
            });
        }
        return res.status(201).json({ success: true, data: await prisma_1.prisma.topicTask.findUnique({ where: { id: item.id }, include: commonInclude }) });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.topicTaskRouter.patch("/:id", async (req, res, next) => {
    try {
        const payload = topic_task_schema_1.topicTaskUpdateSchema.parse(req.body);
        const item = await prisma_1.prisma.topicTask.update({
            where: { id: req.params.id },
            data: payload,
            include: commonInclude,
        });
        return res.json({ success: true, data: item });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
exports.topicTaskRouter.delete("/:id", async (req, res, next) => {
    try {
        await prisma_1.prisma.topicTask.delete({ where: { id: req.params.id } });
        return res.json({ success: true, data: null });
    }
    catch (error) {
        return handleError(error, req, res, next);
    }
});
