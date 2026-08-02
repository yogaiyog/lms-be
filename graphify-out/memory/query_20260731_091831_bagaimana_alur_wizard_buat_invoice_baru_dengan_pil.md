---
type: "query"
date: "2026-07-31T09:18:31.168588+00:00"
question: "Bagaimana alur wizard buat invoice baru dengan pilihan metode pembayaran (manual/VA/QRIS/e-wallet) di admin dashboard?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["InvoiceFormModal", "useBilling", "payments.route", "updateInvoiceStatus", "midtransCharge"]
---

# Q: Bagaimana alur wizard buat invoice baru dengan pilihan metode pembayaran (manual/VA/QRIS/e-wallet) di admin dashboard?

## Answer

Alur: admin klik Buat Invoice -> InvoiceFormModal (frontend/app/dashboard/admin/components/billing/InvoiceFormModal.tsx) wizard 3 step (Detail -> Metode Pembayaran -> Ringkasan). onSubmitWithPayment (frontend/hooks/useBilling.ts:142) memanggil api.invoices.create lalu api.payments.create (manual, gateway manual, paymentMethod 'TRANSFER - <bank>') ATAU api.payments.createMidtransCharge (bank_transfer/qris/gopay/shopeepay/dana). Route POST /midtrans/charge (backend/src/modules/payments/payments.route.ts:75) buat payment PENDING + charge Midtrans, dan setelah charge sukses memanggil updateInvoiceStatus (backend/src/modules/invoices/invoices.service.ts:67) di dalam prisma.$transaction sehingga invoice DRAFT berubah jadi UNPAID. Jika charge gagal, payment di-delete dan invoice tetap DRAFT.

## Outcome

- Signal: useful

## Source Nodes

- InvoiceFormModal
- useBilling
- payments.route
- updateInvoiceStatus
- midtransCharge