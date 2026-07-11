"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgesRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const badges_schema_1 = require("./badges.schema");
exports.badgesRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.badge,
    createSchema: badges_schema_1.badgeCreateSchema,
    updateSchema: badges_schema_1.badgeUpdateSchema,
    include: {
        studentBadges: true,
    },
});
