import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { mapPrismaError } from "./prisma-error";
import { AppError } from "../utils/app-error";

type PrismaDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  count: (args?: any) => Promise<number>;
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

/**
 * Batas atas saat klien TIDAK mengirim `take`.
 * Dashboard memanggil list() tanpa pagination dan mengharapkan semua data;
 * dulu default-nya 20 sehingga daftar siswa/parent/tutor terpotong diam-diam.
 */
export const UNPAGINATED_MAX = 1000;

function parsePagination(req: Request) {
  const takeRaw = req.query.take !== undefined ? Number(req.query.take) : undefined;
  const skipRaw = req.query.skip !== undefined ? Number(req.query.skip) : undefined;
  const skip = Number.isFinite(skipRaw) && skipRaw ? Math.max(Math.trunc(skipRaw), 0) : 0;

  if (takeRaw === undefined || !Number.isFinite(takeRaw)) {
    return { take: UNPAGINATED_MAX, skip, paginated: false };
  }
  return { take: Math.min(Math.max(Math.trunc(takeRaw), 1), 100), skip, paginated: true };
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
      const { take, skip, paginated } = parsePagination(req);
      const where = listWhere?.(req);

      const [data, total] = await Promise.all([
        delegate.findMany({
          where,
          include,
          take,
          skip,
          ...(orderBy ? { orderBy } : {}),
        }),
        delegate.count({ where }),
      ]);

      if (!paginated && total > data.length + skip) {
        console.warn(
          `[crud] ${req.baseUrl}: ${total} baris, hanya ${data.length} dikirim (batas ${UNPAGINATED_MAX}). ` +
            "Pakai ?take=&skip= di klien.",
        );
      }

      return res.json({
        success: true,
        data,
        meta: { take, skip, count: data.length, total },
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
