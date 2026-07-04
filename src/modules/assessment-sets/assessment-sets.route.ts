import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  assessmentSetCreateSchema,
  assessmentSetUpdateSchema,
} from "./assessment-sets.schema";

export const assessmentSetsRouter = createCrudRouter({
  delegate: prisma.assessmentSet,
  createSchema: assessmentSetCreateSchema,
  updateSchema: assessmentSetUpdateSchema,
  include: {
    aspects: { orderBy: { order: "asc" as const } },
  },
});
