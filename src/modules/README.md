# Module Layout

Setiap domain feature sebaiknya punya folder sendiri.

Contoh:

- `auth`
- `users`
- `academic`
- `gamification`

Pola yang dipakai:

- `*.route.ts` untuk HTTP layer
- `*.controller.ts` untuk request/response mapping
- `*.service.ts` untuk business logic
- `*.repository.ts` untuk akses Prisma
