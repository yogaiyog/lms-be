import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { enrollmentCreateSchema, enrollmentUpdateSchema } from "./enrollments.schema";
import { mapPrismaError } from "../../lib/prisma-error";
import { AppError } from "../../utils/app-error";

const include = { student: true, class: true, curriculum: true };

const baseRouter = createCrudRouter({
  delegate: prisma.enrollment,
  createSchema: enrollmentCreateSchema,
  updateSchema: enrollmentUpdateSchema,
  include,
});

const router = Router();

// GET unassigned enrollments by curriculumId
router.get("/unassigned/:curriculumId", async (req, res, next) => {
  try {
    const { curriculumId } = req.params;
    const enrollments = await prisma.enrollment.findMany({
      where: { curriculumId, classId: null } as any,
      include: { student: { include: { user: { select: { email: true } } } } },
    });
    return res.json({ success: true, data: enrollments });
  } catch (error) {
    const appError = mapPrismaError(error);
    return res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      code: appError.code,
    });
  }
});

// POST — custom with curriculum validation + duplicate check
router.post("/", async (req, res, next) => {
  try {
    const payload = enrollmentCreateSchema.parse(req.body);

    const curriculum = await prisma.curriculum.findUnique({
      where: { id: payload.curriculumId },
      select: { _count: { select: { topics: true } } },
    });
    if (!curriculum) throw new AppError("Curriculum not found", 404);

    const maxTopics = curriculum._count.topics;
    const totalMeetPurchased = payload.totalMeetPurchased ?? 0;
    if (totalMeetPurchased > maxTopics) {
      throw new AppError(
        `totalMeetPurchased (${totalMeetPurchased}) cannot exceed curriculum topics (${maxTopics})`,
        400,
      );
    }

    // Validate PRIVATE class — max 1 enrollment
    if (payload.classId) {
      const cls = await prisma.class.findUnique({
        where: { id: payload.classId },
        select: { type: true, _count: { select: { enrollments: true } } },
      });
      if (cls?.type === "PRIVATE" && cls._count.enrollments >= 1) {
        throw new AppError("Private class can only have 1 student", 400);
      }
    }

    // Prevent duplicate unassigned enrollment for same student+curriculum
    if (!payload.classId) {
      const existing = await prisma.enrollment.findFirst({
        where: { studentId: payload.studentId, curriculumId: payload.curriculumId, classId: null } as any,
      });
      if (existing) {
        throw new AppError("Student already has an unassigned enrollment for this curriculum", 409);
      }
    }

    const item = await prisma.enrollment.create({
      data: {
        studentId: payload.studentId,
        classId: payload.classId ?? undefined,
        curriculumId: payload.curriculumId,
        totalMeetPurchased,
        totalMeetLeft: payload.totalMeetLeft ?? totalMeetPurchased,
        ...(payload.joinedAt ? { joinedAt: payload.joinedAt } : {}),
      },
      include,
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join("; "),
      });
    }
    const appError = mapPrismaError(error);
    return res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      code: appError.code,
    });
  }
});

// GET enrollments by studentId
router.get("/student/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId } as any,
      include: { ...include, curriculum: true },
    });
    return res.json({ success: true, data: enrollments });
  } catch (error) {
    const appError = mapPrismaError(error);
    return res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      code: appError.code,
    });
  }
});

// PATCH — custom with PRIVATE class validation
router.patch("/:id", async (req, res, next) => {
  try {
    const payload = enrollmentUpdateSchema.parse(req.body);

    if (payload.classId) {
      const cls = await prisma.class.findUnique({
        where: { id: payload.classId },
        select: { type: true, _count: { select: { enrollments: true } } },
      });
      if (cls?.type === "PRIVATE") {
        // Count enrollments already assigned to this class (exclude current enrollment)
        const current = await prisma.enrollment.findUnique({ where: { id: req.params.id } });
        if (!current) throw new AppError("Enrollment not found", 404);
        const count = await prisma.enrollment.count({
          where: { classId: payload.classId, id: { not: req.params.id } },
        });
        if (count >= 1) {
          throw new AppError("Private class can only have 1 student", 400);
        }
      }
    }

    const item = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: { ...payload, classId: payload.classId ?? null },
      include,
    });

    return res.json({ success: true, data: item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join("; "),
      });
    }
    const appError = mapPrismaError(error);
    return res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      code: appError.code,
    });
  }
});

// GET enrollment by ID with full includes
router.get("/:id", async (req, res, next) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: req.params.id },
      include: {
        student: true,
        class: { include: { tutors: true } },
        curriculum: true,
      },
    });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    return res.json({ success: true, data: enrollment });
  } catch (error) {
    const appError = mapPrismaError(error);
    return res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      code: appError.code,
    });
  }
});

// Delegate remaining CRUD methods to baseRouter
router.get("/", (req, res, next) => baseRouter(req, res, next));
router.delete("/:id", (req, res, next) => baseRouter(req, res, next));

export { router as enrollmentsRouter };
