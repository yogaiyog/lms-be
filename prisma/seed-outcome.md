# Seed Outcome — Pengeluaran (Biaya Tutor)

Seed untuk segment **Pengeluaran** (`GET /api/v1/academic/expenses`) yang relate dengan kelas yang
sudah berjalan dari `seed-income.ts` (kelas `Income-Batch` & `Income-Private`).

## Prasyarat

1. `npm run db:seed` — seed utama (kurikulum, tutor, siswa, assessment set).
2. `npx tsx prisma/seed-income.ts` — membuat kelas `Income-Batch` & `Income-Private` beserta
   enrollment, attendance, dan invoice lunas.

## Tujuan

Mengisi **4 kartu byType** di segment Pengeluaran (TRIAL, BATCH, PRIVATE, MAKEUP) dengan data
attendance sehingga biaya tutor muncul untuk semua tipe kelas.

## Data yang dibuat

1. **Extend kelas Income-Batch** (BATCH, tutor Budi, 3 siswa, kurikulum Code-Explorer)
   - Saat ini baru 5 dari 12 pertemuan berjalan → dilanjutkan sampai **12 pertemuan**.
   - Tambah `Attendance` + `AttendanceAssessment` + `MeetUsage` untuk jadwal tersisa, per siswa.
   - `totalMeetPurchased` enrollment diperbarui ke 12.
   - Invoice tambahan **PAID** (dengan payment SETTLEMENT) untuk pertemuan baru, per siswa.

2. **Extend kelas Income-Private** (PRIVATE, tutor Sari, 1 siswa, kurikulum Code-Explorer)
   - Saat ini baru 9 dari 12 pertemuan berjalan → dilanjutkan sampai **12 pertemuan**.
   - Tambah `Attendance` + `AttendanceAssessment` + `MeetUsage` untuk jadwal tersisa, per siswa.
   - `totalMeetPurchased` enrollment diperbarui ke 12.
   - Invoice tambahan **PAID** (dengan payment SETTLEMENT) untuk pertemuan baru, per siswa.

3. **Kelas baru `Outcome-Trial`** (TRIAL, kurikulum Trial Class K-2)
   - 1 jadwal (Monday 19:00–19:55, tanggal Monday terakhir), `isDone = true`.
   - 1 siswa (reuse dari seed-income), attendance + assessment + meetUsage.
   - Invoice **PAID** + payment **SETTLEMENT**.

4. **Kelas baru `Outcome-Makeup`** (MAKEUP, kurikulum Code-Explorer)
   - 1 jadwal (pola makeup: 1 slot), `isDone = true`.
   - 1 siswa (reuse dari seed-income), attendance + assessment + meetUsage.
   - Invoice **PAID** + payment **SETTLEMENT**.

## Perhitungan Pengeluaran (dari expenses.route.ts)

- Cost tutor diambil dari `TUTOR_COST_*` di env (default: TRIAL 12000, BATCH 20000, PRIVATE 30000, MAKEUP 20000).
- Dihitung dari setiap `Attendance` (status selain RESCHEDULE), dikelompokkan per `class.type`.

## Cara Menjalankan

```bash
cd /Users/yoga/Developer/Personal/Scratch/scratch-gui/backend
npx tsx prisma/seed-outcome.ts
```

Seed idempotent — bila dijalankan ulang, kelas `Outcome-Trial`/`Outcome-Makeup` di-clean lalu
dibuat ulang; kelas `Income-*` hanya dilanjutkan (tidak menghapus data lama).
