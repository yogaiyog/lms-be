import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { mapPrismaError } from "../../lib/prisma-error";

export const expensesRouter = Router();

const DEFAULT_TUTOR_COST: Record<string, number> = {
  TRIAL: 12000,
  BATCH810: 20000,
  BATCH35: 20000,
  PRIVATE: 30000,
  MAKEUP: 20000,
};

const include = {
  schedule: { include: { class: true } },
  student: true,
  tutor: true,
};

// GET / — tutor cost (expenses) from attendance records, per class type
// Query: take, skip, from, to (filter attendance.date), status (default excludes RESCHEDULE)
expensesRouter.get("/", async (req, res, next) => {
  try {
    const takeRaw = Number(req.query.take);
    const skipRaw = Number(req.query.skip);
    const take = Number.isFinite(takeRaw) ? Math.min(Math.max(Math.trunc(takeRaw), 1), 100) : 20;
    const skip = Number.isFinite(skipRaw) ? Math.max(Math.trunc(skipRaw), 0) : 0;

    const fromRaw = typeof req.query.from === "string" ? req.query.from : "";
    const toRaw = typeof req.query.to === "string" ? req.query.to : "";
    const tutorId = typeof req.query.tutorId === "string" ? req.query.tutorId.trim() : "";

    const where: Prisma.AttendanceWhereInput = { status: { not: "RESCHEDULE" } };
    if (tutorId) where.teachedBy = tutorId;
    if (fromRaw || toRaw) {
      const date: Prisma.DateTimeFilter = {};
      if (fromRaw) {
        const from = new Date(fromRaw);
        if (!Number.isNaN(from.getTime())) date.gte = from;
      }
      if (toRaw) {
        const to = new Date(toRaw);
        if (!Number.isNaN(to.getTime())) date.lte = to;
      }
      where.date = date;
    }

    // Fetch tutor costs from database
    const tutorCosts = await prisma.tutorCost.findMany();
    const tutorCostMap: Record<string, number> = { ...DEFAULT_TUTOR_COST };
    for (const tc of tutorCosts) {
      tutorCostMap[tc.classType] = Number(tc.cost);
    }

    // Aggregation over all matching rows (id + class type + class tutorCost) → accurate total/sum/byType
    const all = await prisma.attendance.findMany({
      where,
      select: { schedule: { select: { class: { select: { type: true, tutorCost: true } } } } },
    });

    const byType: Record<string, { count: number; sum: number }> = {};
    let sum = 0;
    for (const row of all) {
      const cls = row.schedule.class;
      const type = cls.type;
      const cost = cls.tutorCost != null ? Number(cls.tutorCost) : (tutorCostMap[type] ?? 0);
      sum += cost;
      if (!byType[type]) byType[type] = { count: 0, sum: 0 };
      byType[type].count += 1;
      byType[type].sum += cost;
    }
    const total = all.length;

    const data = await prisma.attendance.findMany({
      where,
      include,
      orderBy: { date: "desc" },
      take,
      skip,
    });

    const rows = data.map((att) => {
      const cls = att.schedule.class;
      const cost = cls.tutorCost != null ? Number(cls.tutorCost) : (tutorCostMap[cls.type] ?? 0);
      return {
        ...att,
        cost,
      };
    });

    return res.json({
      success: true,
      data: rows,
      meta: { take, skip, count: rows.length, total, sum, byType },
    });
  } catch (error) {
    const appError = mapPrismaError(error);
    return res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      code: appError.code,
    });
  }
});
