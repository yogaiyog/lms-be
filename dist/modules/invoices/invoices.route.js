"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoicesRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const invoices_schema_1 = require("./invoices.schema");
const invoices_service_1 = require("./invoices.service");
const prisma_error_1 = require("../../lib/prisma-error");
const app_error_1 = require("../../utils/app-error");
const auth_middleware_1 = require("../auth/auth.middleware");
const enums_1 = require("../../types/enums");
const invoice_pdf_service_1 = require("../../services/invoice-pdf/invoice-pdf.service");
const email_service_1 = require("../../services/email.service");
const include = {
    enrollment: {
        include: {
            student: {
                include: {
                    parent: { include: { user: { select: { email: true } } } },
                    user: { select: { email: true } },
                },
            },
            curriculum: true,
        },
    },
    payments: true,
};
const baseRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.invoice,
    createSchema: invoices_schema_1.invoiceCreateSchema,
    updateSchema: invoices_schema_1.invoiceUpdateSchema,
    include,
});
const router = (0, express_1.Router)();
exports.invoicesRouter = router;
// POST — custom: auto-generate number, calculate tax/total (atomic)
router.post("/", async (req, res, next) => {
    try {
        const payload = invoices_schema_1.invoiceCreateSchema.parse(req.body);
        const item = await prisma_1.prisma.$transaction(async (tx) => {
            const number = await (0, invoices_service_1.generateInvoiceNumber)(tx);
            const meetCount = payload.meetCount ?? 0;
            const subtotal = payload.subtotal ?? 0;
            const registrationFee = payload.registrationFee ?? 0;
            const taxPercent = payload.taxPercent ?? null;
            const { taxAmount, total } = (0, invoices_service_1.calculateInvoice)(subtotal, taxPercent, registrationFee);
            return tx.invoice.create({
                data: {
                    enrollmentId: payload.enrollmentId,
                    number,
                    description: payload.description,
                    meetCount,
                    subtotal,
                    registrationFee,
                    taxPercent,
                    taxAmount,
                    total,
                    dueDate: payload.dueDate,
                    notes: payload.notes,
                },
                include,
            });
        });
        return res.status(201).json({ success: true, data: item });
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
// PATCH — custom: recalculate tax/total, sync enrollment after status change (atomic)
router.patch("/:id", async (req, res, next) => {
    try {
        const payload = invoices_schema_1.invoiceUpdateSchema.parse(req.body);
        const item = await prisma_1.prisma.$transaction(async (tx) => {
            const existing = await tx.invoice.findUnique({ where: { id: req.params.id } });
            if (!existing)
                throw new app_error_1.AppError("Invoice not found", 404);
            const subtotal = payload.subtotal ?? Number(existing.subtotal);
            const registrationFee = "registrationFee" in payload
                ? (payload.registrationFee != null ? Number(payload.registrationFee) : null)
                : (existing.registrationFee != null ? Number(existing.registrationFee) : null);
            const taxPercent = "taxPercent" in payload
                ? (payload.taxPercent ? Number(payload.taxPercent) : null)
                : (existing.taxPercent ? Number(existing.taxPercent) : null);
            const { taxAmount, total } = (0, invoices_service_1.calculateInvoice)(subtotal, taxPercent, registrationFee ?? undefined);
            const updated = await tx.invoice.update({
                where: { id: req.params.id },
                data: { ...payload, subtotal, registrationFee, taxPercent, taxAmount, total },
                include,
            });
            if (updated.enrollmentId) {
                await (0, invoices_service_1.syncEnrollmentMeetCounts)(tx, updated.enrollmentId);
            }
            return updated;
        });
        return res.json({ success: true, data: item });
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
// GET invoices by enrollmentId
router.get("/by-enrollment/:enrollmentId", async (req, res, next) => {
    try {
        const { enrollmentId } = req.params;
        const invoices = await prisma_1.prisma.invoice.findMany({
            where: { enrollmentId },
            include: { payments: true },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ success: true, data: invoices });
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
// GET invoice PDF (admin only)
router.get("/:id/pdf", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const invoiceId = String(req.params.id);
        const invoice = await prisma_1.prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: invoice_pdf_service_1.invoicePdfInclude,
        });
        if (!invoice)
            throw new app_error_1.AppError("Invoice not found", 404);
        const pdfService = new invoice_pdf_service_1.InvoicePdfService();
        const buffer = await pdfService.generatePdf(invoice);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${invoice.number}.pdf"`);
        res.setHeader("Content-Length", buffer.length.toString());
        return res.send(buffer);
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
// POST /:id/send-email — generate invoice PDF and send to parent email (admin only)
router.post("/:id/send-email", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const invoiceId = String(req.params.id);
        const invoice = await prisma_1.prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: invoice_pdf_service_1.invoicePdfInclude,
        });
        if (!invoice)
            throw new app_error_1.AppError("Invoice not found", 404);
        const parentEmail = invoice.enrollment?.student?.parent?.user?.email;
        const studentEmail = invoice.enrollment?.student?.user?.email;
        const to = parentEmail ?? studentEmail;
        if (!to) {
            throw new app_error_1.AppError("Tidak ada email parent/student untuk dikirim", 400);
        }
        const pdfService = new invoice_pdf_service_1.InvoicePdfService();
        const buffer = await pdfService.generatePdf(invoice);
        await email_service_1.emailService.sendInvoiceEmail(to, buffer, `${invoice.number}.pdf`, {
            studentName: invoice.enrollment?.student?.fullName ?? "Siswa",
            invoiceNumber: invoice.number,
            total: Number(invoice.total),
            status: invoice.status,
        });
        return res.json({ success: true, data: { to } });
    }
    catch (error) {
        if (error instanceof app_error_1.AppError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
// Delegate remaining CRUD (read)
router.get("/", (req, res, next) => baseRouter(req, res, next));
router.get("/:id", (req, res, next) => baseRouter(req, res, next));
// DELETE — custom: cegah hapus invoice yang sudah dibayar (admin only)
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const invoiceId = String(req.params.id);
        await prisma_1.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.findUnique({
                where: { id: invoiceId },
                include: { payments: true },
            });
            if (!invoice)
                throw new app_error_1.AppError("Invoice not found", 404);
            const hasSettlement = invoice.payments.some((p) => p.status === "SETTLEMENT" || p.status === "REFUND");
            const blockedStatuses = ["PAID", "PARTIAL", "REFUNDED"];
            if (blockedStatuses.includes(invoice.status) || hasSettlement) {
                throw new app_error_1.AppError(`Invoice ${invoice.number} sudah dibayar (${invoice.status}) — tidak dapat dihapus`, 400);
            }
            await tx.payment.deleteMany({ where: { invoiceId } });
            await tx.invoice.delete({ where: { id: invoiceId } });
        });
        return res.json({ success: true });
    }
    catch (error) {
        if (error instanceof app_error_1.AppError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        const appError = (0, prisma_error_1.mapPrismaError)(error);
        return res.status(appError.statusCode).json({
            success: false,
            message: appError.message,
            code: appError.code,
        });
    }
});
