import { Router, type Request, type Response, type NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { mapPrismaError } from "../../lib/prisma-error";
import { AppError } from "../../utils/app-error";
import {
  curriculumCreateSchema,
  curriculumUpdateSchema,
} from "./curriculums.schema";

export const curriculumsRouter = Router();

const commonInclude = {
  topics: {
    orderBy: { order: "asc" as const },
    include: { tasks: { orderBy: { order: "asc" as const } } },
  },
  assessmentSet: {
    include: { aspects: { orderBy: { order: "asc" as const } } },
  },
  categories: {
    include: { category: true },
  },
};

function handleError(error: unknown, _req: Request, res: Response, next: NextFunction) {
  const appError = mapPrismaError(error);
  if (appError.statusCode >= 500) return next(appError);
  return res.status(appError.statusCode).json({ success: false, message: appError.message, code: appError.code });
}

curriculumsRouter.get("/", async (req, res, next) => {
  try {
    const where: Record<string, unknown> = {};
    if (req.query.categoryIds) {
      where.categories = {
        some: { categoryId: { in: (req.query.categoryIds as string).split(",") } },
      };
    }
    const data = await prisma.curriculum.findMany({ where, include: commonInclude });
    return res.json({ success: true, data });
  } catch (error) { return handleError(error, req, res, next); }
});

curriculumsRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.curriculum.findUnique({ where: { id: req.params.id }, include: commonInclude });
    if (!item) throw new AppError("Record not found", 404);
    return res.json({ success: true, data: item });
  } catch (error) { return handleError(error, req, res, next); }
});

curriculumsRouter.post("/", async (req, res, next) => {
  try {
    const payload = curriculumCreateSchema.parse(req.body);
    const { categoryIds, ...rest } = payload;
    const item = await prisma.curriculum.create({
      data: {
        ...rest,
        categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      },
      include: commonInclude,
    });
    return res.status(201).json({ success: true, data: item });
  } catch (error) { return handleError(error, req, res, next); }
});

curriculumsRouter.patch("/:id", async (req, res, next) => {
  try {
    const payload = curriculumUpdateSchema.parse(req.body);
    const { categoryIds, ...rest } = payload;
    const updateData: Record<string, unknown> = { ...rest };
    if (categoryIds) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map((categoryId) => ({ categoryId })),
      };
    }
    const item = await prisma.curriculum.update({
      where: { id: req.params.id },
      data: updateData,
      include: commonInclude,
    });
    return res.json({ success: true, data: item });
  } catch (error) { return handleError(error, req, res, next); }
});

curriculumsRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.curriculum.delete({ where: { id: req.params.id } });
    return res.json({ success: true, data: null });
  } catch (error) { return handleError(error, req, res, next); }
});
