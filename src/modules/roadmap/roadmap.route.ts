import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export const roadmapRouter = Router();

// GET /scratch-fundamental — returns curriculum + topics + tasks (for roadmap-client)
// Query params: ?curriculumId=... | ?name=... (default: "Scratch-Explorer"), ?studentId=...
roadmapRouter.get("/scratch-fundamental", async (req, res, next) => {
  try {
    const curriculumId = req.query.curriculumId as string | undefined;
    const curriculumName = req.query.name as string | undefined;
    const where = curriculumId
      ? { id: curriculumId }
      : { name: curriculumName ?? "Scratch-Explorer" };
    const curriculum = await prisma.curriculum.findFirst({
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
      throw new AppError(`Curriculum ${label} not found`, 404, "CURRICULUM_NOT_FOUND");
    }

    // Optionally include student progress
    let progress: any[] = [];
    const studentId = req.query.studentId as string | undefined;
    if (studentId) {
      progress = await prisma.studentTopicProgress.findMany({
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
  } catch (error) {
    next(error);
  }
});