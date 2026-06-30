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
  listWhere: (req) => {
    const where: Record<string, unknown> = {};
    if (req.query.classId) where.classId = req.query.classId;
    return where;
  },
  include: {
    class: true,
    tutor: true,
  },
});
