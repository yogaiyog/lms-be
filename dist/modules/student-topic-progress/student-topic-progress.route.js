"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentTopicProgressRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
const student_topic_progress_schema_1 = require("./student-topic-progress.schema");
exports.studentTopicProgressRouter = (0, express_1.Router)();
const include = {
    student: { select: { id: true, fullName: true, nickname: true } },
    topicTask: { include: { topic: { select: { id: true, title: true } } } },
};
// GET /?studentId=X — list progress for a student, optionally filtered by topicId
exports.studentTopicProgressRouter.get("/", async (req, res, next) => {
    try {
        const studentId = req.query.studentId;
        const topicId = req.query.topicId;
        if (!studentId) {
            throw new app_error_1.AppError("studentId query param is required", 400, "BAD_REQUEST");
        }
        const items = await prisma_1.prisma.studentTopicProgress.findMany({
            where: {
                studentId,
                ...(topicId ? { topicTask: { topicId } } : {}),
            },
            include,
            orderBy: { updatedAt: "desc" },
        });
        return res.json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
});
// GET /:id
exports.studentTopicProgressRouter.get("/:id", async (req, res, next) => {
    try {
        const item = await prisma_1.prisma.studentTopicProgress.findUnique({
            where: { id: req.params.id },
            include,
        });
        if (!item)
            throw new app_error_1.AppError("Record not found", 404);
        return res.json({ success: true, data: item });
    }
    catch (error) {
        next(error);
    }
});
// POST / — upsert progress by (studentId, topicTaskId|topicTaskCode)
exports.studentTopicProgressRouter.post("/", async (req, res, next) => {
    try {
        const payload = student_topic_progress_schema_1.studentTopicProgressUpsertSchema.parse(req.body);
        let topicTaskId = payload.topicTaskId;
        if (!topicTaskId && payload.topicTaskCode) {
            const task = await prisma_1.prisma.topicTask.findFirst({
                where: { code: payload.topicTaskCode },
                select: { id: true },
            });
            if (!task) {
                throw new app_error_1.AppError(`TopicTask with code "${payload.topicTaskCode}" not found`, 404, "TOPIC_TASK_NOT_FOUND");
            }
            topicTaskId = task.id;
        }
        if (!topicTaskId) {
            throw new app_error_1.AppError("topicTaskId or topicTaskCode is required", 400, "BAD_REQUEST");
        }
        const now = new Date();
        // Normalize metadata: object → JSON string, string → as-is
        const metadata = payload.metadata === undefined || payload.metadata === null
            ? undefined
            : typeof payload.metadata === "string"
                ? payload.metadata
                : JSON.stringify(payload.metadata);
        const data = {
            studentId: payload.studentId,
            topicTaskId,
            status: payload.status,
            metadata,
            startedAt: payload.status === "in_progress"
                ? now
                : payload.status === "completed"
                    ? now
                    : undefined,
            completedAt: payload.status === "completed" ? now : undefined,
        };
        const item = await prisma_1.prisma.studentTopicProgress.upsert({
            where: {
                studentId_topicTaskId: {
                    studentId: payload.studentId,
                    topicTaskId,
                },
            },
            create: data,
            update: {
                status: data.status,
                metadata: data.metadata,
                ...(data.startedAt ? { startedAt: data.startedAt } : {}),
                ...(data.completedAt ? { completedAt: data.completedAt } : {}),
            },
            include,
        });
        return res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        next(error);
    }
});
// PATCH /:id — update status/metadata only
exports.studentTopicProgressRouter.patch("/:id", async (req, res, next) => {
    try {
        const payload = student_topic_progress_schema_1.studentTopicProgressUpdateSchema.parse(req.body);
        const metadata = payload.metadata === undefined || payload.metadata === null
            ? undefined
            : typeof payload.metadata === "string"
                ? payload.metadata
                : JSON.stringify(payload.metadata);
        const item = await prisma_1.prisma.studentTopicProgress.update({
            where: { id: req.params.id },
            data: {
                ...(payload.status ? { status: payload.status } : {}),
                ...(metadata !== undefined ? { metadata } : {}),
                ...(payload.status === "completed" ? { completedAt: new Date() } : {}),
            },
            include,
        });
        return res.json({ success: true, data: item });
    }
    catch (error) {
        next(error);
    }
});
// DELETE /:id
exports.studentTopicProgressRouter.delete("/:id", async (req, res, next) => {
    try {
        const item = await prisma_1.prisma.studentTopicProgress.delete({
            where: { id: req.params.id },
        });
        return res.json({ success: true, data: item });
    }
    catch (error) {
        next(error);
    }
});
