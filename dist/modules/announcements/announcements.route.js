"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementsRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const announcements_schema_1 = require("./announcements.schema");
exports.announcementsRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.announcement,
    createSchema: announcements_schema_1.announcementCreateSchema,
    updateSchema: announcements_schema_1.announcementUpdateSchema,
    listWhere: (req) => {
        const where = {};
        if (req.query.classId)
            where.classId = req.query.classId;
        return where;
    },
    include: {
        class: true,
        tutor: true,
    },
});
