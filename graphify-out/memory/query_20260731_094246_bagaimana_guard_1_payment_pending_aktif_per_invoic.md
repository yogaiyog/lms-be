---
type: "query"
date: "2026-07-31T09:42:46.690425+00:00"
question: "Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["cancelPendingPayments", "payments.route", "refreshSelected", "PaymentMethodModal", "InvoiceList"]
---

# Q: Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?

## Answer

Di backend/src/modules/payments/payments.route.ts ada helper cancelPendingPayments(tx, invoiceId) yang set semua Payment status PENDING milik invoice menjadi CANCELLED via updateMany. Dipanggil di dalam  pada POST / (custom create manual, sebelum tx.payment.create) dan POST /midtrans/charge (cancel + create payment dalam satu transaction). Setelah charge sukses, updateInvoiceStatus tetap dipanggil sehingga invoice UNPAID. Di frontend, useBilling.refreshSelected kini juga setMethodModalFor(full) agar PaymentMethodModal (PendingPayments filter status PENDING) langsung update setelah charge; PAYMENT_STATUS_COLORS (InvoiceList.tsx) dan PDF PAYMENT_STATUS_COLORS (invoice-pdf.service.ts) menambahkan CANCELLED.

## Outcome

- Signal: useful

## Source Nodes

- cancelPendingPayments
- payments.route
- refreshSelected
- PaymentMethodModal
- InvoiceList