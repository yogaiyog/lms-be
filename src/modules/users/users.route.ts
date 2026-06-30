import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { userCreateSchema, userUpdateSchema } from "./users.schema";

const include = {
  parentProfile: true,
  tutorProfile: true,
  studentProfile: true,
} satisfies Record<string, unknown>;

export const usersRouter = createCrudRouter({
  delegate: prisma.user,
  createSchema: userCreateSchema,
  updateSchema: userUpdateSchema,
  include,
});
