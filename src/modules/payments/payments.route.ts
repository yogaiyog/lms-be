import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { paymentCreateSchema, paymentUpdateSchema, midtransChargeSchema } from "./payments.schema";
import { updateInvoiceStatus } from "../invoices/invoices.service";
import { mapPrismaError } from "../../lib/prisma-error";
import { AppError } from "../../utils/app-error";
import { authenticate, requireRole } from "../auth/auth.middleware";
import { Role } from "../../types/enums";
import { env } from "../../config/env";
import { sseEvents } from "../../services/sse";
import {
  cancelTransaction,
  createChargeTransaction,
  inquireTransactionStatus,
  labelFromNotification,
  mapTransactionStatus,
  paymentMethodLabel,
  verifyNotificationSignature,
  type MidtransNotification,
} from "../../services/midtrans/midtrans.service";

const include = { invoice: { include: { enrollment: { include: { student: true, curriculum: true } } } } };

const baseRouter = createCrudRouter({
  delegate: prisma.payment,
  createSchema: paymentCreateSchema,
  updateSchema: paymentUpdateSchema,
  include,
});

const router = Router();

async function cancelPendingPayments(tx: Prisma.TransactionClient, invoiceId: string) {
  await tx.payment.updateMany({
    where: { invoiceId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

// POST — custom: after create, update invoice status (atomic)
router.post("/", async (req, res, next) => {
  try {
    const payload = paymentCreateSchema.parse(req.body);

    const pendingMidtrans = await prisma.payment.findMany({
      where: { invoiceId: payload.invoiceId, status: "PENDING", gateway: "midtrans", transactionId: { not: null } },
      select: { transactionId: true },
    });

    const item = await prisma.$transaction(async (tx) => {
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

      await updateInvoiceStatus(tx, payload.invoiceId);
      return created;
    });

    await Promise.allSettled(
      pendingMidtrans.map((p) => (p.transactionId ? cancelTransaction(p.transactionId) : Promise.resolve(false))),
    );

    return res.status(201).json({ success: true, data: item });
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

// POST /midtrans/charge — create Midtrans charge for an invoice with a chosen payment method (admin)
router.post("/midtrans/charge", authenticate, requireRole(Role.ADMIN), async (req, res, next) => {
  try {
    const payload = midtransChargeSchema.parse(req.body);

    const invoice = await prisma.invoice.findUnique({
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
    if (!invoice) throw new AppError("Invoice not found", 404);
    if (["PAID", "CANCELLED", "REFUNDED"].includes(invoice.status)) {
      throw new AppError(`Invoice ${invoice.status} tidak bisa dibayar`, 400);
    }

    const settled = invoice.payments
      .filter((p) => p.status === "SETTLEMENT")
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const amount = payload.amount ?? Number(invoice.total) - settled;
    if (amount <= 0) throw new AppError("Invoice sudah lunas — tidak ada sisa tagihan", 400);

    const paymentId = randomUUID();
    const orderId = `PAY-${paymentId}`;

    const pendingMidtrans = await prisma.payment.findMany({
      where: { invoiceId: payload.invoiceId, status: "PENDING", gateway: "midtrans", transactionId: { not: null } },
      select: { transactionId: true },
    });

    const payment = await prisma.$transaction(async (tx) => {
      await cancelPendingPayments(tx, payload.invoiceId);
      return tx.payment.create({
        data: {
          id: paymentId,
          invoiceId: payload.invoiceId,
          amount,
          status: "PENDING",
          gateway: "midtrans",
          transactionId: orderId,
          paymentMethod: paymentMethodLabel(payload.method, payload.bank),
          paymentType: payload.method,
          bank: payload.bank,
        },
        include,
      });
    });

    await Promise.allSettled(
      pendingMidtrans.map((p) => (p.transactionId ? cancelTransaction(p.transactionId) : Promise.resolve(false))),
    );

    const notificationUrl = `${env.PUBLIC_BASE_URL}/api/v1/academic/payments/midtrans/notification`;

    try {
      const charge = await createChargeTransaction({
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
        });

      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          paymentMethod: paymentMethodLabel(charge.paymentType, charge.bank ?? undefined),
          bank: charge.bank,
          vaNumber: charge.vaNumber,
          qrString: charge.qrString,
          deeplinkUrl: charge.deeplinkUrl,
          midtransRaw: charge.raw as Prisma.InputJsonValue,
        },
        include,
      });

      await prisma.$transaction((tx) => updateInvoiceStatus(tx, payload.invoiceId));

      return res.status(201).json({ success: true, data: updated });
    } catch (error) {
      await prisma.payment.delete({ where: { id: paymentId } }).catch(() => {});
      console.error("Midtrans charge failed:", error instanceof Error ? error.message : error);
      throw error;
    }
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

// POST /midtrans/notification — Midtrans HTTP notification (public, signature verified)
router.post("/midtrans/notification", async (req, res) => {
  try {
    const body = req.body as MidtransNotification;

    const orderId = body.order_id ?? "";
    const statusCode = body.status_code ?? "";
    const grossAmount = body.gross_amount ?? "";
    const signatureKey = body.signature_key ?? "";

    if (!verifyNotificationSignature({ orderId, statusCode, grossAmount, signatureKey })) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const payment = await prisma.payment.findFirst({
      where: { transactionId: orderId },
      select: { id: true, invoiceId: true, amount: true, status: true, paidAt: true },
    });
    if (!payment) {
      return res.json({ success: false, message: "Payment not found" });
    }

    if (["CANCELLED", "DENY", "REFUND"].includes(payment.status)) {
      return res.json({ success: true, data: { skipped: true, reason: `Payment already ${payment.status}` } });
    }

    const newStatus = mapTransactionStatus(body);
    const vaNumber = body.va_numbers?.[0]?.va_number ?? body.permata_va_number ?? null;

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          paymentMethod: body.payment_type ? labelFromNotification(body) : undefined,
          paymentType: body.payment_type ?? undefined,
          bank: body.va_numbers?.[0]?.bank ?? undefined,
          vaNumber: vaNumber ?? undefined,
          qrString: body.qr_string ?? undefined,
          midtransRaw: body,
          paidAt: newStatus === "SETTLEMENT" ? (payment.paidAt ?? new Date()) : undefined,
        },
      });
      await updateInvoiceStatus(tx, payment.invoiceId);
    });

    sseEvents.emit("invoice_updated", { invoiceId: payment.invoiceId });
    return res.json({ success: true });
  } catch (error) {
    const appError = mapPrismaError(error);
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
    const payload = paymentUpdateSchema.parse(req.body);

    const data: any = { ...payload };
    if (payload.status === "SETTLEMENT" && !data.paidAt) {
      data.paidAt = new Date();
    }

    const item = await prisma.$transaction(async (tx) => {
      if (payload.status === "SETTLEMENT") {
        const existing = await tx.payment.findUnique({
          where: { id: req.params.id },
          select: { status: true },
        });
        if (existing && ["CANCELLED", "DENY"].includes(existing.status)) {
          throw new AppError(`Payment is ${existing.status} — cannot be revived to SETTLEMENT`, 400);
        }
      }

      const updated = await tx.payment.update({
        where: { id: req.params.id },
        data,
        include,
      });

      await updateInvoiceStatus(tx, updated.invoiceId);
      return updated;
    });

    return res.json({ success: true, data: item });
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

// GET payments by invoiceId
router.get("/by-invoice/:invoiceId", async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const payments = await prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: payments });
  } catch (error) {
    const appError = mapPrismaError(error);
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
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      select: { id: true, invoiceId: true, transactionId: true, status: true, paidAt: true, gateway: true },
    });
    if (!payment) throw new AppError("Payment not found", 404);
    if (payment.gateway !== "midtrans" || !payment.transactionId) {
      throw new AppError("Pembayaran ini bukan Midtrans — hanya bisa dicek manual", 400);
    }
    if (["CANCELLED", "DENY", "REFUND"].includes(payment.status)) {
      return res.json({ success: true, data: { skipped: true, reason: `Payment already ${payment.status}` } });
    }

    const inquiry = await inquireTransactionStatus(payment.transactionId);
    if (!inquiry) {
      throw new AppError("Gagal menghubungi Midtrans — coba lagi nanti", 502);
    }

    const newStatus = mapTransactionStatus(inquiry);
    if (newStatus === payment.status) {
      return res.json({ success: true, data: { unchanged: true, status: payment.status } });
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          paidAt: newStatus === "SETTLEMENT" ? (payment.paidAt ?? new Date()) : undefined,
        },
      });
      await updateInvoiceStatus(tx, payment.invoiceId);
    });

    sseEvents.emit("invoice_updated", { invoiceId: payment.invoiceId });

    const updated = await prisma.payment.findUnique({
      where: { id: payment.id },
      include,
    });

    return res.json({ success: true, data: { updated: true, payment: updated } });
  } catch (error) {
    const appError = mapPrismaError(error);
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

export { router as paymentsRouter };
