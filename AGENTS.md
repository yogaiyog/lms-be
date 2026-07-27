<!-- BEGIN:graphify-rules -->

# Graphify — Wajib Pakai Sebelum Baca Kode (Hemat Token)

Sebelum membaca file untuk memahami kode, cek graph dulu:

```bash
if [ -f graphify-out/graph.json ]; then
    graphify query "<pertanyaan tentang kode>"
fi
```

## Cara pakai

```bash
# Query arsitektur (BFS — broad context)
graphify query "bagaimana alur authentication?"
graphify query "siapa aja yang import AppError?"

# Trace path spesifik (DFS)
graphify query "dari route ke service" --dfs

# Cari jalur antar konsep
graphify path "CertificateService" "ReportPdfService"

# Penjelasan node tertentu
graphify explain "createCrudRouter"
```

## Efek hemat token

Ganti `graphify query` ini:
- ❌ Baca 20 file `.route.ts` satu per satu → **ribuan token**
- ✅ `graphify query "siapa import createCrudRouter?"` → **puluhan token**

## Save query ke graph (memory) — biar agent berikutnya makin pintar

Setiap query yang menghasilkan insight arsitektur, **wajib di-save**:

```bash
# Template
graphify query "pertanyaan" 2>&1

$(cat graphify-out/.graphify_python) -m graphify save-result \
  --question "Pertanyaan dalam Bahasa Indonesia" \
  --answer "Jawaban dalam Bahasa Indonesia (jelas, struktural, sebut file path)" \
  --type query \
  --outcome useful \
  --nodes Node1 Node2 Node3

# Lalu refresh
$(cat graphify-out/.graphify_python) -m graphify reflect --if-stale
```

**Kriteria `--outcome`:**
| Outcome | Kapan pakai | Efek ke graph |
|---|---|---|
| `useful` | Jawaban akurat, node tepat, insight arsitektur | Jadi *preferred source* — agent lain mulai dari sini |
| `dead_end` | Query gak nemu jawaban relevan | Agent skip query mirip ini di masa depan |
| `corrected` | Jawaban sebelumnya salah | Timpa dengan `--correction "jawaban benar"` |

**Aturan cara query biar hasilnya useful untuk memory:**

1. **Query spesifik, bukan random** — jangan tanya `"apa aja yang ada"`, tanya `"bagaimana alur auth?"` atau `"siapa import AppError?"`
2. **Jawaban harus struktural** — sebut nama file, community, edge type. Jangan cuma "AppError itu error class"
3. **`--nodes` diisi node yang benar-benar relevan** — bukan semua node yang muncul
4. **Kalau ragu, skip save** — lebih baik gak di-save daripada di-save dengan `useful` tapi jawaban ngawur

**Contoh dari sesi ini yang sudah di-save:**
```
"Kenapa AppError muncul di hampir semua module?"
"Bagaimana peran crud-router.ts, prisma.ts, routes/index.ts, academic.route.ts, auth.service.ts?"
```

## Update graph jika kode berubah

```bash
cd /Users/yoga/Developer/Personal/Scratch/scratch-gui/backend
graphify extract --update
graphify export html
```

## Urutan kerja

1. **Cek graph dulu** — `graphify query` sebelum baca file
2. Planning
3. Implementasi
4. **Update graph** — `graphify extract --update` (jika ada perubahan kode)
5. **Save query useful** — `graphify query → save-result --outcome useful`
6. TypeScript check
7. Selesai

<!-- END:graphify-rules -->

<!-- BEGIN:prisma-migration-rules -->

# Prisma — Wajib Migration untuk Setiap Perubahan Skema

```bash
# ✅ BENAR — selalu pakai ini
npx prisma migrate dev --name nama_perubahan
```

```bash
# ❌ SALAH — jangan pernah pakai db push
npx prisma db push
```

## Sebelum mengerjakan perubahan backend

Pastikan migration history dalam keadaan bersih:
```bash
npx prisma migrate status
```

## Jika terjadi drift error

```bash
npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/xxx_fix/migration.sql
npx prisma migrate resolve --applied xxx_fix
```

## Deploy ke production

```bash
npx prisma migrate deploy
```

## Setelah migration / edit schema

```bash
npx prisma generate
```

<!-- END:prisma-migration-rules -->

<!-- BEGIN:typescript-check-rules -->

# TypeScript — Wajib Verifikasi Sebelum Selesai

## Setiap selesai mengerjakan perubahan BACKEND

```bash
cd /Users/yoga/LMS/backend && npx tsc --noEmit
```

Tidak boleh ada error. Jika ada error, perbaiki dulu.

## Setiap selesai mengerjakan perubahan FRONTEND

```bash
cd /Users/yoga/LMS/frontend && npx tsc --noEmit && npx eslint app/dashboard/admin/
```

Tidak boleh ada error TypeScript. ESLint minimal zero errors (warnings diperbolehkan jika sudah ada sebelumnya).

## Urutan kerja yang benar

1. Baca kode yang ada
2. Planning
3. Implementasi
4. **Run `tsc --noEmit` di backend** (jika ada perubahan backend)
5. **Run `tsc --noEmit` di frontend** (jika ada perubahan frontend)
6. **Run `eslint`** untuk file yang diubah
7. Selesai

<!-- END:typescript-check-rules -->

<!-- BEGIN:production-deployment-rules -->

# Production Deployment — Database Migration

## ℹ️ Database Environment

| Environment | Database | File |
|---|---|---|
| Development (local) | SQLite (`dev.db`) | `.env` → `DATABASE_URL="file:./dev.db"` |
| Production (VM/server) | **PostgreSQL** | `.env` → `DATABASE_URL="postgresql://user:pass@host:5432/db"` |

Migration files (`prisma/migrations/`) kompatibel untuk kedua database — Prisma menangani perbedaan sintaks SQL secara otomatis.

## 🚀 Deploy ke VM / Production

```bash
# 1. Pull code terbaru
git pull

# 2. Generate Prisma Client
cd backend && npx prisma generate

# 3. Backup database
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)

# 4. Apply migration pending
npx prisma migrate deploy

# 5. Restart backend
pm2 restart lms-backend || systemctl restart lms-backend
```

## ❌ Dilarang di Production

| Perintah | Efek |
|---|---|
| `prisma db push` | Tidak buat migration file — tidak ada riwayat |
| `prisma migrate dev` | Bisa reset database (interaktif) |

## ✅ Wajib di Local

Setiap perubahan skema:
```bash
npx prisma migrate dev --name nama_perubahan
```

## 🧯 Jika Error Migration di VM

```bash
# Cek status
npx prisma migrate status

# Jika ada migration gagal — resolve
npx prisma migrate resolve --rolled-back <nama_migration>

# Atau jika perlu baseline untuk DB existing (database sudah ada tabel)
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/xxx_baseline/migration.sql
npx prisma migrate resolve --applied xxx_baseline
```

## 📁 Commit ke Git — WAJIB

Pastikan file berikut selalu ikut commit:
```
prisma/schema.prisma
prisma/migrations/*/migration.sql
```

Jangan commit:
```
prisma/dev.db
prisma/dev.db.backup.*
```

<!-- END:production-deployment-rules -->
