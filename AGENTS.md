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
