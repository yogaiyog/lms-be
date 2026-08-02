---
type: "query"
date: "2026-07-31T09:49:47.000837+00:00"
question: "Bagaimana fitur delete invoice dengan validasi bekerja?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["invoices.route", "deleteInvoice", "InvoiceDetailModal", "admin-dashboard"]
---

# Q: Bagaimana fitur delete invoice dengan validasi bekerja?

## Answer

Backend: invoices.route.ts override DELETE /:id (auth ADMIN) — cek invoice ada (404), tolak jika status PAID/PARTIAL/REFUNDED atau ada payment SETTLEMENT/REFUND (400 'sudah dibayar — tidak dapat dihapus'), lalu dalam $transaction deleteMany payment + delete invoice. Frontend: api.invoices.delete (sudah ada), useBilling.deleteInvoice (set deleting, hapus, tutup detail, refresh list, return {ok,message}), InvoiceDetailModal tombol Trash2 di header — disabled jika status dibayar (tooltip 'Invoice sudah dibayar'), konfirmasi window.confirm sebelum onDelete. Wiring di admin-dashboard.tsx dengan toast hasil.

## Outcome

- Signal: useful

## Source Nodes

- invoices.route
- deleteInvoice
- InvoiceDetailModal
- admin-dashboard