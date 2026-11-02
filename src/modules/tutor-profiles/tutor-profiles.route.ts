import { prisma } from "../../lib/prisma";
import { safeUserInclude } from "../../lib/safe-user";
import { createCrudRouter } from "../../lib/crud-router";
import {
  tutorProfileCreateSchema,
  tutorProfileUpdateSchema,
} from "./tutor-profiles.schema";

export const tutorProfilesRouter = createCrudRouter({
  delegate: prisma.tutorProfile,
  createSchema: tutorProfileCreateSchema,
  updateSchema: tutorProfileUpdateSchema,
  include: {
    user: safeUserInclude,
    classes: true,
    announcements: true,
  },
});
