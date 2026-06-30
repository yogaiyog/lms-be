import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { badgeCreateSchema, badgeUpdateSchema } from "./badges.schema";

export const badgesRouter = createCrudRouter({
  delegate: prisma.badge,
  createSchema: badgeCreateSchema,
  updateSchema: badgeUpdateSchema,
  include: {
    studentBadges: true,
  },
});
