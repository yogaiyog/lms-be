"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
const quiz_schema_1 = require("./quiz.schema");
exports.quizRouter = (0, express_1.Router)();
async function findQuizByTaskCode(taskCode) {
    const topicTask = await prisma_1.prisma.topicTask.findFirst({
        where: { code: taskCode, type: "QUIZ" },
        include: { quiz: true },
    });
    if (!topicTask || !topicTask.quiz) {
        throw new app_error_1.AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
    }
    return { quizId: topicTask.quiz.id, taskId: topicTask.id };
}
exports.quizRouter.get("/:taskCode", async (req, res, next) => {
    try {
        const { taskCode } = req.params;
        const topicTask = await prisma_1.prisma.topicTask.findFirst({
            where: { code: taskCode, type: "QUIZ" },
            include: {
                quiz: {
                    include: {
                        questions: {
                            orderBy: { createdAt: "asc" },
                        },
                    },
                },
            },
        });
        if (!topicTask || !topicTask.quiz) {
            throw new app_error_1.AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
        }
        return res.json({
            success: true,
            data: {
                id: topicTask.quiz.id,
                taskId: topicTask.id,
                taskCode: topicTask.code,
                questions: topicTask.quiz.questions,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.quizRouter.post("/:taskCode/questions", async (req, res, next) => {
    try {
        const { taskCode } = req.params;
        const { quizId } = await findQuizByTaskCode(taskCode);
        const payload = quiz_schema_1.quizQuestionCreateSchema.parse(req.body);
        const question = await prisma_1.prisma.quizQuestion.create({
            data: {
                quizId,
                question: payload.question,
                imageUrl: payload.imageUrl ?? null,
                choices: payload.choices,
            },
        });
        return res.status(201).json({ success: true, data: question });
    }
    catch (error) {
        next(error);
    }
});
exports.quizRouter.patch("/:taskCode/questions/:questionId", async (req, res, next) => {
    try {
        const { taskCode, questionId } = req.params;
        await findQuizByTaskCode(taskCode);
        const payload = quiz_schema_1.quizQuestionUpdateSchema.parse(req.body);
        const question = await prisma_1.prisma.quizQuestion.update({
            where: { id: questionId },
            data: {
                ...(payload.question !== undefined ? { question: payload.question } : {}),
                ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
                ...(payload.choices !== undefined ? { choices: payload.choices } : {}),
            },
        });
        return res.json({ success: true, data: question });
    }
    catch (error) {
        next(error);
    }
});
exports.quizRouter.delete("/:taskCode/questions/:questionId", async (req, res, next) => {
    try {
        const { taskCode, questionId } = req.params;
        await findQuizByTaskCode(taskCode);
        await prisma_1.prisma.quizQuestion.delete({ where: { id: questionId } });
        return res.json({ success: true, data: null });
    }
    catch (error) {
        next(error);
    }
});
