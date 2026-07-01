import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { mapPrismaError } from "./prisma-error";
import { AppError } from "../utils/app-error";

type PrismaDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any | null>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
};

type CreateCrudRouterOptions = {
  delegate: PrismaDelegate;
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
  include?: Record<string, unknown>;
  listWhere?: (req: Request) => Record<string, unknown>;
  orderBy?: Record<string, "asc" | "desc">;
  afterCreate?: (payload: any, item: any, req: Request) => Promise<void>;
};

function parsePagination(req: Request) {
  const take = req.query.take ? Number(req.query.take) : undefined;
  const skip = req.query.skip ? Number(req.query.skip) : undefined;

  return {
    take: Number.isFinite(take) ? Math.min(Math.max(take ?? 20, 1), 100) : 20,
    skip: Number.isFinite(skip) && skip ? Math.max(skip, 0) : 0,
  };
}

function handleError(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const appError = mapPrismaError(error);

  if (appError.statusCode >= 500) {
    return next(appError);
  }

  return res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    code: appError.code,
  });
}

export function createCrudRouter({
  delegate,
  createSchema,
  updateSchema,
  include,
  listWhere,
  orderBy,
  afterCreate,
}: CreateCrudRouterOptions) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const { take, skip } = parsePagination(req);

      const data = await delegate.findMany({
        where: listWhere?.(req),
        include,
        take,
        skip,
        ...(orderBy ? { orderBy } : {}),
      });

      return res.json({
        success: true,
        data,
        meta: { take, skip, count: data.length },
      });
    } catch (error) {
      return handleError(error, req, res, next);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const item = await delegate.findUnique({
        where: { id: req.params.id },
        include,
      });

      if (!item) {
        throw new AppError("Record not found", 404);
      }

      return res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      return handleError(error, req, res, next);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = createSchema.parse(req.body);
      const item = await delegate.create({
        data: payload,
        include,
      });

      if (afterCreate) {
        await afterCreate(payload, item, req);
      }

      return res.status(201).json({
        success: true,
        data: item,
      });
    } catch (error) {
      return handleError(error, req, res, next);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    try {
      const payload = updateSchema.parse(req.body);
      const item = await delegate.update({
        where: { id: req.params.id },
        data: payload,
        include,
      });

      return res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      return handleError(error, req, res, next);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const item = await delegate.delete({
        where: { id: req.params.id },
      });

      return res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      return handleError(error, req, res, next);
    }
  });

  return router;
}
