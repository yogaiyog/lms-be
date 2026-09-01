"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorCostsRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const tutor_costs_schema_1 = require("./tutor-costs.schema");
exports.tutorCostsRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.tutorCost,
    createSchema: tutor_costs_schema_1.tutorCostCreateSchema,
    updateSchema: tutor_costs_schema_1.tutorCostUpdateSchema,
    orderBy: { classType: "asc" },
});
