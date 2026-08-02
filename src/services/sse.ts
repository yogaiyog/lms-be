import { EventEmitter } from "node:events";

class SseEventBus extends EventEmitter {
  emit(event: "invoice_updated" | "payment_updated", data: { invoiceId: string }) {
    return super.emit(event, data);
  }

  on(event: "invoice_updated" | "payment_updated", listener: (data: { invoiceId: string }) => void) {
    return super.on(event, listener);
  }

  off(event: "invoice_updated" | "payment_updated", listener: (data: { invoiceId: string }) => void) {
    return super.off(event, listener);
  }
}

export const sseEvents = new SseEventBus();
