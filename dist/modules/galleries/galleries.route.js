"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleriesRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const galleries_schema_1 = require("./galleries.schema");
const include = {
    student: { include: { user: { select: { email: true } } } },
};
const baseRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.gallery,
    createSchema: galleries_schema_1.galleryCreateSchema,
    updateSchema: galleries_schema_1.galleryUpdateSchema,
    include,
});
const router = (0, express_1.Router)();
exports.galleriesRouter = router;
// List by studentId
router.get("/student/:studentId", async (req, res, next) => {
    try {
        const items = await prisma_1.prisma.gallery.findMany({
            where: { studentId: req.params.studentId },
            include,
            orderBy: { createdAt: "desc" },
        });
        return res.json({ success: true, data: items });
    }
    catch (error) {
        const { mapPrismaError } = await Promise.resolve().then(() => __importStar(require("../../lib/prisma-error")));
        const appError = mapPrismaError(error);
        return res.status(appError.statusCode).json({
            success: false, message: appError.message, code: appError.code,
        });
    }
});
router.get("/", (req, res, next) => baseRouter(req, res, next));
router.get("/:id", (req, res, next) => baseRouter(req, res, next));
router.post("/", (req, res, next) => baseRouter(req, res, next));
router.patch("/:id", (req, res, next) => baseRouter(req, res, next));
router.delete("/:id", (req, res, next) => baseRouter(req, res, next));
