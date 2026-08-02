"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceNumber = generateInvoiceNumber;
exports.calculateInvoice = calculateInvoice;
exports.syncEnrollmentMeetCounts = syncEnrollmentMeetCounts;
exports.updateInvoiceStatus = updateInvoiceStatus;
async function generateInvoiceNumber(tx) {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    const existing = await tx.invoice.findFirst({
        where: { number: { startsWith: prefix } },
        orderBy: { number: "desc" },
        select: { number: true },
    });
    const initial = existing ? Number(existing.number.replace(prefix, "")) : 0;
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            await tx.invoiceSequence.upsert({
                where: { year },
                create: { year, last: initial },
                update: {},
            });
            const seq = await tx.invoiceSequence.update({
                where: { year },
                data: { last: { increment: 1 } },
            });
            return `${prefix}${String(seq.last).padStart(6, "0")}`;
        }
        catch (error) {
            if (error instanceof Error && "code" in error && error.code === "P2002") {
                continue;
            }
            throw error;
        }
    }
    throw new Error("Failed to generate invoice number after retries");
}
function calculateInvoice(subtotal, taxPercent, registrationFee) {
    const sub = typeof subtotal === "number" ? subtotal : Number(subtotal);
    const reg = registrationFee != null ? (typeof registrationFee === "number" ? registrationFee : Number(registrationFee)) : 0;
    const tax = taxPercent != null ? (typeof taxPercent === "number" ? taxPercent : Number(taxPercent)) : 0;
    const taxableBase = sub + reg;
    const taxAmount = Math.round(taxableBase * tax * 0.01);
    const total = taxableBase + taxAmount;
    return { taxAmount, total };
}
async function syncEnrollmentMeetCounts(tx, enrollmentId) {
    const result = await tx.invoice.aggregate({
        where: { enrollmentId, status: "PAID" },
        _sum: { meetCount: true },
    });
    const totalPurchased = result._sum.meetCount ?? 0;
    const used = await tx.meetUsage.count({
        where: { enrollmentId },
    });
    const totalLeft = Math.max(0, totalPurchased - used);
    await tx.enrollment.update({
        where: { id: enrollmentId },
        data: { totalMeetPurchased: totalPurchased, totalMeetLeft: totalLeft },
    });
}
async function updateInvoiceStatus(tx, invoiceId) {
    const payments = await tx.payment.findMany({
        where: { invoiceId },
        select: { amount: true, status: true },
    });
    const settlementAmount = payments
        .filter((p) => p.status === "SETTLEMENT")
        .reduce((sum, p) => sum + Number(p.amount), 0);
    const refundAmount = payments
        .filter((p) => p.status === "REFUND")
        .reduce((sum, p) => sum + Number(p.amount), 0);
    const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        select: { total: true, enrollmentId: true, status: true },
    });
    if (!invoice)
        return;
    const total = Number(invoice.total);
    const netSettled = settlementAmount - refundAmount;
    let newStatus;
    if (netSettled <= 0) {
        newStatus = refundAmount > 0 ? "REFUNDED" : "UNPAID";
    }
    else if (netSettled >= total) {
        newStatus = "PAID";
    }
    else {
        newStatus = "PARTIAL";
    }
    const data = { status: newStatus };
    if (newStatus === "PAID" && invoice.status !== "PAID") {
        data.paidAt = new Date();
    }
    else if (newStatus !== "PAID") {
        data.paidAt = null;
    }
    await tx.invoice.update({
        where: { id: invoiceId },
        data,
    });
    if (invoice.enrollmentId) {
        await syncEnrollmentMeetCounts(tx, invoice.enrollmentId);
    }
}
