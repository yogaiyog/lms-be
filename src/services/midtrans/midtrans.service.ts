import crypto from "node:crypto";
import { env } from "../../config/env";

const SNAP_API_BASE = env.MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com"
  : "https://app.sandbox.midtrans.com";

const CORE_API_BASE = env.MIDTRANS_IS_PRODUCTION
  ? "https://api.midtrans.com"
  : "https://api.sandbox.midtrans.com";

const TRANSIENT_ERROR_RE = /fetch failed|ENOTFOUND|EAI_AGAIN|ECONNRESET|ETIMEDOUT|ECONNREFUSED|UND_ERR_/;

function isTransientNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as { code?: string }).code ?? "";
  return TRANSIENT_ERROR_RE.test(`${error.message} ${code}`);
}

// Midtrans endpoints sit behind a WAF with a slow/flaky CNAME chain. A cold DNS
// lookup can time out even though the endpoint is healthy; retrying warms the OS
// resolver and turns a transient blip into a successful call.
async function midtransFetch(
  url: string,
  init?: RequestInit,
  attempts = 3,
  backoffMs = 500,
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
    } catch (error) {
      lastError = error;
      if (!isTransientNetworkError(error) || i === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, backoffMs * (i + 1)));
    }
  }
  throw lastError;
}

type SnapCustomer = {
  first_name?: string;
  email?: string;
  phone?: string;
};

type SnapItem = {
  id: string;
  price: number;
  quantity: number;
  name: string;
};

export function verifyNotificationSignature(params: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey: string;
}): boolean {
  const hash = crypto
    .createHash("sha512")
    .update(`${params.orderId}${params.statusCode}${params.grossAmount}${env.MIDTRANS_SERVER_KEY}`)
    .digest("hex");
  return hash === params.signatureKey;
}

export type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  transaction_status?: string;
  fraud_status?: string;
  payment_type?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_id?: string;
  va_numbers?: Array<{ bank: string; va_number: string }>;
  permata_va_number?: string;
  qr_string?: string;
  acquirer?: string;
  payment_code?: string;
  store?: string;
};

export type MidtransPaymentStatus = "PENDING" | "SETTLEMENT" | "EXPIRED" | "DENY" | "REFUND";

export function mapTransactionStatus(notification: MidtransNotification): MidtransPaymentStatus {
  const status = notification.transaction_status;
  const fraud = notification.fraud_status;

  if (status === "capture" || status === "settlement") {
    return fraud === "deny" ? "DENY" : "SETTLEMENT";
  }
  if (status === "deny" || status === "cancel") return "DENY";
  if (status === "expire") return "EXPIRED";
  if (
    status === "refund" ||
    status === "chargeback" ||
    status === "partial_refund" ||
    status === "partial_chargeback"
  ) {
    return "REFUND";
  }
  return "PENDING";
}

export type MidtransChargeMethod = "bank_transfer" | "qris" | "gopay" | "shopeepay" | "dana";

export type MidtransBank = "bca" | "bni" | "bri" | "mandiri" | "permata";

export type CreateChargeParams = {
  orderId: string;
  grossAmount: number;
  method: MidtransChargeMethod;
  bank?: MidtransBank;
  customer?: SnapCustomer;
  items?: SnapItem[];
  notificationUrl: string;
  callbackUrl?: string;
};

export type MidtransChargeResult = {
  paymentType: MidtransChargeMethod;
  bank?: string | null;
  vaNumber?: string | null;
  qrString?: string | null;
  deeplinkUrl?: string | null;
  raw: unknown;
};

export function paymentMethodLabel(method: MidtransChargeMethod, bank?: string): string {
  if (method === "bank_transfer" && bank) {
    return `${bank.toUpperCase()} VA`;
  }
  const labels: Record<MidtransChargeMethod, string> = {
    bank_transfer: "Virtual Account",
    qris: "QRIS",
    gopay: "GoPay",
    shopeepay: "ShopeePay",
    dana: "Dana",
  };
  return labels[method];
}

export async function createChargeTransaction(
  params: CreateChargeParams,
): Promise<MidtransChargeResult> {
  const body: Record<string, unknown> = {
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
  } else if (params.method === "qris") {
    body.qris = { acquirer: "gopay" };
  } else if (params.method === "gopay") {
    body.gopay = {
      enable_callback: true,
      callback_url: params.callbackUrl ?? params.notificationUrl,
      enable_redirect: true,
    };
  } else if (params.method === "shopeepay") {
    body.shopeepay = { callback_url: params.callbackUrl ?? params.notificationUrl };
  }

  const res = await midtransFetch(`${CORE_API_BASE}/v2/charge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({})) as {
    status_code?: string;
    status_message?: string;
    va_numbers?: Array<{ bank: string; va_number: string }>;
    permata_va_number?: string;
    qr_string?: string;
    actions?: Array<{ name: string; method: string; url: string }>;
    transaction_status?: string;
  };

  if (!res.ok || (data.status_code && !data.status_code.startsWith("2"))) {
    const message = `Midtrans charge error (${res.status}): ${data.status_message ?? JSON.stringify(data)}`;
    console.error(message);
    throw new Error(message);
  }

  const actions = data.actions ?? [];
  const deeplink =
    actions.find((a) => a.name === "deeplink-redirect")?.url ??
    actions.find((a) => a.name === "generate-qr-code")?.url ??
    null;

  return {
    paymentType: params.method,
    bank: params.bank ?? data.va_numbers?.[0]?.bank ?? null,
    vaNumber:
      data.va_numbers?.[0]?.va_number ??
      data.permata_va_number ??
      null,
    qrString: data.qr_string ?? null,
    deeplinkUrl: deeplink,
    raw: data,
  };
}

export async function cancelTransaction(orderId: string): Promise<boolean> {
  try {
    const res = await midtransFetch(`${CORE_API_BASE}/v2/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
      },
    });

    const data = await res.json().catch(() => ({})) as {
      status_code?: string;
      status_message?: string;
    };

    if (!res.ok) {
      console.warn(`Midtrans cancel failed for ${orderId}: ${data.status_message ?? `HTTP ${res.status}`}`);
      return false;
    }

    return (data.status_code?.startsWith("2")) ?? res.ok;
  } catch (error) {
    console.warn(`Midtrans cancel error for ${orderId}:`, error instanceof Error ? error.message : error);
    return false;
  }
}

export async function inquireTransactionStatus(orderId: string): Promise<MidtransNotification | null> {
  try {
    const res = await midtransFetch(`${CORE_API_BASE}/v2/${orderId}/status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
      },
    });

    const data = await res.json().catch(() => null) as MidtransNotification & {
      status_code?: string;
      status_message?: string;
    };

    if (!res.ok || !data) {
      console.warn(`Midtrans inquire failed for ${orderId}: HTTP ${res.status} — ${data?.status_message ?? "no body"}`);
      return null;
    }

    return data;
  } catch (error) {
    console.warn(`Midtrans inquire error for ${orderId}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

export function labelFromNotification(notification: MidtransNotification): string | null {
  const type = notification.payment_type;
  if (!type) return null;
  if (type === "bank_transfer") {
    const bank = notification.va_numbers?.[0]?.bank;
    return bank ? `${bank.toUpperCase()} VA` : "Virtual Account";
  }
  const labels: Record<string, string> = {
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
