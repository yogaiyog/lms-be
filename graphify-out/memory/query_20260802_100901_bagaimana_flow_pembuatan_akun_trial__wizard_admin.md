---
type: "query"
date: "2026-08-02T10:09:01.204914+00:00"
question: "Bagaimana flow pembuatan akun trial (wizard admin + endpoint transaksi)?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["trial.service", "trial.schema", "auth.route", "NewTrialWizard", "useAdminDashboard"]
---

# Q: Bagaimana flow pembuatan akun trial (wizard admin + endpoint transaksi)?

## Answer

Flow pembuatan akun trial (admin):
- FE: FAB "+" di app/dashboard/admin/admin-dashboard.tsx membuka wizard NewTrialWizard.tsx (app/dashboard/admin/components/trial/). Step: parent (pilih existing atau buat baru) -> siswa (data + kategori) -> pilih kurikulum trial sesuai kategori -> class TRIAL + tutor + slot jadwal + tanggal.
- BE: endpoint baru POST /api/v1/auth/register/trial (admin-only) di src/modules/auth/trial.route? sebenarnya ada di auth.route.ts + trial.schema.ts + trial.service.ts. Semua dibuat dalam SATU prisma.$transaction: reuse atau buat parent (User PARENT emailVerified=true + ParentProfile), buat student (User STUDENT + StudentProfile), validasi curriculum+tutor, buat Class type "TRIAL" (batch auto +1), Schedule (1 jadwal, tanggal dihitung server), Enrollment totalMeetPurchased=1.
- Keunggulan: email duplikat -> 409 + rollback penuh, tidak ada record parsial (menggantikan bug partial-creation "Email already registered" saat retry).
- Bug FK yang pernah muncul: saat buat parent baru, parentId untuk StudentProfile harus ParentProfile.id, bukan User.id -> perbaiki dengan include: { parentProfile: true } lalu parentId = parentUser.parentProfile.id.

## Outcome

- Signal: useful

## Source Nodes

- trial.service
- trial.schema
- auth.route
- NewTrialWizard
- useAdminDashboard