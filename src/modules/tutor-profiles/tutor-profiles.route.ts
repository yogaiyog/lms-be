import { prisma } from "../../lib/prisma";
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
    user: true,
    classes: true,
    announcements: true,
  },
});
