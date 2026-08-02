---
type: "query"
date: "2026-07-31T18:37:38.476235+00:00"
question: "Bagaimana cara menghitung expiry pembayaran (Expired At) di halaman detail invoice?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["InvoiceDetailView", "PaymentInvoice", "payments.route", "midtrans.service"]
---

# Q: Bagaimana cara menghitung expiry pembayaran (Expired At) di halaman detail invoice?

## Answer

paymentExpiry(payment) di frontend/app/dashboard/admin/components/billing/InvoiceDetailView.tsx menghitung expiry dari createdAt: bank_transfer +24 jam, qris/gopay/shopeepay/dana +15 menit, manual/else null. Kolom Expired At hanya tampil untuk baris PENDING; selain itu dasbor. PENDING yang melewati expiry ditandai merah 'kedaluwarsa' (dibandingkan dengan state now yang di-refresh tiap 60 detik via useEffect interval). Riwayat pembayaran di-sort descending by createdAt via useMemo.

## Outcome

- Signal: useful

## Source Nodes

- InvoiceDetailView
- PaymentInvoice
- payments.route
- midtrans.service