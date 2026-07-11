"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const users_schema_1 = require("./users.schema");
const include = {
    parentProfile: true,
    tutorProfile: true,
    studentProfile: true,
};
exports.usersRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.user,
    createSchema: users_schema_1.userCreateSchema,
    updateSchema: users_schema_1.userUpdateSchema,
    include,
});
