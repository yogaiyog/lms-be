"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicsRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const topics_schema_1 = require("./topics.schema");
exports.topicsRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.topic,
    createSchema: topics_schema_1.topicCreateSchema,
    updateSchema: topics_schema_1.topicUpdateSchema,
    listWhere: (req) => {
        const where = {};
        if (req.query.curriculumId)
            where.curriculumId = req.query.curriculumId;
        return where;
    },
});
