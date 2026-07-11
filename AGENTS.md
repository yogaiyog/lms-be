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
