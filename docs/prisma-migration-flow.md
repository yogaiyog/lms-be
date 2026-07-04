# Prisma Migration Flow — LMS Backend

## Flow Overview (Normal Dev)

```bash
# 1. Edit schema.prisma (tambah/ubah field, table, relasi)

# 2. Buat migration baru
npm run prisma:migrate -- --name deskripsi_perubahan

# 3. Generate Prisma Client (otomatis oleh migrate dev)
# 4. Jalankan seed (otomatis oleh migrate dev, skip dengan --skip-seed)
npm run db:seed
```

## Step-by-Step

### A. Tambah Field Baru (contoh: `projectLink` di `AttendanceAssessment`)

1. Edit `prisma/schema.prisma` → tambah field
2. Jalankan:
   ```bash
   npm run prisma:migrate -- --name add_project_link_to_assessment
   ```
   - Ini akan membuat file migration SQL di `prisma/migrations/`
   - Otomatis menjalankan seed setelah migrate
   - Gunakan `--skip-seed` kalau tidak ingin seed langsung jalan
3. Prisma Client langsung ter-generate ulang

### B. Tambah Table Baru

1. Tambah model di `prisma/schema.prisma`
2. Sama seperti A.2 → `npm run prisma:migrate -- --name create_xxx_table`
3. Kalau table baru dipakai di seed, edit `prisma/seed.ts`
4. Jalankan seed: `npm run db:seed`

### C. Edit Relasi / Constraint

1. Ubah model di schema.prisma
2. Buat migration → `npm run prisma:migrate -- --name update_relasi_xxx`

### D. Reset Database (hapus semua data, apply dari awal)

```bash
npm run db:reset
```

Ini akan:
- Drop semua table
- Re-apply semua migration dari 0
- Jalankan seed

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run prisma:migrate -- --name xxx` | Buat migration baru + apply + seed |
| `npm run prisma:deploy` | Apply migration di production/staging |
| `npm run db:push` | Sync schema langsung tanpa migration (cepat tapi ga track history) |
| `npm run db:seed` | Jalankan seed aja |
| `npm run db:reset` | Reset DB + seed |
| `npm run prisma:generate` | Generate Prisma Client (otomatis di migrate) |
| `npm run prisma:studio` | Buka Prisma Studio UI |
| `npx prisma migrate dev --create-only --name xxx` | Buat migration file tanpa apply |

## Notes Penting

- **Jangan** pakai `db:push` di production — pakai `prisma:deploy`
- `db:push` cocok untuk development cepat, tapi **lebih baik selalu pakai migration** biar history ter-track
- Kalau habis `db:push` lalu ingin bikin migration, bisa conflict karena database sudah berubah. Solusinya:
  1. `npm run db:reset` dulu (data hilang)
  2. Lalu buat migration baru
- `prisma:migrate` otomatis menjalankan seed — kalau seed error, migration tetap terapply, hanya seed yang gagal
- Gunakan `prisma migrate dev --create-only` kalau hanya ingin generate file SQL tanpa apply ke DB

## Workflow Harian Ideal

```bash
git pull
npm run prisma:deploy       # apply migration baru dari team
npm run db:seed             # seed ulang kalau ada perubahan data
npm run dev                 # mulai development
```

## Migration Files Location

```
prisma/migrations/
  └─ <timestamp>_<name>/
    └─ migration.sql
```
