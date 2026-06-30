# LMS Backend

Express + Prisma + TypeScript backend untuk skema LMS.

## Struktur

- `src/config` untuk validasi env dan konfigurasi aplikasi
- `src/lib` untuk singleton Prisma
- `src/middlewares` untuk not-found dan error handling
- `src/routes` untuk route level aplikasi
- `src/modules` untuk domain feature yang scalable

## Jalankan

```bash
npm install
npm run prisma:generate
npm run dev
```

## Prisma

Schema ada di `prisma/schema.prisma` dan disesuaikan dengan isi `dbschema.txt`.

## CRUD Endpoints

- `/api/v1/users`
- `/api/v1/parent-profiles`
- `/api/v1/tutor-profiles`
- `/api/v1/student-profiles`
- `/api/v1/academic/classes`
- `/api/v1/academic/enrollments`
- `/api/v1/academic/schedules`
- `/api/v1/academic/attendances`
- `/api/v1/academic/announcements`
- `/api/v1/gamification/badges`
- `/api/v1/gamification/student-badges`

Semua endpoint mendukung:

- `GET /` list
- `GET /:id` detail
- `POST /` create
- `PATCH /:id` update
- `DELETE /:id` delete

## Berikutnya

- Tambahkan migration saat `DATABASE_URL` sudah siap
- Isi route per modul sesuai kebutuhan bisnis
