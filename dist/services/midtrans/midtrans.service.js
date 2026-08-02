"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyNotificationSignature = verifyNotificationSignature;
exports.mapTransactionStatus = mapTransactionStatus;
exports.paymentMethodLabel = paymentMethodLabel;
exports.createChargeTransaction = createChargeTransaction;
exports.cancelTransaction = cancelTransaction;
exports.inquireTransactionStatus = inquireTransactionStatus;
exports.labelFromNotification = labelFromNotification;
const node_crypto_1 = __importDefault(require("node:crypto"));
const env_1 = require("../../config/env");
const SNAP_API_BASE = env_1.env.MIDTRANS_IS_PRODUCTION
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
const CORE_API_BASE = env_1.env.MIDTRANS_IS_PRODUCTION
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";
function verifyNotificationSignature(params) {
    const hash = node_crypto_1.default
        .createHash("sha512")
        .update(`${params.orderId}${params.statusCode}${params.grossAmount}${env_1.env.MIDTRANS_SERVER_KEY}`)
        .digest("hex");
    return hash === params.signatureKey;
}
function mapTransactionStatus(notification) {
    const status = notification.transaction_status;
    const fraud = notification.fraud_status;
    if (status === "capture" || status === "settlement") {
        return fraud === "deny" ? "DENY" : "SETTLEMENT";
    }
    if (status === "deny" || status === "cancel")
        return "DENY";
    if (status === "expire")
        return "EXPIRED";
    if (status === "refund" ||
        status === "chargeback" ||
        status === "partial_refund" ||
        status === "partial_chargeback") {
        return "REFUND";
    }
    return "PENDING";
}
function paymentMethodLabel(method, bank) {
    if (method === "bank_transfer" && bank) {
        return `${bank.toUpperCase()} VA`;
    }
    const labels = {
        bank_transfer: "Virtual Account",
        qris: "QRIS",
        gopay: "GoPay",
        shopeepay: "ShopeePay",
        dana: "Dana",
    };
    return labels[method];
}
async function createChargeTransaction(params) {
    const body = {
        payment_type: params.method,
        transaction_details: {
            order_id: params.orderId,
            gross_amount: Math.round(params.grossAmount),
        },
        item_details: params.items?.map((i) => ({
            id: i.id,
            price: Math.round(i.price),
            quantity: i.quantity,
            name: i.name,
        })),
        customer_details: params.customer ?? undefined,
        notification_url: params.notificationUrl,
    };
    if (params.method === "bank_transfer") {
        body.bank_transfer = { bank: params.bank ?? "bca" };
    }
    else if (params.method === "qris") {
        body.qris = { acquirer: "gopay" };
    }
    else if (params.method === "gopay") {
        body.gopay = {
            enable_callback: true,
            callback_url: params.callbackUrl ?? params.notificationUrl,
            enable_redirect: true,
        };
    }
    else if (params.method === "shopeepay") {
        body.shopeepay = { callback_url: params.callbackUrl ?? params.notificationUrl };
    }
    const res = await fetch(`${CORE_API_BASE}/v2/charge`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${Buffer.from(`${env_1.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
        },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data.status_code && !data.status_code.startsWith("2"))) {
        const message = `Midtrans charge error (${res.status}): ${data.status_message ?? JSON.stringify(data)}`;
        console.error(message);
        throw new Error(message);
    }
    const actions = data.actions ?? [];
    const deeplink = actions.find((a) => a.name === "deeplink-redirect")?.url ??
        actions.find((a) => a.name === "generate-qr-code")?.url ??
        null;
    return {
        paymentType: params.method,
        bank: params.bank ?? data.va_numbers?.[0]?.bank ?? null,
        vaNumber: data.va_numbers?.[0]?.va_number ??
            data.permata_va_number ??
            null,
        qrString: data.qr_string ?? null,
        deeplinkUrl: deeplink,
        raw: data,
    };
}
async function cancelTransaction(orderId) {
    try {
        const res = await fetch(`${CORE_API_BASE}/v2/${orderId}/cancel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Basic ${Buffer.from(`${env_1.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
            },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            console.warn(`Midtrans cancel failed for ${orderId}: ${data.status_message ?? `HTTP ${res.status}`}`);
            return false;
        }
        return (data.status_code?.startsWith("2")) ?? res.ok;
    }
    catch (error) {
        console.warn(`Midtrans cancel error for ${orderId}:`, error instanceof Error ? error.message : error);
        return false;
    }
}
async function inquireTransactionStatus(orderId) {
    try {
        const res = await fetch(`${CORE_API_BASE}/v2/${orderId}/status`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Basic ${Buffer.from(`${env_1.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
            },
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) {
            console.warn(`Midtrans inquire failed for ${orderId}: HTTP ${res.status} — ${data?.status_message ?? "no body"}`);
            return null;
        }
        return data;
    }
    catch (error) {
        console.warn(`Midtrans inquire error for ${orderId}:`, error instanceof Error ? error.message : error);
        return null;
    }
}
function labelFromNotification(notification) {
    const type = notification.payment_type;
    if (!type)
        return null;
    if (type === "bank_transfer") {
        const bank = notification.va_numbers?.[0]?.bank;
        return bank ? `${bank.toUpperCase()} VA` : "Virtual Account";
    }
    const labels = {
        qris: "QRIS",
        gopay: "GoPay",
        shopeepay: "ShopeePay",
        dana: "Dana",
        echannel: "Mandiri Bill",
        cstore: "Convenience Store",
        credit_card: "Kartu Kredit",
    };
    return labels[type] ?? type;
}
