import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import {
  attendanceAssessmentScoreCreateSchema,
  attendanceAssessmentScoreUpdateSchema,
} from "./attendance-assessment-scores.schema";

export const attendanceAssessmentScoresRouter = createCrudRouter({
  delegate: prisma.attendanceAssessmentScore,
  createSchema: attendanceAssessmentScoreCreateSchema,
  updateSchema: attendanceAssessmentScoreUpdateSchema,
  include: {
    aspect: true,
    assessment: true,
  },
});
