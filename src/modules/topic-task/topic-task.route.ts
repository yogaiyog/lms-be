import { Router, type Request, type Response, type NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { mapPrismaError } from "../../lib/prisma-error";
import { topicTaskCreateSchema, topicTaskUpdateSchema } from "./topic-task.schema";

export const topicTaskRouter = Router();

const commonInclude = {
  quiz: {
    include: {
      questions: {
        orderBy: { createdAt: "asc" as const },
      },
    },
  },
  topic: { select: { id: true, title: true } },
};

function handleError(error: unknown, _req: Request, res: Response, next: NextFunction) {
  const appError = mapPrismaError(error);
  if (appError.statusCode >= 500) return next(appError);
  return res.status(appError.statusCode).json({ success: false, message: appError.message, code: appError.code });
}

topicTaskRouter.get("/", async (req, res, next) => {
  try {
    const where: Record<string, unknown> = {};
    if (req.query.topicId) where.topicId = req.query.topicId as string;
    const data = await prisma.topicTask.findMany({
      where,
      include: commonInclude,
      orderBy: { order: "asc" },
    });
    return res.json({ success: true, data });
  } catch (error) { return handleError(error, req, res, next); }
});

topicTaskRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.topicTask.findUnique({ where: { id: req.params.id }, include: commonInclude });
    if (!item) throw new AppError("Record not found", 404);
    return res.json({ success: true, data: item });
  } catch (error) { return handleError(error, req, res, next); }
});

topicTaskRouter.post("/", async (req, res, next) => {
  try {
    const payload = topicTaskCreateSchema.parse(req.body);
    const item = await prisma.topicTask.create({ data: payload, include: commonInclude });

    if (payload.type === "QUIZ") {
      await prisma.quiz.create({
        data: { taskId: item.id },
      });
    }

    return res.status(201).json({ success: true, data: await prisma.topicTask.findUnique({ where: { id: item.id }, include: commonInclude }) });
  } catch (error) { return handleError(error, req, res, next); }
});

topicTaskRouter.patch("/:id", async (req, res, next) => {
  try {
    const payload = topicTaskUpdateSchema.parse(req.body);
    const item = await prisma.topicTask.update({
      where: { id: req.params.id },
      data: payload,
      include: commonInclude,
    });
    return res.json({ success: true, data: item });
  } catch (error) { return handleError(error, req, res, next); }
});

topicTaskRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.topicTask.delete({ where: { id: req.params.id } });
    return res.json({ success: true, data: null });
  } catch (error) { return handleError(error, req, res, next); }
});
