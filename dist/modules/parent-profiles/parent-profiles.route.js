"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentProfilesRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const app_error_1 = require("../../utils/app-error");
const parent_profiles_schema_1 = require("./parent-profiles.schema");
const crudRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.parentProfile,
    createSchema: parent_profiles_schema_1.parentProfileCreateSchema,
    updateSchema: parent_profiles_schema_1.parentProfileUpdateSchema,
    listWhere: (req) => ({
        isActive: req.query.showArchived === "true" ? undefined : true,
    }),
    include: {
        user: true,
        students: true,
    },
});
exports.parentProfilesRouter = (0, express_1.Router)();
// Custom DELETE — hapus User → cascade ke profile, students, & semua relasi
exports.parentProfilesRouter.delete("/:id", async (req, res, next) => {
    try {
        const profile = await prisma_1.prisma.parentProfile.findUnique({
            where: { id: req.params.id },
            select: { userId: true },
        });
        if (!profile)
            throw new app_error_1.AppError("Not found", 404);
        await prisma_1.prisma.user.delete({ where: { id: profile.userId } });
        return res.json({ success: true, data: { id: req.params.id } });
    }
    catch (error) {
        next(error);
    }
});
exports.parentProfilesRouter.use(crudRouter);
