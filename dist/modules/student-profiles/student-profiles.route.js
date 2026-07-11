"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentProfilesRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const app_error_1 = require("../../utils/app-error");
const student_profiles_schema_1 = require("./student-profiles.schema");
const crudRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.studentProfile,
    createSchema: student_profiles_schema_1.studentProfileCreateSchema,
    updateSchema: student_profiles_schema_1.studentProfileUpdateSchema,
    listWhere: (req) => {
        const parentId = req.query.parentId;
        const showArchived = req.query.showArchived === "true";
        return {
            isActive: showArchived ? undefined : true,
            ...(parentId ? { parentId } : {}),
        };
    },
    include: {
        user: true,
        parent: true,
        category: true,
        enrollments: true,
        attendances: true,
        badgeLogs: true,
    },
});
exports.studentProfilesRouter = (0, express_1.Router)();
// Custom DELETE — hapus User → cascade ke profile & semua relasi
exports.studentProfilesRouter.delete("/:id", async (req, res, next) => {
    try {
        const profile = await prisma_1.prisma.studentProfile.findUnique({
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
exports.studentProfilesRouter.use(crudRouter);
