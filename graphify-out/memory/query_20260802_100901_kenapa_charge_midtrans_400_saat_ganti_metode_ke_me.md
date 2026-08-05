---
type: "query"
date: "2026-08-02T10:09:01.342546+00:00"
question: "Kenapa charge Midtrans 400 saat ganti metode ke metode yang sama?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["payments.route", "midtrans.service"]
---

# Q: Kenapa charge Midtrans 400 saat ganti metode ke metode yang sama?

## Answer

Bug charge Midtrans 400 saat ganti metode ke metode yang SAMA (VA BCA->VA BCA, dana->dana):
- Akar: di POST /api/v1/academic/payments/midtrans/charge (src/modules/payments/payments.route.ts), Promise.allSettled(cancelTransaction(...)) untuk transaksi lama TIDAK di-await, sehingga charge baru langsung dibuat sebelum transaksi lama dibatalkan di sisi Midtrans -> Midtrans menolak dengan 400.
- Fix: tambah await pada Promise.allSettled di route charge dan route POST / (manual), agar pembatalan transaksi lama selesai dulu sebelum charge baru.
- Logging: tambah console.error di catch route charge ("Midtrans charge failed") dan di createChargeTransaction (src/services/midtrans/midtrans.service.ts) saat res tidak ok, agar status_message Midtrans terlihat di log server.

## Outcome

- Signal: useful

## Source Nodes

- payments.route
- midtrans.service