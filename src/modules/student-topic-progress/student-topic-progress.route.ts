import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import {
  studentTopicProgressUpsertSchema,
  studentTopicProgressUpdateSchema,
} from "./student-topic-progress.schema";

export const studentTopicProgressRouter = Router();

const include = {
  student: { select: { id: true, fullName: true, nickname: true } },
  topicTask: { include: { topic: { select: { id: true, title: true } } } },
};

// GET /?studentId=X — list progress for a student, optionally filtered by topicId
studentTopicProgressRouter.get("/", async (req, res, next) => {
  try {
    const studentId = req.query.studentId as string | undefined;
    const topicId = req.query.topicId as string | undefined;

    if (!studentId) {
      throw new AppError("studentId query param is required", 400, "BAD_REQUEST");
    }

    const items = await prisma.studentTopicProgress.findMany({
      where: {
        studentId,
        ...(topicId ? { topicTask: { topicId } } : {}),
      },
      include,
      orderBy: { updatedAt: "desc" },
    });

    return res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

// GET /:id
studentTopicProgressRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.studentTopicProgress.findUnique({
      where: { id: req.params.id },
      include,
    });
    if (!item) throw new AppError("Record not found", 404);
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// POST / — upsert progress by (studentId, topicTaskId|topicTaskCode)
studentTopicProgressRouter.post("/", async (req, res, next) => {
  try {
    const payload = studentTopicProgressUpsertSchema.parse(req.body);

    let topicTaskId: string | undefined = payload.topicTaskId;
    if (!topicTaskId && payload.topicTaskCode) {
      const task = await prisma.topicTask.findFirst({
        where: { code: payload.topicTaskCode },
        select: { id: true },
      });
      if (!task) {
        throw new AppError(
          `TopicTask with code "${payload.topicTaskCode}" not found`,
          404,
          "TOPIC_TASK_NOT_FOUND",
        );
      }
      topicTaskId = task.id;
    }
    if (!topicTaskId) {
      throw new AppError("topicTaskId or topicTaskCode is required", 400, "BAD_REQUEST");
    }

    const now = new Date();
    // Normalize metadata: object → JSON string, string → as-is
    const metadata =
      payload.metadata === undefined || payload.metadata === null
        ? undefined
        : typeof payload.metadata === "string"
          ? payload.metadata
          : JSON.stringify(payload.metadata);

    const data = {
      studentId: payload.studentId,
      topicTaskId,
      status: payload.status,
      metadata,
      startedAt:
        payload.status === "in_progress"
          ? now
          : payload.status === "completed"
            ? now
            : undefined,
      completedAt: payload.status === "completed" ? now : undefined,
    };

    const item = await prisma.studentTopicProgress.upsert({
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
  } catch (error) {
    next(error);
  }
});

// PATCH /:id — update status/metadata only
studentTopicProgressRouter.patch("/:id", async (req, res, next) => {
  try {
    const payload = studentTopicProgressUpdateSchema.parse(req.body);
    const metadata =
      payload.metadata === undefined || payload.metadata === null
        ? undefined
        : typeof payload.metadata === "string"
          ? payload.metadata
          : JSON.stringify(payload.metadata);
    const item = await prisma.studentTopicProgress.update({
      where: { id: req.params.id },
      data: {
        ...(payload.status ? { status: payload.status } : {}),
        ...(metadata !== undefined ? { metadata } : {}),
        ...(payload.status === "completed" ? { completedAt: new Date() } : {}),
      },
      include,
    });
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// DELETE /:id
studentTopicProgressRouter.delete("/:id", async (req, res, next) => {
  try {
    const item = await prisma.studentTopicProgress.delete({
      where: { id: req.params.id },
    });
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});