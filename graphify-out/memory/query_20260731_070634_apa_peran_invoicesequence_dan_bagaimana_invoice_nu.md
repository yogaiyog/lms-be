---
type: "query"
date: "2026-07-31T07:06:34.378638+00:00"
question: "Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["invoices.service.ts", "InvoiceSequence"]
---

# Q: Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?

## Answer

Model Prisma InvoiceSequence { id; year @unique; last Int @default(0) } (di akhir prisma/schema.prisma, migrasi 20260731065133_add_invoice_sequence). generateInvoiceNumber(tx) di src/modules/invoices/invoices.service.ts pakai upsert key year + increment kolom last di dalam prisma. sehingga nomor INV-{year}-{6digit} unik tanpa race; retry saat PrismaError P2002 (duplikat unique year). Semua fungsi invoice service terima tx: Prisma.TransactionClient dan route POST/PATCH invoice dibungkus  (invoices.route.ts).

## Outcome

- Signal: useful

## Source Nodes

- invoices.service.ts
- InvoiceSequence