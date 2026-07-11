"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceAssessmentsRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const attendance_assessments_schema_1 = require("./attendance-assessments.schema");
exports.attendanceAssessmentsRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.attendanceAssessment,
    createSchema: attendance_assessments_schema_1.attendanceAssessmentCreateSchema,
    updateSchema: attendance_assessments_schema_1.attendanceAssessmentUpdateSchema,
    include: {
        scores: {
            include: { aspect: true },
            orderBy: { aspect: { order: "asc" } },
        },
        attendance: {
            include: {
                student: true,
                schedule: true,
            },
        },
    },
});
