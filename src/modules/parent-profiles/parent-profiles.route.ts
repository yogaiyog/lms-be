import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  parentProfileCreateSchema,
  parentProfileUpdateSchema,
} from "./parent-profiles.schema";

export const parentProfilesRouter = createCrudRouter({
  delegate: prisma.parentProfile,
  createSchema: parentProfileCreateSchema,
  updateSchema: parentProfileUpdateSchema,
  include: {
    user: true,
    students: true,
  },
});
