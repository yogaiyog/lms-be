import { Router, type Request, type Response, type NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { classCreateSchema, classUpdateSchema } from "./classes.schema";
import { mapPrismaError } from "../../lib/prisma-error";
import { AppError } from "../../utils/app-error";

export const classesRouter = Router();

const commonInclude = {
  tutors: true,
  category: true,
  enrollments: {
    include: {
      meetUsages: true,
    },
  },
  schedules: true,
  announcements: true,
  curriculum: {
    include: {
      topics: true,
      assessmentSet: {
        include: {
          aspects: { orderBy: { order: "asc" as const } },
        },
      },
    },
  },
};

classesRouter.get("/", async (req, res, next) => {
  try {
    const where: Record<string, unknown> = {};
    if (req.query.tutorId) {
      where.tutors = { some: { id: req.query.tutorId as string } };
    }

    const data = await prisma.class.findMany({
      where,
      include: commonInclude,
    });

    return res.json({ success: true, data });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

classesRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: commonInclude,
    });

    if (!item) throw new AppError("Record not found", 404);

    return res.json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

classesRouter.post("/", async (req, res, next) => {
  try {
    const payload = classCreateSchema.parse(req.body);

    const lastClass = await prisma.class.findFirst({
      orderBy: { batch: "desc" },
      select: { batch: true },
    });

    const batch = (lastClass?.batch ?? 0) + 1;

    const { tutorIds, category, ...rest } = payload;
    const item = await prisma.class.create({
      data: {
        ...rest,
        batch,
        tutors: { connect: tutorIds.map((id) => ({ id })) },
      },
      include: commonInclude,
    });

    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

classesRouter.patch("/:id", async (req, res, next) => {
  try {
    const payload = classUpdateSchema.parse(req.body);
    const { tutorIds, category, ...rest } = payload;

    const updateData: Record<string, unknown> = { ...rest };
    if (tutorIds) {
      updateData.tutors = { set: tutorIds.map((id) => ({ id })) };
    }

    const item = await prisma.class.update({
      where: { id: req.params.id },
      data: updateData,
      include: commonInclude,
    });

    return res.json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

classesRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.enrollment.updateMany({ where: { classId: id }, data: { classId: null } });
    await prisma.requestClass.updateMany({ where: { prevClassId: id }, data: { prevClassId: null } });
    await prisma.requestClass.updateMany({ where: { approvedClassId: id }, data: { approvedClassId: null } });

    const item = await prisma.class.delete({
      where: { id },
    });

    return res.json({ success: true, data: item });
  } catch (error) {
    return handleError(error, req, res, next);
  }
});

function handleError(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const appError = mapPrismaError(error);
  if (appError.statusCode >= 500) return next(appError);
  return res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    code: appError.code,
  });
}
