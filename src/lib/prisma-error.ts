import { Prisma } from "@prisma/client";
import { AppError } from "../utils/app-error";

export function mapPrismaError(error: unknown): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta?.target.join(", ")
        : "field";

      return new AppError(`Duplicate value for ${target}`, 409, error.code);
    }

    if (error.code === "P2003") {
      const field = typeof error.meta?.field_name === "string" ? error.meta.field_name : "";
      if (field.includes("parentId")) {
        return new AppError("Parent profile not found for the provided parentId", 404, error.code);
      }

      return new AppError("Foreign key constraint violated", 400, error.code);
    }

    if (error.code === "P2025") {
      return new AppError("Record not found", 404, error.code);
    }
  }

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 400);
  }

  return new AppError("Unknown database error", 500);
}
