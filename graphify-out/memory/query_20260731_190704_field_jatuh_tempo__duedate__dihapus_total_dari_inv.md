---
type: "query"
date: "2026-07-31T19:07:04.702800+00:00"
question: "Field Jatuh Tempo (dueDate) dihapus total dari invoice — apa saja yang diubah?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["InvoiceFormModal", "InvoiceList", "InvoiceDetailView", "invoice-pdf.service"]
---

# Q: Field Jatuh Tempo (dueDate) dihapus total dari invoice — apa saja yang diubah?

## Answer

dueDate dihapus dari: InvoiceFormModal.tsx (state, buildPayload, prop EditFields, SummaryRow, input date), InvoiceList.tsx (kolom tabel), InvoiceDetailView.tsx (Info row), useBilling.ts InvoiceFormPayload & api.ts signature create, dan invoice-pdf.service.ts (header 'Terbit', info card 'Jatuh Tempo', teks peringatan 'Selesaikan pembayaran sebelum'). Kolom DB dueDate tetap nullable (tidak di-drop), dan tipe Invoice tetap punya dueDate (backend masih mengembalikan). dueDate tidak dipakai logika status (updateInvoiceStatus murni dari jumlah pembayaran) maupun email.

## Outcome

- Signal: useful

## Source Nodes

- InvoiceFormModal
- InvoiceList
- InvoiceDetailView
- invoice-pdf.service