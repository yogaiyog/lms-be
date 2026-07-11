"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPrismaError = mapPrismaError;
const client_1 = require("@prisma/client");
const app_error_1 = require("../utils/app-error");
function mapPrismaError(error) {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            const target = Array.isArray(error.meta?.target)
                ? error.meta?.target.join(", ")
                : "field";
            return new app_error_1.AppError(`Duplicate value for ${target}`, 409, error.code);
        }
        if (error.code === "P2003") {
            const field = typeof error.meta?.field_name === "string" ? error.meta.field_name : "";
            if (field.includes("parentId")) {
                return new app_error_1.AppError("Parent profile not found for the provided parentId", 404, error.code);
            }
            return new app_error_1.AppError("Foreign key constraint violated", 400, error.code);
        }
        if (error.code === "P2025") {
            return new app_error_1.AppError("Record not found", 404, error.code);
        }
    }
    if (error instanceof app_error_1.AppError) {
        return error;
    }
    if (error instanceof Error) {
        return new app_error_1.AppError(error.message, 400);
    }
    return new app_error_1.AppError("Unknown database error", 500);
}
