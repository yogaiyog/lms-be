import { Router, type Request } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { canAccessStudent } from "../../lib/student-access";
import { signProgressToken, verifyProgressToken } from "../../lib/progress-token";
import { AppError } from "../../utils/app-error";
import { requireRole } from "../auth/auth.middleware";
import type { JwtAccessPayload } from "../auth/auth.types";
import { Role } from "../../types/enums";
import {
  studentTopicProgressUpsertSchema,
  studentTopicProgressUpdateSchema,
} from "./student-topic-progress.schema";

export const studentTopicProgressRouter = Router();

const include = {
  student: { select: { id: true, fullName: true, nickname: true } },
  topicTask: { include: { topic: { select: { id: true, title: true } } } },
};

/**
 * Siapa yang memanggil POST / ?
 * POST / tidak melewati middleware `authenticate` global (lihat routes/index.ts) karena
 * scratch-gui & editor Python memanggilnya tanpa access token. Maka cek di sini:
 *  1. Bearer access token (dashboard LMS)  → user harus berhak atas studentId.
 *  2. progressToken (body / X-Progress-Token) → studentId & task diambil dari token.
 *  3. Tanpa keduanya → ditolak bila PROGRESS_TOKEN_REQUIRED, selain itu diizinkan (masa transisi).
 */
type ProgressCaller =
  | { kind: "user"; auth: NonNullable<Request["auth"]> }
  | { kind: "progress-token"; studentId: string; taskCode: string }
  | { kind: "anonymous" };

function resolveProgressCaller(req: Request): ProgressCaller {
  const header = req.header("authorization");
  if (header?.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(header.slice(7).trim(), env.JWT_ACCESS_SECRET) as JwtAccessPayload;
      return { kind: "user", auth: { userId: payload.sub, email: payload.email, role: payload.role } };
    } catch {
      throw new AppError("Token akses tidak valid", 401, "UNAUTHORIZED");
    }
  }

  const rawProgressToken =
    req.header("x-progress-token") ??
    (typeof req.body?.progressToken === "string" ? req.body.progressToken : undefined);
  if (rawProgressToken) {
    const decoded = verifyProgressToken(rawProgressToken);
    if (!decoded) {
      throw new AppError("Sesi belajar kedaluwarsa — buka ulang dari dashboard", 401, "PROGRESS_TOKEN_INVALID");
    }
    return { kind: "progress-token", studentId: decoded.sid, taskCode: decoded.task };
  }

  if (env.PROGRESS_TOKEN_REQUIRED) {
    throw new AppError("Progress token tidak ditemukan", 401, "PROGRESS_TOKEN_REQUIRED");
  }
  return { kind: "anonymous" };
}

const launchTokenSchema = z.object({
  studentId: z.string().min(1),
  taskCode: z.string().min(1),
});

// POST /launch-token — dashboard minta token sebelum membuka scratch-gui / editor Python.
studentTopicProgressRouter.post("/launch-token", async (req, res, next) => {
  try {
    const { studentId, taskCode } = launchTokenSchema.parse(req.body);
    if (!(await canAccessStudent(req.auth, studentId))) {
      throw new AppError("Tidak boleh mengakses siswa ini", 403, "FORBIDDEN");
    }
    const task = await prisma.topicTask.findFirst({ where: { code: taskCode }, select: { id: true } });
    if (!task) {
      throw new AppError(`TopicTask with code "${taskCode}" not found`, 404, "TOPIC_TASK_NOT_FOUND");
    }
    return res.json({ success: true, data: signProgressToken({ sid: studentId, task: taskCode }) });
  } catch (error) {
    next(error);
  }
});

// GET /?studentId=X — list progress for a student, optionally filtered by topicId
studentTopicProgressRouter.get("/", async (req, res, next) => {
  try {
    const studentId = req.query.studentId as string | undefined;
    const topicId = req.query.topicId as string | undefined;

    if (!studentId) {
      throw new AppError("studentId query param is required", 400, "BAD_REQUEST");
    }
    if (!(await canAccessStudent(req.auth, studentId))) {
      throw new AppError("Tidak boleh mengakses siswa ini", 403, "FORBIDDEN");
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
    if (!item || !(await canAccessStudent(req.auth, item.studentId))) {
      throw new AppError("Record not found", 404);
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// POST / — upsert progress by (studentId, topicTaskId|topicTaskCode)
studentTopicProgressRouter.post("/", async (req, res, next) => {
  try {
    const caller = resolveProgressCaller(req);
    const payload = studentTopicProgressUpsertSchema.parse(req.body);

    if (caller.kind === "progress-token") {
      // Token hanya berlaku untuk siswa & task yang tertulis di dalamnya.
      if (payload.studentId !== caller.studentId) {
        throw new AppError("Progress token bukan untuk siswa ini", 403, "FORBIDDEN");
      }
      if (payload.topicTaskCode && payload.topicTaskCode !== caller.taskCode) {
        throw new AppError("Progress token bukan untuk task ini", 403, "FORBIDDEN");
      }
      if (!payload.topicTaskCode) payload.topicTaskCode = caller.taskCode;
      if (payload.topicTaskId) {
        const t = await prisma.topicTask.findUnique({ where: { id: payload.topicTaskId }, select: { code: true } });
        if (t?.code !== caller.taskCode) {
          throw new AppError("Progress token bukan untuk task ini", 403, "FORBIDDEN");
        }
      }
    } else if (caller.kind === "user") {
      if (!(await canAccessStudent(caller.auth, payload.studentId))) {
        throw new AppError("Tidak boleh mengakses siswa ini", 403, "FORBIDDEN");
      }
    } else {
      console.warn(
        `[progress] POST tanpa token (studentId=${payload.studentId}, task=${payload.topicTaskCode ?? payload.topicTaskId}). ` +
          "Set PROGRESS_TOKEN_REQUIRED=true setelah scratch-gui & editor Python versi baru ter-deploy.",
      );
    }

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

// PATCH /:id — update status/metadata only (tidak dipakai dashboard; khusus admin/tutor)
studentTopicProgressRouter.patch("/:id", requireRole(Role.ADMIN, Role.TUTOR), async (req, res, next) => {
  try {
    const payload = studentTopicProgressUpdateSchema.parse(req.body);
    const metadata =
      payload.metadata === undefined || payload.metadata === null
        ? undefined
        : typeof payload.metadata === "string"
          ? payload.metadata
          : JSON.stringify(payload.metadata);
    const item = await prisma.studentTopicProgress.update({
      where: { id: String(req.params.id) },
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
studentTopicProgressRouter.delete("/:id", requireRole(Role.ADMIN, Role.TUTOR), async (req, res, next) => {
  try {
    const item = await prisma.studentTopicProgress.delete({
      where: { id: String(req.params.id) },
    });
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});