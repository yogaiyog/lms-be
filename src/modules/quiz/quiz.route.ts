import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export const quizRouter = Router();

quizRouter.get("/:taskCode", async (req, res, next) => {
  try {
    const { taskCode } = req.params;

    const topicTask = await prisma.topicTask.findFirst({
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
      throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
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
  } catch (error) {
    next(error);
  }
});
