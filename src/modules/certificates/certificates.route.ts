import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { mapPrismaError } from "../../lib/prisma-error";
import { AppError } from "../../utils/app-error";
import { CertificateService, PdfConversionService } from "../../services/certificate";
import {
  certificateCreateSchema,
  certificateUpdateSchema,
  certificateGenerateSchema,
  certificateBatchGenerateSchema,
} from "./certificates.schema";

const include = {
  student: true,
  curriculum: true,
};

const baseRouter = createCrudRouter({
  delegate: prisma.certificate,
  createSchema: certificateCreateSchema,
  updateSchema: certificateUpdateSchema,
  include,
});

const router = Router();
const certificateService = new CertificateService();

// POST /api/v1/academic/certificates/generate
router.post("/generate", async (req, res, next) => {
  const start = Date.now();
  console.log(`[CertificateRoute] POST /generate received body:`, JSON.stringify(req.body, null, 2));
  try {
    const payload = certificateGenerateSchema.parse(req.body);
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
  } catch (error) {
    console.error(`[CertificateRoute] error after ${Date.now() - start}ms:`, error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join("; "),
      });
    }
    const appError = mapPrismaError(error);
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
    const payload = certificateGenerateSchema.parse(req.body);
    const pdfService = new PdfConversionService();
    const buffer = await pdfService.generatePdfBuffer(payload);
    const sanitizedName = pdfService.sanitizeFileName(payload.name);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${sanitizedName}.pdf"`);
    res.setHeader("X-Certificate-Generate-Ms", String(Date.now() - start));
    return res.send(buffer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join("; "),
      });
    }
    console.error(`[CertificateRoute] PDF generate error:`, error);
    const appError = mapPrismaError(error);
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
    const payload = certificateBatchGenerateSchema.parse(req.body);
    const results = await certificateService.generateBatch(payload.entries);
    return res.status(201).json({ success: true, data: results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join("; "),
      });
    }
    const appError = mapPrismaError(error);
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
    const certificates = await prisma.certificate.findMany({
      where: { studentId } as any,
      include,
    });
    return res.json({ success: true, data: certificates });
  } catch (error) {
    const appError = mapPrismaError(error);
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

export { router as certificatesRouter };
