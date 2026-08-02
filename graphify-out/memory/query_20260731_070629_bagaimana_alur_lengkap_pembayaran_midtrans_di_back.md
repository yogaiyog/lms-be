---
type: "query"
date: "2026-07-31T07:06:29.210838+00:00"
question: "Bagaimana alur lengkap pembayaran Midtrans di backend?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["payments.route.ts", "midtrans.service.ts", "invoices.service.ts", "midtrans-snap.ts"]
---

# Q: Bagaimana alur lengkap pembayaran Midtrans di backend?

## Answer

Admin klik Bayar via Midtrans di frontend -> POST /api/v1/academic/payments/midtrans/snap (authenticate + requireRole ADMIN, src/modules/payments/payments.route.ts:77) -> payments.service.ts createSnapTransaction via midtrans.service.ts (sandbox https://app.sandbox.midtrans.com/snap/v1/transactions, orderId = PAY-{payment.id}, Payment dibuat PENDING dulu, di-delete bila gagal) -> balikan token+redirectUrl -> frontend lib/midtrans-snap.ts window.snap.pay. Setelah user bayar, Midtrans POST notifikasi ke /api/v1/academic/payments/midtrans/notification (public, verifikasi signature SHA512 orderId+status_code+gross_amount+serverKey di midtrans.service.ts verifyNotificationSignature) -> payment di-update status (settlement/deny/expire) -> updateInvoiceStatus(tx) sync status invoice (PAID/UNPAID/REFUNDED) + syncEnrollmentMeetCounts update totalMeetPurchased/totalMeetLeft, semua dalam prisma..

## Outcome

- Signal: useful

## Source Nodes

- payments.route.ts
- midtrans.service.ts
- invoices.service.ts
- midtrans-snap.ts