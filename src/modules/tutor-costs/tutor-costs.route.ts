import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { tutorCostCreateSchema, tutorCostUpdateSchema } from "./tutor-costs.schema";

export const tutorCostsRouter = createCrudRouter({
  delegate: prisma.tutorCost,
  createSchema: tutorCostCreateSchema,
  updateSchema: tutorCostUpdateSchema,
  orderBy: { classType: "asc" },
});
