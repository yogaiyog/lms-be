"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentBadgesRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const student_badges_schema_1 = require("./student-badges.schema");
exports.studentBadgesRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.studentBadge,
    createSchema: student_badges_schema_1.studentBadgeCreateSchema,
    updateSchema: student_badges_schema_1.studentBadgeUpdateSchema,
    listWhere: (req) => {
        const where = {};
        if (req.query.studentId)
            where.studentId = req.query.studentId;
        return where;
    },
    include: {
        student: true,
        badge: true,
    },
});
