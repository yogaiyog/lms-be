import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { quizQuestionCreateSchema, quizQuestionUpdateSchema } from "./quiz.schema";

export const quizRouter = Router();

async function findQuizByTaskCode(taskCode: string) {
  const topicTask = await prisma.topicTask.findFirst({
    where: { code: taskCode, type: "QUIZ" },
    include: { quiz: true },
  });
  if (!topicTask || !topicTask.quiz) {
    throw new AppError("Quiz not found", 404, "QUIZ_NOT_FOUND");
  }
  return { quizId: topicTask.quiz.id, taskId: topicTask.id };
}

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

quizRouter.post("/:taskCode/questions", async (req, res, next) => {
  try {
    const { taskCode } = req.params;
    const { quizId } = await findQuizByTaskCode(taskCode);
    const payload = quizQuestionCreateSchema.parse(req.body);

    const question = await prisma.quizQuestion.create({
      data: {
        quizId,
        question: payload.question,
        imageUrl: payload.imageUrl ?? null,
        choices: payload.choices,
      },
    });

    return res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
});

quizRouter.patch("/:taskCode/questions/:questionId", async (req, res, next) => {
  try {
    const { taskCode, questionId } = req.params;
    await findQuizByTaskCode(taskCode);
    const payload = quizQuestionUpdateSchema.parse(req.body);

    const question = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        ...(payload.question !== undefined ? { question: payload.question } : {}),
        ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
        ...(payload.choices !== undefined ? { choices: payload.choices } : {}),
      },
    });

    return res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
});

quizRouter.delete("/:taskCode/questions/:questionId", async (req, res, next) => {
  try {
    const { taskCode, questionId } = req.params;
    await findQuizByTaskCode(taskCode);

    await prisma.quizQuestion.delete({ where: { id: questionId } });
    return res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});
