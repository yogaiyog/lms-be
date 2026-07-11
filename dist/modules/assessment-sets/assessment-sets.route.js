"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentSetsRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const assessment_sets_schema_1 = require("./assessment-sets.schema");
exports.assessmentSetsRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.assessmentSet,
    createSchema: assessment_sets_schema_1.assessmentSetCreateSchema,
    updateSchema: assessment_sets_schema_1.assessmentSetUpdateSchema,
    include: {
        aspects: { orderBy: { order: "asc" } },
    },
});
