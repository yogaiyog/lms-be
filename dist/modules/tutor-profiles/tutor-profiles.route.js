"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorProfilesRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const tutor_profiles_schema_1 = require("./tutor-profiles.schema");
exports.tutorProfilesRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.tutorProfile,
    createSchema: tutor_profiles_schema_1.tutorProfileCreateSchema,
    updateSchema: tutor_profiles_schema_1.tutorProfileUpdateSchema,
    include: {
        user: true,
        classes: true,
        announcements: true,
    },
});
