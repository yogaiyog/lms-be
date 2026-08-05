---
type: "query"
date: "2026-08-02T10:09:01.412351+00:00"
question: "Bagaimana fix build/seed/env/webhook backend di VPS?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["seed-topics-ce", "env.ts", "payments.route", "invoices.route"]
---

# Q: Bagaimana fix build/seed/env/webhook backend di VPS?

## Answer

Lessons deploy backend ke VPS (Ubuntu 43.128.112.183, repo ~/lms-be, pm2 nama proses = lms-be, node via nvm v20.20.2 — node/npx TIDAK ada di PATH non-interaktif SSH, harus export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH").
- Build gagal di server tapi sukses lokal: Prisma client basi (belum npx prisma generate) -> 60 error TS2339 model Invoice/Payment/InvoiceSequence/imageUrl. Fix: npx prisma generate.
- P3005 "database schema is not empty": DB staging punya tabel tapi tanpa riwayat _prisma_migrations -> solusi (disetujui reset): npx prisma migrate reset --force --skip-seed.
- Seed gagal ENOENT ../UploadSeed/... : folder di git bernama uploadSeed (lowercase) tapi kode seed-topics-ce.ts pakai ../UploadSeed (capital U) -> di Linux case-sensitive ENOENT. Fix: ubah path ke ../uploadSeed + getOrUploadImage jadi resilient (fs.existsSync -> skip + warning, return null; resolveQuizImages set imageUrl undefined). Commit cb61009. uploadSampleProjects sudah pakai existsSync.
- .env VPS awalnya TIDAK punya PUBLIC_BASE_URL dan block MIDTRANS_* (SERVER_KEY kosong) -> tambah PUBLIC_BASE_URL="https://scratch.juniortechcompetition.web.id" (backend hanya publik lewat nginx scratch-gui /api/v1/ -> 127.0.0.1:4000), CORS_ORIGIN origin nyata (juaraku.juniortechcompetition.web.id pertama utk link verifikasi email karena email.service.ts pakai CORS_ORIGIN.split(',')[0]), dan MIDTRANS_MERCHANT_ID/CLIENT_KEY/SERVER_KEY/IS_PRODUCTION=false.
- Webhook Midtrans terverifikasi: POST ke https://scratch.juniortechcompetition.web.id/api/v1/academic/payments/midtrans/notification dgn signature SHA512(order_id+status_code+gross_amount+SERVER_KEY) valid -> 200 'Payment not found'; signature salah -> 400 'Invalid signature'.

## Outcome

- Signal: useful

## Source Nodes

- seed-topics-ce
- env.ts
- payments.route
- invoices.route