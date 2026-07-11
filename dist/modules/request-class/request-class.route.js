"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestClassRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const request_class_schema_1 = require("./request-class.schema");
exports.requestClassRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.requestClass,
    createSchema: request_class_schema_1.requestClassCreateSchema,
    updateSchema: request_class_schema_1.requestClassUpdateSchema,
    listWhere: (req) => {
        const where = {};
        if (req.query.status)
            where.status = req.query.status;
        if (req.query.parentId)
            where.parentId = req.query.parentId;
        if (req.query.studentId)
            where.studentId = req.query.studentId;
        return where;
    },
    include: {
        student: {
            include: { user: true },
        },
        parent: true,
        prevClass: true,
        preferredTutor: { include: { user: true } },
        approvedClass: true,
    },
});
