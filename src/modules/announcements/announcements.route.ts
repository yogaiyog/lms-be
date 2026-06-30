import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  announcementCreateSchema,
  announcementUpdateSchema,
} from "./announcements.schema";

export const announcementsRouter = createCrudRouter({
  delegate: prisma.announcement,
  createSchema: announcementCreateSchema,
  updateSchema: announcementUpdateSchema,
  include: {
    class: true,
    tutor: true,
  },
});
