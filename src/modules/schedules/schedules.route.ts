import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { scheduleCreateSchema, scheduleUpdateSchema } from "./schedules.schema";

export const schedulesRouter = createCrudRouter({
  delegate: prisma.schedule,
  createSchema: scheduleCreateSchema,
  updateSchema: scheduleUpdateSchema,
  include: {
    class: true,
    attendances: true,
  },
});
