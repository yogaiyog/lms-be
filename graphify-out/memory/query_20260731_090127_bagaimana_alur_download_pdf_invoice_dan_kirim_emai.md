---
type: "query"
date: "2026-07-31T09:01:27.597109+00:00"
question: "Bagaimana alur download PDF invoice dan kirim email di billing admin?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["InvoicePdfService", "invoices.route", "email.service", "useBilling", "InvoiceDetailModal", "fetchPdfBlob"]
---

# Q: Bagaimana alur download PDF invoice dan kirim email di billing admin?

## Answer

Alur: di InvoiceDetailModal (frontend/app/dashboard/admin/components/billing) ada tombol 'Download PDF' dan 'Kirim via Email'. Klik memanggil billing.downloadPdf/sendInvoiceEmail di hooks/useBilling.ts -> api.invoices.generatePdf(id) (fetchPdfBlob GET, native-aware via CapacitorHttp) atau api.invoices.sendEmail(id). Backend: GET /api/v1/academic/invoices/:id/pdf dan POST /:id/send-email (invoices.route.ts, auth ADMIN, requireRole) fetch invoice dengan invoicePdfInclude (enrollment.student.parent.user.email, curriculum, payments) lalu panggil InvoicePdfService (services/invoice-pdf/invoice-pdf.service.ts) berbasis pdf-lib + qrcode: header lembaga env.COMPANY_NAME, info siswa/kontak parent, rincian tagihan, bagian Metode Pembayaran dari payment PENDING terbaru (VA number besar untuk bank_transfer, QR image untuk qris, QR+deeplink untuk e-wallet), riwayat pembayaran, footer. send-email memakai emailService.sendInvoiceEmail (email.service.ts, nodemailer attachment). WA tidak otomatis - hanya tampil+salin nomor parent.

## Outcome

- Signal: useful

## Source Nodes

- InvoicePdfService
- invoices.route
- email.service
- useBilling
- InvoiceDetailModal
- fetchPdfBlob