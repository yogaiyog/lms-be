import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  attendanceAssessmentCreateSchema,
  attendanceAssessmentUpdateSchema,
} from "./attendance-assessments.schema";

export const attendanceAssessmentsRouter = createCrudRouter({
  delegate: prisma.attendanceAssessment,
  createSchema: attendanceAssessmentCreateSchema,
  updateSchema: attendanceAssessmentUpdateSchema,
  include: {
    scores: {
      include: { aspect: true },
      orderBy: { aspect: { order: "asc" as const } },
    },
    attendance: {
      include: {
        student: true,
        schedule: true,
      },
    },
  },
});
