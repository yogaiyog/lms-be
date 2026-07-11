"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificatesRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const prisma_error_1 = require("../../lib/prisma-error");
const certificate_1 = require("../../services/certificate");
const certificates_schema_1 = require("./certificates.schema");
const include = {
    student: true,
    curriculum: true,
};
const baseRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.certificate,
    createSchema: certificates_schema_1.certificateCreateSchema,
    updateSchema: certificates_schema_1.certificateUpdateSchema,
    include,
});
const router = (0, express_1.Router)();
exports.certificatesRouter = router;
const certificateService = new certificate_1.CertificateService();
// POST /api/v1/academic/certificates/generate
router.post("/generate", async (req, res, next) => {
    const start = Date.now();
    console.log(`[CertificateRoute] POST /generate received body:`, JSON.stringify(req.body, null, 2));
    try {
        const payload = certificates_schema_1.certificateGenerateSchema.parse(req.body);
        console.log(`[CertificateRoute] parsed payload:`, JSON.stringify(payload, null, 2));
        const buffer = await certificateService.generateBuffer(payload);
        const sanitizedName = payload.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        console.log(`[CertificateRoute] generated ${buffer.length} bytes, sending as "${sanitizedName}.pptx"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
        res.setHeader("Content-Disposition", `attachment; filename="${sanitizedName}.pptx"`);
        res.setHeader("X-Certificate-Generate-Ms", String(Date.now() - start));
        return res.send(buffer);
    }
    catch (error) {
        console.error(`[CertificateRoute] error after ${Date.now() - start}ms:`, error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message).join("; "),
            });
        }
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// POST /api/v1/academic/certificates/generate-pdf
router.post("/generate-pdf", async (req, res, next) => {
    const start = Date.now();
    try {
        const payload = certificates_schema_1.certificateGenerateSchema.parse(req.body);
        const pdfService = new certificate_1.PdfConversionService();
        const buffer = await pdfService.generatePdfBuffer(payload);
        const sanitizedName = pdfService.sanitizeFileName(payload.name);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${sanitizedName}.pdf"`);
        res.setHeader("X-Certificate-Generate-Ms", String(Date.now() - start));
        return res.send(buffer);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message).join("; "),
            });
        }
        console.error(`[CertificateRoute] PDF generate error:`, error);
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// POST /api/v1/academic/certificates/generate-batch
router.post("/generate-batch", async (req, res, next) => {
    try {
        const payload = certificates_schema_1.certificateBatchGenerateSchema.parse(req.body);
        const results = await certificateService.generateBatch(payload.entries);
        return res.status(201).json({ success: true, data: results });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors.map((e) => e.message).join("; "),
            });
        }
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// GET /api/v1/academic/certificates/student/:studentId
router.get("/student/:studentId", async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const certificates = await prisma_1.prisma.certificate.findMany({
            where: { studentId },
            include,
        });
        return res.json({ success: true, data: certificates });
    }
    catch (error) {
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// Delegate remaining CRUD methods to baseRouter
router.get("/", (req, res, next) => baseRouter(req, res, next));
router.get("/:id", (req, res, next) => baseRouter(req, res, next));
router.post("/", (req, res, next) => baseRouter(req, res, next));
router.patch("/:id", (req, res, next) => baseRouter(req, res, next));
router.delete("/:id", (req, res, next) => baseRouter(req, res, next));
