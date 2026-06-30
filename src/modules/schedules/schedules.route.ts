import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { scheduleCreateSchema, scheduleUpdateSchema } from "./schedules.schema";

export const schedulesRouter = createCrudRouter({
  delegate: prisma.schedule,
  createSchema: scheduleCreateSchema,
  updateSchema: scheduleUpdateSchema,
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.classId) where.classId = req.query.classId;
    return where;
  },
  include: {
    class: true,
    attendances: true,
    topicRef: true,
  },
});
