import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  curriculumCreateSchema,
  curriculumUpdateSchema,
} from "./curriculums.schema";

export const curriculumsRouter = createCrudRouter({
  delegate: prisma.curriculum,
  createSchema: curriculumCreateSchema,
  updateSchema: curriculumUpdateSchema,
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.category) where.category = req.query.category;
    return where;
  },
  include: {
    topics: true,
    assessmentSet: {
      include: { aspects: { orderBy: { order: "asc" as const } } },
    },
  },
});
