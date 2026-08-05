---
type: "query"
date: "2026-08-02T10:09:01.273732+00:00"
question: "Kenapa PDF invoice error 400 saat download PAID, dan bagaimana perbaikannya?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["invoice-pdf.service", "invoices.route", "prisma-error"]
---

# Q: Kenapa PDF invoice error 400 saat download PAID, dan bagaimana perbaikannya?

## Answer

Penyebab & perbaikan PDF invoice:
- Bug 400 saat download PDF invoice berstatus PAID: karakter "✓" (U+2713) di cabang PAID src/services/invoice-pdf/invoice-pdf.service.ts tidak ada di encoding WinAnsi font standard Helvetica -> pdf-lib lempar Error 'WinAnsi cannot encode "✓" (0x2713)' -> catch route (invoices.route.ts) panggil mapPrismaError yang mengubah Error biasa apa pun menjadi 400.
- Fix: (1) hapus karakter "✓"; (2) tambah helper safeText(text,font,size) yang membuang karakter yang tidak bisa di-encode (try widthOfTextAtSize per char), dipakai di drawText/wrapText/badgeWidth agar simbol aneh apa pun tidak pernah mematikan generate PDF.
- Perbaikan layout lain: header bar terikat ke atas halaman (HEADER_H=130, PAGE_H-based), spacing info grid y-=180 agar judul 'RINCIAN TAGIHAN' tidak menimpa kartu info terakhir, wrapText memecah kata tanpa spasi (payload QR) agar tidak meluber ke kanan, ensureSpace per metode pembayaran (bank 140 / qris 280 / ewallet 480).
- Diagnosa memakai ekstraksi teks+koordinat dari content-stream PDF (model tidak bisa baca PDF/gambar).

## Outcome

- Signal: useful

## Source Nodes

- invoice-pdf.service
- invoices.route
- prisma-error