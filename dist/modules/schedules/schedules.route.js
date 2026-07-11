"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulesRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const schedules_schema_1 = require("./schedules.schema");
exports.schedulesRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.schedule,
    createSchema: schedules_schema_1.scheduleCreateSchema,
    updateSchema: schedules_schema_1.scheduleUpdateSchema,
    listWhere: (req) => {
        const where = {};
        if (req.query.classId)
            where.classId = req.query.classId;
        return where;
    },
    include: {
        class: true,
        attendances: true,
        topicRef: true,
    },
});
