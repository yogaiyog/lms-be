import { Router, type Request } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { requireRole } from "../auth/auth.middleware";
import { Role } from "../../types/enums";
import { quizQuestionCreateSchema, quizQuestionUpdateSchema } from "./quiz.schema";

export const quizRouter = Router();

const adminOnly = requireRole(Role.ADMIN);

type StoredChoice = {
  content: string;
  isCorrect: boolean;
  feedback?: string;
  imageUrl?: string;
};

function readChoices(raw: unknown): StoredChoice[] {
  return Array.isArray(raw) ? (raw as StoredChoice[]) : [];
}

/** ADMIN & TUTOR melihat kunci jawaban; role lain (siswa/parent) tidak. */
function canSeeAnswers(req: Request) {
  return req.auth?.role === Role.ADMIN || req.auth?.role === Role.TUTOR;
}

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

async function findStudentIdForUser(userId: string) {
  const student = await prisma.studentProfile.findUnique({ where: { userId }, select: { id: true } });
  return student?.id ?? null;
}

// GET /:taskCode — soal quiz. Untuk siswa: tanpa isCorrect & feedback (dinilai lewat /answer).
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

    const showAnswers = canSeeAnswers(req);
    const questions = topicTask.quiz.questions.map((q) =>
      showAnswers
        ? q
        : {
            ...q,
            choices: readChoices(q.choices).map(({ content, imageUrl }) => ({
              content,
              ...(imageUrl ? { imageUrl } : {}),
            })),
          },
    );

    return res.json({
      success: true,
      data: {
        id: topicTask.quiz.id,
        taskId: topicTask.id,
        taskCode: topicTask.code,
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
});

const answerSchema = z.object({
  questionId: z.string().min(1),
  choiceIndex: z.number().int().min(0),
});

// POST /:taskCode/answer — cek satu jawaban, kembalikan benar/salah + feedback.
quizRouter.post("/:taskCode/answer", async (req, res, next) => {
  try {
    const { taskCode } = req.params;
    const { quizId } = await findQuizByTaskCode(taskCode);
    const { questionId, choiceIndex } = answerSchema.parse(req.body);

    const question = await prisma.quizQuestion.findFirst({ where: { id: questionId, quizId } });
    if (!question) throw new AppError("Question not found", 404, "QUESTION_NOT_FOUND");

    const choices = readChoices(question.choices);
    const chosen = choices[choiceIndex];
    if (!chosen) throw new AppError("Pilihan jawaban tidak valid", 400, "BAD_REQUEST");

    return res.json({
      success: true,
      data: {
        isCorrect: chosen.isCorrect === true,
        feedback: chosen.feedback ?? "",
        correctIndexes: choices.flatMap((c, i) => (c.isCorrect ? [i] : [])),
      },
    });
  } catch (error) {
    next(error);
  }
});

const submitSchema = z.object({
  answers: z.array(answerSchema).min(1),
});

// POST /:taskCode/submit — nilai seluruh jawaban di server, simpan QuizAttempt,
// dan tandai task selesai untuk siswa yang login.
quizRouter.post("/:taskCode/submit", async (req, res, next) => {
  try {
    const { taskCode } = req.params;
    const { quizId, taskId } = await findQuizByTaskCode(taskCode);
    const { answers } = submitSchema.parse(req.body);

    const questions = await prisma.quizQuestion.findMany({ where: { quizId }, select: { id: true, choices: true } });
    const byId = new Map(questions.map((q) => [q.id, readChoices(q.choices)]));

    // Satu jawaban per soal (jawaban terakhir yang dikirim dipakai).
    const answerByQuestion = new Map(answers.map((a) => [a.questionId, a.choiceIndex]));
    let correct = 0;
    for (const [questionId, choiceIndex] of answerByQuestion) {
      if (byId.get(questionId)?.[choiceIndex]?.isCorrect === true) correct += 1;
    }
    const total = questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Hanya akun STUDENT yang tercatat (admin/tutor yang mencoba quiz tidak disimpan).
    let saved = false;
    if (req.auth?.role === Role.STUDENT) {
      const studentId = await findStudentIdForUser(req.auth.userId);
      if (studentId) {
        const now = new Date();
        const metadata = JSON.stringify({ source: "quiz", score, correct, total });
        await prisma.$transaction([
          prisma.quizAttempt.create({ data: { studentId, quizId, score } }),
          prisma.studentTopicProgress.upsert({
            where: { studentId_topicTaskId: { studentId, topicTaskId: taskId } },
            create: { studentId, topicTaskId: taskId, status: "completed", metadata, startedAt: now, completedAt: now },
            update: { status: "completed", metadata, completedAt: now },
          }),
        ]);
        saved = true;
      }
    }

    return res.json({ success: true, data: { score, correct, total, saved } });
  } catch (error) {
    next(error);
  }
});

quizRouter.post("/:taskCode/questions", adminOnly, async (req, res, next) => {
  try {
    const taskCode = String(req.params.taskCode);
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

quizRouter.patch("/:taskCode/questions/:questionId", adminOnly, async (req, res, next) => {
  try {
    const taskCode = String(req.params.taskCode);
    const questionId = String(req.params.questionId);
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

quizRouter.delete("/:taskCode/questions/:questionId", adminOnly, async (req, res, next) => {
  try {
    const taskCode = String(req.params.taskCode);
    const questionId = String(req.params.questionId);
    await findQuizByTaskCode(taskCode);

    await prisma.quizQuestion.delete({ where: { id: questionId } });
    return res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});
