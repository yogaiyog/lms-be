import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  assessmentAspectCreateSchema,
  assessmentAspectUpdateSchema,
} from "./assessment-aspects.schema";

export const assessmentAspectsRouter = createCrudRouter({
  delegate: prisma.assessmentAspect,
  createSchema: assessmentAspectCreateSchema,
  updateSchema: assessmentAspectUpdateSchema,
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.assessmentSetId) where.assessmentSetId = req.query.assessmentSetId;
    return where;
  },
  orderBy: { order: "asc" },
});
