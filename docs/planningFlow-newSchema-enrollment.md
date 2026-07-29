# Planning: Flow Enrollment Baru & Schema Invoice + Payment

## Current Problems

| Problem | Root Cause | Impact |
|---|---|---|
| `classId` hilang dari enrollment | `enrollments.route.ts:153` — `classId: payload.classId ?? null` — saat PATCH tanpa `classId`, undefined ?? null = null | Admin harus pasang ulang kelas/kadang kelas keapus |
| `verified` ambigu | Field boolean di Enrollment, auto-set saat ubah `totalMeetPurchased`, tidak jelas artinya | Ga bisa bedain "sudah bayar" vs "sudah dicek admin" |
| Flow bikin enrollment campur aduk | Ada 4+ cara: langsung di enrollment modal, via create class, class detail add student, parent dashboard | Membingungkan admin |
| Tidak ada invoice / payment | Tidak ada model, semua manual | Ga siap payment gateway, ga ada nomor invoice formal, ga ada tracking pajak |

---

## Schema Final

### Enrollment

```prisma
model Enrollment {
  id                 String       @id @default(uuid())

  // Student
  studentId          String
  student            StudentProfile @relation(fields: [studentId], references: [id], onDelete: Cascade)

  // Class — set ONLY from Class UI, not Enrollment UI
  classId            String?
  class              Class?       @relation(fields: [classId], references: [id])

  // Curriculum
  curriculumId       String
  curriculum         Curriculum   @relation(fields: [curriculumId], references: [id])

  joinedAt           DateTime     @default(now())

  // Meet tracking (computed / synced from Invoice + MeetUsage)
  totalMeetPurchased Int          @default(0)
  totalMeetLeft      Int          @default(0)

  // Relations
  invoices           Invoice[]
  meetUsages         MeetUsage[]

  @@unique([studentId, classId])
}
```

**Perubahan:**
- Hapus `verified` — diganti `Invoice.status`
- Tambah `invoices Invoice[]`

---

### Invoice

```prisma
model Invoice {
  id            String     @id @default(uuid())
  enrollmentId  String
  enrollment    Enrollment @relation(fields: [enrollmentId], references: [id])

  number        String     @unique             // INV-2026-000001 (auto-generated)
  description   String?                        // "Pembelian 12 sesi Code-Explorer"
  meetCount     Int        @default(0)          // Jumlah sesi yang dibeli

  // Pricing
  subtotal      Decimal    @db.Decimal(10, 2)
  taxPercent    Decimal?   @db.Decimal(5, 2)    // PPN 11%
  taxAmount     Decimal?   @db.Decimal(10, 2)
  total         Decimal    @db.Decimal(10, 2)

  // Status
  status        String     @default("DRAFT")     // DRAFT | UNPAID | PAID | PARTIAL | REFUNDED | CANCELLED
  dueDate       DateTime?                       // Jatuh tempo
  paidAt        DateTime?                       // Tanggal lunas
  notes         String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  payments      Payment[]

  @@index([enrollmentId])
  @@index([status])
}
```

**Catatan:**
- PDF invoice di-generate on-the-fly via route `GET /invoices/:id/pdf` (ga perlu `pdfUrl`)
- `number` auto-generated saat invoice dibuat: `INV-{year}-{sequence}`
- `totalMeetPurchased` di Enrollment = SUM(`Invoice.meetCount`) WHERE `status` = PAID

---

### Payment

```prisma
model Payment {
  id            String    @id @default(uuid())
  invoiceId     String
  invoice       Invoice   @relation(fields: [invoiceId], references: [id])

  amount        Decimal   @db.Decimal(10, 2)
  paymentMethod String?                               // QRIS | TRANSFER | CASH | GATEWAY
  status        String    @default("PENDING")          // PENDING | SETTLEMENT | EXPIRED | DENY | REFUND
  transactionId String?                               // Dari payment gateway
  gateway       String?                               // midtrans | xendit
  paidAt        DateTime?
  createdAt     DateTime  @default(now())

  @@index([invoiceId])
  @@index([transactionId])
}
```

**Catatan:**
- 1 Invoice bisa punya banyak Payment (partial payment)
- Saat payment settlement → update `Invoice.status`:
  - Semua Payment settlement = PAID
  - Sebagian Payment settlement = PARTIAL
  - Ada Payment refund = REFUNDED (atau PARTIAL kalau sebagian)

---

### Entity Relationship Diagram

```
┌──────────────────┐
│   Curriculum     │
└────────┬─────────┘
         │ 1:N
         ▼
┌──────────────────┐      ┌──────────────┐      ┌──────────────┐
│   Enrollment     │◄─────│   Invoice    │◄─────│   Payment    │
│                  │1:N   │              │1:N   │              │
│  studentId       │      │  number      │      │  amount      │
│  classId? ──┐    │      │  meetCount   │      │  method      │
│  curriculumId  │  │      │  subtotal    │      │  status      │
│  totalMeet*    │  │      │  taxPercent  │      │  txnId       │
│                │  │      │  taxAmount   │      │  gateway     │
└──────────────────┘      │  total       │      └──────────────┘
         │                │  status      │
         │ N:1            │  dueDate     │
         ▼                │  paidAt      │
┌──────────────────┐      └──────────────┘
│      Class       │
│                  │
│  name            │
│  type (BATCH...) │
│  tutors[]        │
│  curriculumId    │
└──────────────────┘
```

---

## New Enrollment Flow

### Prinsip Dasar

| Layer | Artinya | Dibuat di |
|---|---|---|
| **Enrollment** | "Siswa ini belajar kurikulum X" | Tab Enrollment |
| **Class** | "Kelas dengan jadwal & tutor" | Tab Class |
| **Invoice** | "Tagihan untuk pembayaran" | Sub-modal dari Enrollment |
| **Payment** | "Pembayaran aktual" | Auto/manual dari Invoice |

**Aturan:**
1. Enrollment dibuat DULUAN (tanpa class)
2. Class dibuat/dipilih dari Tab Class
3. Assign classId di enrollment HANYA dari Class UI (Class detail → Tambah Siswa)
4. Invoice di-generate dari Enrollment (1 Enrollment bisa punya banyak Invoice = top-up)

---

### Flow 1: Admin Buat Enrollment

```
┌──────────────────────────────────────────────────────────────────┐
│ TAB ENROLLMENT (Admin)                                            │
│                                                                    │
│ 1. Klik "+ Tambah Enrollment"                                     │
│    ├─ Pilih siswa (existing StudentProfile)                       │
│    ├─ Pilih kurikulum (Code/Scratch/Python)                       │
│    └─ (TIDAK ADA pilih class — dihapus dari form!)                │
│                                                                    │
│ 2. CREATE Enrollment                                              │
│    → studentId + curriculumId + totalMeetPurchased=0              │
│                                                                    │
│ 3. Muncul di tabel:                                               │
│    ┌──────────┬──────────────┬───────────┬──────────┬───────────┐ │
│    │  Siswa   │  Kurikulum   │  Invoice  │  Kelas   │  Aksi     │ │
│    ├──────────┼──────────────┼───────────┼──────────┼───────────┤ │
│    │  Rafa    │  Code-Explorer│  -        │  -       │ +Invoice  │ │
│    │  Luna    │  Python-Explorer│ INV-00001│ Batch A  │ Kelola    │ │
│    └──────────┴──────────────┴───────────┴──────────┴───────────┘ │
│                                                                    │
│ 4. Admin klik "+Invoice" → buat Invoice                            │
│    → CREATE Invoice (auto-generate INV-2026-000001)                │
│    → status = DRAFT                                                │
│    → Admin edit meetCount, subtotal, tax, dueDate                  │
│    → Simpan → status jadi UNPAID                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### Flow 2: Admin Assign Siswa ke Kelas

```
┌──────────────────────────────────────────────────────────────────┐
│ TAB CLASS (Admin)                                                  │
│                                                                    │
│ 1. Admin buat class baru ATAU buka class detail                   │
│                                                                    │
│ 2. Di class detail → "Tambah Siswa"                               │
│    ├─ Fetch enrollment yang:                                      │
│    │   - curriculumId = class.curriculumId                        │
│    │   - classId = null (belum punya kelas)                       │
│    │   - Invoice status = PAID / UNPAID                           │
│    ├─ Tampilkan list + centang                                    │
│    └─ SIMPAN → PATCH enrollment.classId = class.id                │
│                                                                    │
│ 3. Hapus siswa dari kelas:                                        │
│    ├─ Klik "Hapus dari kelas"                                     │
│    └─ PATCH enrollment.classId = null                             │
│        → Enrollment kembali ke "Belum ada kelas"                  │
│        → Invoice ga terpengaruh                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### Flow 3: Pembayaran

```
┌──────────────────────────────────────────────────────────────────┐
│ INVOICE (Admin)                                                    │
│                                                                    │
│ Invoice UNPAID (nomor INV-2026-000001)                             │
│   ┌──────────────────────────────────────────────────────────┐    │
│   │ Deskripsi: Pembelian 12 sesi Code-Explorer                │    │
│   │ Subtotal: Rp 1.200.000                                    │    │
│   │ PPN 11%:  Rp 132.000                                      │    │
│   │ Total:    Rp 1.332.000                                    │    │
│   │ Jatuh Tempo: 14 Agu 2026                                  │    │
│   └──────────────────────────────────────────────────────────┘    │
│                              │                                     │
│              ┌───────────────┴───────────────┐                     │
│              ▼                               ▼                     │
│     [Pembayaran Manual]             [Payment Gateway]              │
│     Admin catat transfer            Parent bayar via QRIS          │
│              │                               │                     │
│              ▼                               ▼                     │
│     CREATE Payment:                  Callback → CREATE             │
│     - amount: 1332000               Payment:                       │
│     - method: TRANSFER              - amount: 1332000              │
│     - status: SETTLEMENT            - method: QRIS                 │
│              │                      - status: SETTLEMENT            │
│              │                      - txnId: dari gateway           │
│              │                      - gateway: midtrans             │
│              └───────────────┬───────────────┘                     │
│                              ▼                                     │
│     Invoice.status → PAID                                         │
│     Invoice.paidAt → sekarang                                      │
│     Enrollment.totalMeetPurchased += meetCount (12)                │
│     Enrollment.totalMeetLeft += meetCount (12)                     │
│                                                                    │
│     Generate PDF invoice (on-the-fly):                             │
│     GET /api/v1/invoices/{id}/pdf → download                       │
│     Kirim ke parent via WA / email                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

### Flow 4: Top-Up / Beli Sesi Tambahan

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Enrollment udah ada (status punya kelas, punya invoice lama)   │
│ 2. Admin klik "+Invoice Baru"                                     │
│    → CREATE Invoice baru di enrollment yang sama                  │
│    → INV-2026-000002, meetCount=8                                 │
│ 3. Parent bayar → Payment settlement → Invoice PAID               │
│ 4. Enrollment.totalMeetPurchased += 8                             │
│    Enrollment.totalMeetLeft += 8                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### Flow 5: Partial Payment (Bayar Cicil)

```
┌──────────────────────────────────────────────────────────────────┐
│ Invoice INV-2026-000001 (UNPAID, total Rp 1.332.000)              │
│                                                                    │
│ Cicilan 1:                                                         │
│   CREATE Payment: amount 700.000, status SETTLEMENT                │
│   Sum Payment: 700.000 < 1.332.000                                │
│   Invoice.status → PARTIAL                                         │
│                                                                    │
│ Cicilan 2:                                                         │
│   CREATE Payment: amount 632.000, status SETTLEMENT                │
│   Sum Payment: 1.332.000 == 1.332.000                             │
│   Invoice.status → PAID                                            │
│   Invoice.paidAt → sekarang                                        │
│   Enrollment.totalMeetPurchased += meetCount                       │
└──────────────────────────────────────────────────────────────────┘
```

---

### Flow 6: Refund (Partial)

```
┌──────────────────────────────────────────────────────────────────┐
│ Invoice INV-2026-000001 (PAID, total Rp 1.332.000)                │
│                                                                    │
│ Admin refund Rp 400.000:                                           │
│   CREATE Payment: amount 400.000, status REFUND                   │
│   Net: 1.332.000 - 400.000 = 932.000                              │
│   Invoice.status → REFUNDED (atau PARTIAL)                         │
│   Enrollment.totalMeetPurchased ← dihitung ulang / manual adjust   │
└──────────────────────────────────────────────────────────────────┘
```

---

### Flow 7: Trial Class

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. Admin → "Buat Trial Account"                                   │
│    ├─ Input: nama siswa, parent, email, password                  │
│    └─ Pilih 1 topic (dari Code / Scratch / Python)                │
│                                                                    │
│ 2. System create:                                                  │
│    ├─ User (STUDENT) + StudentProfile + ParentProfile             │
│    ├─ Enrollment (curriculumId, classId=null)                     │
│    ├─ Invoice (meetCount=1, total=0, status=PAID)                 │
│    └─ TrialTopic record: studentId + topicId                      │
│                                                                    │
│ 3. Student login → cuma lihat 1 topic (trial)                     │
│    └─ Banner: "Trial — tersisa X hari"                             │
│                                                                    │
│ 4. Admin konversi ke full:                                         │
│    ├─ Hapus TrialTopic                                             │
│    ├─ Buat Invoice baru (full price)                               │
│    └─ Assign ke kelas (jika ada)                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Migration Plan

### Prisma Migration

```bash
npx prisma migrate dev --name add_invoice_payment_models
```

### Seed Update

| File | Perubahan |
|---|---|
| `seed.ts` | Hapus `verified` dari Enrollment create. Tambah Invoice create untuk Dito. Update summary |
| `seed-topics.ts` | Tidak ada perubahan |
| `seed-topics-py.ts` | Tidak ada perubahan |
| `seed-topics-ce.ts` | Tidak ada perubahan |

### Backend Routes

| Route | Perubahan |
|---|---|
| `enrollments.route.ts` | Fix bug PATCH `?? null` → `"classId" in payload ? payload.classId : undefined`. Hapus `verified` dari update handler |
| `enrollments.schema.ts` | Hapus `verified` dari create + update schema |
| `invoices.route.ts` | **BARU** — CRUD Invoice + GET `/pdf` |
| `invoices.schema.ts` | **BARU** — Zod schema create/update Invoice |
| `payments.route.ts` | **BARU** — CRUD Payment |
| `payments.schema.ts` | **BARU** — Zod schema create/update Payment |
| `invoices/` sub-module | **BARU** — InvoiceService (auto-generate number, hitung total, update status) |
| `academic.route.ts` | Mount invoices + payments router |

### Frontend Changes

| File | Perubahan |
|---|---|
| **Admin — Enrollment tab** | |
| `StudentDetailModal` / enrollment create modal | Hapus input `classId`. Hapus input `verified`. Tambah tombol "Buat Invoice" |
| Enrollment list table | Hapus kolom `verified`. Tambah kolom "Invoice" (latest invoice number + status) + "Kelas" |
| **Admin — Class tab** | |
| ClassDetailModal — "Tambah Siswa" | Fetch enrollment unassigned by curriculum. Multi-select → PATCH classId |
| Class creation modal | Hapus multi-select siswa saat buat class |
| **Admin — Invoice** | **BARU** |
| Invoice modal | Edit: meetCount, subtotal, taxPercent, dueDate. Auto-hitung: taxAmount, total. Tombol "Generate PDF" |
| Invoice list (sub-modal dari enrollment) | Daftar invoice per enrollment. Status badges (DRAFT/UNPAID/PAID/PARTIAL) |
| Payment list (sub-modal dari invoice) | Daftar payment per invoice. Tombol "Tambah Pembayaran" + "Refund" |
| **Student — Dashboard** | |
| EnrollmentTab | Di-simplify — show curriculum + class + invoice status. Tidak perlu lihat detail payment |
| OverviewTab | Tambah banner kalau trial (nanti) |
| **Seed** | |
| `seed.ts` | Update seed — hapus `verified`, sesuaikan enrollment create |

---

## Auto-Generate Nomor Invoice

```
Format: INV-{YYYY}-{sequence}
Contoh: INV-2026-000001, INV-2026-000002

Logic:
1. Query last invoice number today: INV-2026-XXXXXX
2. Ambil XXXXXX terakhir + 1
3. Jika rollover year → reset ke 000001
```

---

## API Routes

### Invoices

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/academic/invoices` | List all invoices (filter: enrollmentId, status) |
| `GET` | `/api/v1/academic/invoices/:id` | Get invoice detail + payments |
| `POST` | `/api/v1/academic/invoices` | Create invoice (auto-gen number) |
| `PATCH` | `/api/v1/academic/invoices/:id` | Update invoice |
| `DELETE` | `/api/v1/academic/invoices/:id` | Delete invoice (only DRAFT) |
| `GET` | `/api/v1/academic/invoices/:id/pdf` | Generate + download PDF |

### Payments

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/academic/payments?invoiceId=X` | List payments by invoice |
| `POST` | `/api/v1/academic/payments` | Create payment |
| `PATCH` | `/api/v1/academic/payments/:id` | Update payment (status change) |

---

## Priority Eksekusi

| # | Task | Priority |
|---|---|---|
| 1 | Migration: schema baru (Invoice + Payment + hapus verified) | HIGH |
| 2 | Fix bug PATCH enrollment (`?? null`) | HIGH |
| 3 | Backend: Invoice routes + service (auto-gen number) | HIGH |
| 4 | Backend: Payment routes | HIGH |
| 5 | Backend: Update enrollment routes (hapus verified) | HIGH |
| 6 | Backend: Enrollments — hapus classId dari create schema | MED |
| 7 | Frontend: Enrollment tab — hapus classId/verified, tambah invoice column | MED |
| 8 | Frontend: Invoice modal | MED |
| 9 | Frontend: Class detail — "Tambah Siswa" dari enrollment | MED |
| 10 | Frontend: Payment modal | LOW |
| 11 | Frontend: Invoice PDF generation | LOW |
| 12 | Seed update | LOW |
| 13 | Trial class flow | LATER |
| 14 | Payment gateway integration (Midtrans/Xendit) | LATER |
