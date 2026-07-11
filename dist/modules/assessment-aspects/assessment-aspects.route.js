"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentAspectsRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const assessment_aspects_schema_1 = require("./assessment-aspects.schema");
exports.assessmentAspectsRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.assessmentAspect,
    createSchema: assessment_aspects_schema_1.assessmentAspectCreateSchema,
    updateSchema: assessment_aspects_schema_1.assessmentAspectUpdateSchema,
    listWhere: (req) => {
        const where = {};
        if (req.query.assessmentSetId)
            where.assessmentSetId = req.query.assessmentSetId;
        return where;
    },
    orderBy: { order: "asc" },
});
