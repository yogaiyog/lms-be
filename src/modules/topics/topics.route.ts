import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { topicCreateSchema, topicUpdateSchema } from "./topics.schema";

export const topicsRouter = createCrudRouter({
  delegate: prisma.topic,
  createSchema: topicCreateSchema,
  updateSchema: topicUpdateSchema,
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.curriculumId) where.curriculumId = req.query.curriculumId;
    return where;
  },
});
