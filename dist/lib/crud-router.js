"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrudRouter = createCrudRouter;
const express_1 = require("express");
const prisma_error_1 = require("./prisma-error");
const app_error_1 = require("../utils/app-error");
function parsePagination(req) {
    const take = req.query.take ? Number(req.query.take) : undefined;
    const skip = req.query.skip ? Number(req.query.skip) : undefined;
    return {
        take: Number.isFinite(take) ? Math.min(Math.max(take ?? 20, 1), 100) : 20,
        skip: Number.isFinite(skip) && skip ? Math.max(skip, 0) : 0,
    };
}
function handleError(error, _req, res, next) {
    const appError = (0, prisma_error_1.mapPrismaError)(error);
    if (appError.statusCode >= 500) {
        return next(appError);
    }
    return res.status(appError.statusCode).json({
        success: false,
        message: appError.message,
        code: appError.code,
    });
}
function createCrudRouter({ delegate, createSchema, updateSchema, include, listWhere, orderBy, afterCreate, }) {
    const router = (0, express_1.Router)();
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
        }
        catch (error) {
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
                throw new app_error_1.AppError("Record not found", 404);
            }
            return res.json({
                success: true,
                data: item,
            });
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            return handleError(error, req, res, next);
        }
    });
    return router;
}
