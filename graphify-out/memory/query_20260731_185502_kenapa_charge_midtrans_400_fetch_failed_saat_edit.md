---
type: "query"
date: "2026-07-31T18:55:02.728755+00:00"
question: "Kenapa charge Midtrans 400 fetch failed saat edit invoice / ganti metode pembayaran?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["payments.route", "useBilling", "api.ts", "midtrans.service"]
---

# Q: Kenapa charge Midtrans 400 fetch failed saat edit invoice / ganti metode pembayaran?

## Answer

Akar masalah: port 4000 dilayani proses backend STALE (tsx sejak 16:48) yang outbound ke api.sandbox.midtrans.com flaky, sementara tsx watch baru gagal bind. Solusi: restart backend bersih, tambah retry transient di payments.route.ts (isTransientNetworkError/retryCharge, retry 2x jeda 700ms untuk error jaringan), dan tampilkan error asli di toast useBilling.ts. Setelah restart charge sukses 201 dengan VA number.

## Outcome

- Signal: useful

## Source Nodes

- payments.route
- useBilling
- api.ts
- midtrans.service