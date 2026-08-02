"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = require("express");
const node_crypto_1 = require("node:crypto");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const crud_router_1 = require("../../lib/crud-router");
const payments_schema_1 = require("./payments.schema");
const invoices_service_1 = require("../invoices/invoices.service");
const prisma_error_1 = require("../../lib/prisma-error");
const app_error_1 = require("../../utils/app-error");
const auth_middleware_1 = require("../auth/auth.middleware");
const enums_1 = require("../../types/enums");
const env_1 = require("../../config/env");
const sse_1 = require("../../services/sse");
const midtrans_service_1 = require("../../services/midtrans/midtrans.service");
const include = { invoice: { include: { enrollment: { include: { student: true, curriculum: true } } } } };
const baseRouter = (0, crud_router_1.createCrudRouter)({
    delegate: prisma_1.prisma.payment,
    createSchema: payments_schema_1.paymentCreateSchema,
    updateSchema: payments_schema_1.paymentUpdateSchema,
    include,
});
const router = (0, express_1.Router)();
exports.paymentsRouter = router;
async function cancelPendingPayments(tx, invoiceId) {
    await tx.payment.updateMany({
        where: { invoiceId, status: "PENDING" },
        data: { status: "CANCELLED" },
    });
}
function isTransientNetworkError(error) {
    if (!(error instanceof Error))
        return false;
    const code = error.code ?? "";
    const msg = `${error.message} ${code}`;
    return /fetch failed|ENOTFOUND|EAI_AGAIN|ECONNRESET|ETIMEDOUT|ECONNREFUSED|UND_ERR_/.test(msg);
}
async function retryCharge(fn, attempts = 2, delayMs = 700) {
    let lastError;
    for (let i = 0; i < attempts; i += 1) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (!isTransientNetworkError(error) || i === attempts - 1)
                throw error;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
    throw lastError;
}
// POST — custom: after create, update invoice status (atomic)
router.post("/", async (req, res, next) => {
    try {
        const payload = payments_schema_1.paymentCreateSchema.parse(req.body);
        const pendingMidtrans = await prisma_1.prisma.payment.findMany({
            where: { invoiceId: payload.invoiceId, status: "PENDING", gateway: "midtrans", transactionId: { not: null } },
            select: { transactionId: true },
        });
        const item = await prisma_1.prisma.$transaction(async (tx) => {
            await cancelPendingPayments(tx, payload.invoiceId);
            const created = await tx.payment.create({
                data: {
                    invoiceId: payload.invoiceId,
                    amount: payload.amount,
                    paymentMethod: payload.paymentMethod,
                    status: payload.status ?? "PENDING",
                    transactionId: payload.transactionId,
                    gateway: payload.gateway,
                    paidAt: payload.status === "SETTLEMENT" ? (payload.paidAt ?? new Date()) : payload.paidAt,
                },
                include,
            });
            await (0, invoices_service_1.updateInvoiceStatus)(tx, payload.invoiceId);
            return created;
        });
        await Promise.allSettled(pendingMidtrans.map((p) => (p.transactionId ? (0, midtrans_service_1.cancelTransaction)(p.transactionId) : Promise.resolve(false))));
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
// POST /midtrans/charge — create Midtrans charge for an invoice with a chosen payment method (admin)
router.post("/midtrans/charge", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const payload = payments_schema_1.midtransChargeSchema.parse(req.body);
        const invoice = await prisma_1.prisma.invoice.findUnique({
            where: { id: payload.invoiceId },
            include: {
                enrollment: {
                    include: {
                        student: { include: { user: { select: { email: true } }, parent: true } },
                        curriculum: true,
                    },
                },
                payments: true,
            },
        });
        if (!invoice)
            throw new app_error_1.AppError("Invoice not found", 404);
        if (["PAID", "CANCELLED", "REFUNDED"].includes(invoice.status)) {
            throw new app_error_1.AppError(`Invoice ${invoice.status} tidak bisa dibayar`, 400);
        }
        const settled = invoice.payments
            .filter((p) => p.status === "SETTLEMENT")
            .reduce((sum, p) => sum + Number(p.amount), 0);
        const amount = payload.amount ?? Number(invoice.total) - settled;
        if (amount <= 0)
            throw new app_error_1.AppError("Invoice sudah lunas — tidak ada sisa tagihan", 400);
        const paymentId = (0, node_crypto_1.randomUUID)();
        const orderId = `PAY-${paymentId}`;
        const pendingMidtrans = await prisma_1.prisma.payment.findMany({
            where: { invoiceId: payload.invoiceId, status: "PENDING", gateway: "midtrans", transactionId: { not: null } },
            select: { transactionId: true },
        });
        const payment = await prisma_1.prisma.$transaction(async (tx) => {
            await cancelPendingPayments(tx, payload.invoiceId);
            return tx.payment.create({
                data: {
                    id: paymentId,
                    invoiceId: payload.invoiceId,
                    amount,
                    status: "PENDING",
                    gateway: "midtrans",
                    transactionId: orderId,
                    paymentMethod: (0, midtrans_service_1.paymentMethodLabel)(payload.method, payload.bank),
                    paymentType: payload.method,
                    bank: payload.bank,
                },
                include,
            });
        });
        await Promise.allSettled(pendingMidtrans.map((p) => (p.transactionId ? (0, midtrans_service_1.cancelTransaction)(p.transactionId) : Promise.resolve(false))));
        const notificationUrl = `${env_1.env.PUBLIC_BASE_URL}/api/v1/academic/payments/midtrans/notification`;
        try {
            const charge = await retryCharge(() => (0, midtrans_service_1.createChargeTransaction)({
                orderId,
                grossAmount: amount,
                method: payload.method,
                bank: payload.bank,
                customer: {
                    first_name: invoice.enrollment.student.fullName,
                    email: invoice.enrollment.student.user?.email,
                    phone: invoice.enrollment.student.parent?.phone,
                },
                items: [
                    {
                        id: invoice.number,
                        price: amount,
                        quantity: 1,
                        name: invoice.description || `Invoice ${invoice.number}`,
                    },
                ],
                notificationUrl,
                callbackUrl: notificationUrl,
            }));
            const updated = await prisma_1.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    paymentMethod: (0, midtrans_service_1.paymentMethodLabel)(charge.paymentType, charge.bank ?? undefined),
                    bank: charge.bank,
                    vaNumber: charge.vaNumber,
                    qrString: charge.qrString,
                    deeplinkUrl: charge.deeplinkUrl,
                    midtransRaw: charge.raw,
                },
                include,
            });
            await prisma_1.prisma.$transaction((tx) => (0, invoices_service_1.updateInvoiceStatus)(tx, payload.invoiceId));
            return res.status(201).json({ success: true, data: updated });
        }
        catch (error) {
            await prisma_1.prisma.payment.delete({ where: { id: paymentId } }).catch(() => { });
            console.error("Midtrans charge failed:", error instanceof Error ? error.message : error);
            throw error;
        }
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
// POST /midtrans/notification — Midtrans HTTP notification (public, signature verified)
router.post("/midtrans/notification", async (req, res) => {
    try {
        const body = req.body;
        const orderId = body.order_id ?? "";
        const statusCode = body.status_code ?? "";
        const grossAmount = body.gross_amount ?? "";
        const signatureKey = body.signature_key ?? "";
        if (!(0, midtrans_service_1.verifyNotificationSignature)({ orderId, statusCode, grossAmount, signatureKey })) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
        const payment = await prisma_1.prisma.payment.findFirst({
            where: { transactionId: orderId },
            select: { id: true, invoiceId: true, amount: true, status: true, paidAt: true },
        });
        if (!payment) {
            return res.json({ success: false, message: "Payment not found" });
        }
        if (["CANCELLED", "DENY", "REFUND"].includes(payment.status)) {
            return res.json({ success: true, data: { skipped: true, reason: `Payment already ${payment.status}` } });
        }
        const newStatus = (0, midtrans_service_1.mapTransactionStatus)(body);
        const vaNumber = body.va_numbers?.[0]?.va_number ?? body.permata_va_number ?? null;
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: newStatus,
                    paymentMethod: body.payment_type ? (0, midtrans_service_1.labelFromNotification)(body) : undefined,
                    paymentType: body.payment_type ?? undefined,
                    bank: body.va_numbers?.[0]?.bank ?? undefined,
                    vaNumber: vaNumber ?? undefined,
                    qrString: body.qr_string ?? undefined,
                    midtransRaw: body,
                    paidAt: newStatus === "SETTLEMENT" ? (payment.paidAt ?? new Date()) : undefined,
                },
            });
            await (0, invoices_service_1.updateInvoiceStatus)(tx, payment.invoiceId);
        });
        sse_1.sseEvents.emit("invoice_updated", { invoiceId: payment.invoiceId });
        return res.json({ success: true });
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
// PATCH — custom: after update, update invoice status (atomic)
router.patch("/:id", async (req, res, next) => {
    try {
        const payload = payments_schema_1.paymentUpdateSchema.parse(req.body);
        const data = { ...payload };
        if (payload.status === "SETTLEMENT" && !data.paidAt) {
            data.paidAt = new Date();
        }
        const item = await prisma_1.prisma.$transaction(async (tx) => {
            if (payload.status === "SETTLEMENT") {
                const existing = await tx.payment.findUnique({
                    where: { id: req.params.id },
                    select: { status: true },
                });
                if (existing && ["CANCELLED", "DENY"].includes(existing.status)) {
                    throw new app_error_1.AppError(`Payment is ${existing.status} — cannot be revived to SETTLEMENT`, 400);
                }
            }
            const updated = await tx.payment.update({
                where: { id: req.params.id },
                data,
                include,
            });
            await (0, invoices_service_1.updateInvoiceStatus)(tx, updated.invoiceId);
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
// GET payments by invoiceId
router.get("/by-invoice/:invoiceId", async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        const payments = await prisma_1.prisma.payment.findMany({
            where: { invoiceId },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ success: true, data: payments });
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
// POST /:id/check-status — cek status pembayaran langsung ke Midtrans
router.post("/:id/check-status", async (req, res) => {
    try {
        const payment = await prisma_1.prisma.payment.findUnique({
            where: { id: req.params.id },
            select: { id: true, invoiceId: true, transactionId: true, status: true, paidAt: true, gateway: true },
        });
        if (!payment)
            throw new app_error_1.AppError("Payment not found", 404);
        if (payment.gateway !== "midtrans" || !payment.transactionId) {
            throw new app_error_1.AppError("Pembayaran ini bukan Midtrans — hanya bisa dicek manual", 400);
        }
        if (["CANCELLED", "DENY", "REFUND"].includes(payment.status)) {
            return res.json({ success: true, data: { skipped: true, reason: `Payment already ${payment.status}` } });
        }
        const inquiry = await (0, midtrans_service_1.inquireTransactionStatus)(payment.transactionId);
        if (!inquiry) {
            throw new app_error_1.AppError("Gagal menghubungi Midtrans — coba lagi nanti", 502);
        }
        const newStatus = (0, midtrans_service_1.mapTransactionStatus)(inquiry);
        if (newStatus === payment.status) {
            return res.json({ success: true, data: { unchanged: true, status: payment.status } });
        }
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: newStatus,
                    paidAt: newStatus === "SETTLEMENT" ? (payment.paidAt ?? new Date()) : undefined,
                },
            });
            await (0, invoices_service_1.updateInvoiceStatus)(tx, payment.invoiceId);
        });
        sse_1.sseEvents.emit("invoice_updated", { invoiceId: payment.invoiceId });
        const updated = await prisma_1.prisma.payment.findUnique({
            where: { id: payment.id },
            include,
        });
        return res.json({ success: true, data: { updated: true, payment: updated } });
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
// Delegate remaining CRUD
router.get("/", (req, res, next) => baseRouter(req, res, next));
router.get("/:id", (req, res, next) => baseRouter(req, res, next));
router.delete("/:id", (req, res, next) => baseRouter(req, res, next));
