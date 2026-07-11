"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const app_error_1 = require("../utils/app-error");
const prisma_error_1 = require("../lib/prisma-error");
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof app_error_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
        });
    }
    if (err && typeof err === "object" && "code" in err) {
        const mapped = (0, prisma_error_1.mapPrismaError)(err);
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
