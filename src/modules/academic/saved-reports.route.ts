import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../auth/auth.middleware";

export const savedReportsRouter = Router();

async function getTutorId(userId: string): Promise<string | null> {
  const tutor = await prisma.tutorProfile.findUnique({ where: { userId } });
  return tutor?.id ?? null;
}

savedReportsRouter.get("/", authenticate, async (req, res, next) => {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
    const tutorId = await getTutorId(req.auth.userId);
    if (!tutorId) return res.status(403).json({ message: "Tutor only" });

    const reports = await prisma.savedReport.findMany({
      where: { tutorId },
      orderBy: { createdAt: "desc" },
    });

    const parsed = reports.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      title: r.title,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      data: JSON.parse(r.data),
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
});

savedReportsRouter.post("/", authenticate, async (req, res, next) => {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
    const tutorId = await getTutorId(req.auth.userId);
    if (!tutorId) return res.status(403).json({ message: "Tutor only" });

    const { studentId, title, data } = req.body;
    if (!studentId || !title || !data) {
      return res.status(400).json({ message: "studentId, title, and data are required" });
    }

    const report = await prisma.savedReport.create({
      data: {
        tutorId,
        studentId,
        title,
        data: JSON.stringify(data),
      },
    });

    res.status(201).json({
      success: true,
      data: { id: report.id, createdAt: report.createdAt },
    });
  } catch (error) {
    next(error);
  }
});

savedReportsRouter.delete("/:id", authenticate, async (req, res, next) => {
  try {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
    const tutorId = await getTutorId(req.auth.userId);
    if (!tutorId) return res.status(403).json({ message: "Tutor only" });

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const report = await prisma.savedReport.findUnique({ where: { id } });

    if (!report) return res.status(404).json({ message: "Report not found" });
    if (report.tutorId !== tutorId) return res.status(403).json({ message: "Not your report" });

    await prisma.savedReport.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
