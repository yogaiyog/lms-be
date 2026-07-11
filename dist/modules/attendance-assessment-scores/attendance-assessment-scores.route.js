"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceAssessmentScoresRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const attendance_assessment_scores_schema_1 = require("./attendance-assessment-scores.schema");
exports.attendanceAssessmentScoresRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.attendanceAssessmentScore,
    createSchema: attendance_assessment_scores_schema_1.attendanceAssessmentScoreCreateSchema,
    updateSchema: attendance_assessment_scores_schema_1.attendanceAssessmentScoreUpdateSchema,
    include: {
        aspect: true,
        assessment: true,
    },
});
