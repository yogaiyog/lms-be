"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
exports.quizRouter = (0, express_1.Router)();
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
