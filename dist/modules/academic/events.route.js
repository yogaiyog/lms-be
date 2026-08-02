"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const sse_1 = require("../../services/sse");
const router = (0, express_1.Router)();
exports.eventsRouter = router;
router.get("/", (req, res) => {
    const token = req.query.token ?? "";
    if (!token) {
        res.status(401).json({ success: false, message: "Token tidak ditemukan" });
        return;
    }
    try {
        jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
    }
    catch {
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
    function onInvoiceUpdated(data) {
        res.write(`event: invoice_updated\ndata: ${JSON.stringify(data)}\n\n`);
    }
    function onPaymentUpdated(data) {
        res.write(`event: payment_updated\ndata: ${JSON.stringify(data)}\n\n`);
    }
    const keepAlive = setInterval(() => {
        res.write(":\n\n");
    }, 30000);
    sse_1.sseEvents.on("invoice_updated", onInvoiceUpdated);
    sse_1.sseEvents.on("payment_updated", onPaymentUpdated);
    req.on("close", () => {
        clearInterval(keepAlive);
        sse_1.sseEvents.off("invoice_updated", onInvoiceUpdated);
        sse_1.sseEvents.off("payment_updated", onPaymentUpdated);
    });
});
