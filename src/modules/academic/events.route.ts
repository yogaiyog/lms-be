import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { sseEvents } from "../../services/sse";
import type { JwtAccessPayload } from "../auth/auth.types";

const router = Router();

router.get("/", (req, res) => {
  const token = (req.query.token as string) ?? "";
  if (!token) {
    res.status(401).json({ success: false, message: "Token tidak ditemukan" });
    return;
  }

  try {
    jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtAccessPayload;
  } catch {
    res.status(401).json({ success: false, message: "Token tidak valid" });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  res.write(":ok\n\n");

  function onInvoiceUpdated(data: { invoiceId: string }) {
    res.write(`event: invoice_updated\ndata: ${JSON.stringify(data)}\n\n`);
  }

  function onPaymentUpdated(data: { invoiceId: string }) {
    res.write(`event: payment_updated\ndata: ${JSON.stringify(data)}\n\n`);
  }

  const keepAlive = setInterval(() => {
    res.write(":\n\n");
  }, 30_000);

  sseEvents.on("invoice_updated", onInvoiceUpdated);
  sseEvents.on("payment_updated", onPaymentUpdated);

  req.on("close", () => {
    clearInterval(keepAlive);
    sseEvents.off("invoice_updated", onInvoiceUpdated);
    sseEvents.off("payment_updated", onPaymentUpdated);
  });
});

export { router as eventsRouter };
