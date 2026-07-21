import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { mapPrismaError } from "../lib/prisma-error";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; "),
      code: "VALIDATION_ERROR",
    });
  }

  if (err && typeof err === "object" && "code" in err) {
    const mapped = mapPrismaError(err);
    if (mapped.statusCode !== 500 || mapped.code) {
      return res.status(mapped.statusCode).json({
        success: false,
        message: mapped.message,
        code: mapped.code,
      });
    }
  }

  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
