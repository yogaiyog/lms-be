"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roadmapRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
exports.roadmapRouter = (0, express_1.Router)();
// GET /scratch-fundamental — returns curriculum + topics + tasks (for roadmap-client)
// Query params: ?curriculumId=... | ?name=... (default: "Scratch-Explorer"), ?studentId=...
exports.roadmapRouter.get("/scratch-fundamental", async (req, res, next) => {
    try {
        const curriculumId = req.query.curriculumId;
        const curriculumName = req.query.name;
        const where = curriculumId
            ? { id: curriculumId }
            : { name: curriculumName ?? "Scratch-Explorer" };
        const curriculum = await prisma_1.prisma.curriculum.findFirst({
            where,
            include: {
                topics: {
                    orderBy: { order: "asc" },
                    include: {
                        tasks: {
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
        });
        if (!curriculum) {
            const label = curriculumId ? `id "${curriculumId}"` : `name "${curriculumName ?? "Scratch-Explorer"}"`;
            throw new app_error_1.AppError(`Curriculum ${label} not found`, 404, "CURRICULUM_NOT_FOUND");
        }
        // Optionally include student progress
        let progress = [];
        const studentId = req.query.studentId;
        if (studentId) {
            progress = await prisma_1.prisma.studentTopicProgress.findMany({
                where: { studentId },
                include: { topicTask: { select: { code: true } } },
            });
        }
        return res.json({
            success: true,
            data: {
                curriculum,
                progress,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
