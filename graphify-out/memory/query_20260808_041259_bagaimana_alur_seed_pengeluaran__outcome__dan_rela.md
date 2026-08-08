---
type: "query"
date: "2026-08-08T04:12:59.392314+00:00"
question: "Bagaimana alur seed pengeluaran (outcome) dan relasinya dengan seed-income?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["seed-outcome.ts", "seed-income.ts", "expenses.route.ts", "env.ts"]
---

# Q: Bagaimana alur seed pengeluaran (outcome) dan relasinya dengan seed-income?

## Answer

seed-outcome.ts (prisma/seed-outcome.ts) mengisi segment Pengeluaran (expenses.route.ts:24) untuk 4 kartu byType (TRIAL/BATCH/PRIVATE/MAKEUP). Prasyarat: npm run db:seed + npx tsx prisma/seed-income.ts. Aksi: (1) extendIncomeClass() menambah attendance+assessment+meetUsage + invoice tambahan PAID untuk sisa jadwal di kelas Income-Batch (12/12, +7 pertemuan) dan Income-Private (12/12, +3 pertemuan); (2) seedOutcomeClass() membuat kelas baru Outcome-Trial (kurikulum Trial Class K-2, 1 jadwal) dan Outcome-Makeup (kurikulum Code-Explorer, 1 jadwal) dengan attendance+assessment+invoice PAID; (3) syncInvoiceSequence() + cleanupOutcomeClasses() (idempotent, hapus by nama). Cost tutor dihitung dari TUTOR_COST env (env.ts:43-46) per class.type. Dokumen planning: prisma/seed-outcome.md.

## Outcome

- Signal: useful

## Source Nodes

- seed-outcome.ts
- seed-income.ts
- expenses.route.ts
- env.ts