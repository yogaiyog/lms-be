# Graph Report - backend  (2026-08-01)

## Corpus Check
- 136 files · ~88,685 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 652 nodes · 1040 edges · 39 communities (36 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5bac85b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App Config & Reports
- NPM Dependencies
- Route Setup & Module Router
- Certificate Service
- Prisma Seeds
- Dev Dependencies
- App Core & Error Handling
- Path References
- Package Metadata
- CRUD Module Routes
- Scratch Curriculum
- Python Curriculum
- OpenAPI Docs
- Badges Module
- CRUD Router Factory
- Report PDF Service
- Deployment & Env
- Certificates Route
- Quiz Images & Uploads
- Enrollments Module
- Student Topic Progress
- Prisma Client & Saved Reports
- Attendances Module
- Schedules Module
- invoice-pdf.service.ts
- Q: Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?
- scripts
- Q: Bagaimana alur lengkap pembayaran Midtrans di backend?
- Q: Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?
- Q: Bagaimana fitur delete invoice dengan validasi bekerja?
- Upload Schema
- TypeScript Verification
- Q: Bagaimana cara menghitung expiry pembayaran (Expired At) di halaman detail invoice?
- attendances.route.ts
- Q: Kenapa charge Midtrans 400 fetch failed saat edit invoice / ganti metode pembayaran?
- Q: Field Jatuh Tempo (dueDate) dihapus total dari invoice — apa saja yang diubah?
- Q: Bagaimana alur download PDF invoice dan kirim email di billing admin?
- ngrok-sync.sh

## God Nodes (most connected - your core abstractions)
1. `createCrudRouter()` - 23 edges
2. `AppError` - 22 edges
3. `mapPrismaError()` - 15 edges
4. `scripts` - 13 edges
5. `compilerOptions` - 13 edges
6. `CertificateService` - 12 edges
7. `Role` - 12 edges
8. `CertificateData` - 11 edges
9. `Python Explorer Curriculum (12 Sessions)` - 11 edges
10. `TemplateService` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Prisma Migration Flow Document` --conceptually_related_to--> `Prisma Migration Rules`  [INFERRED]
  docs/prisma-migration-flow.md → AGENTS.md
- `LMS Backend (Express + Prisma + TypeScript)` --references--> `Prisma Migration Flow Document`  [INFERRED]
  README.md → docs/prisma-migration-flow.md
- `main()` --references--> `@prisma/client`  [EXTRACTED]
  scripts/update-image-urls.ts → package.json
- `getOrUploadImage()` --calls--> `uploadFile()`  [EXTRACTED]
  prisma/seed-topics-ce.ts → src/services/minio/minio.service.ts
- `uploadSampleProjects()` --calls--> `uploadFile()`  [EXTRACTED]
  prisma/seed-topics-ce.ts → src/services/minio/minio.service.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Prisma Migration Command Workflow** — backend_prisma_migrate_cmd, backend_prisma_db_push, backend_env_sqlite_dev, backend_env_postgresql_prod, agents_md_prisma_migration_rules [EXTRACTED 1.00]
- **Python Curriculum Progression (Sessions 1-12)** — backend_python_fundamentals, backend_python_variables_types, backend_python_operators_fstrings, backend_python_conditionals, backend_python_while_loops, backend_python_for_loops, backend_python_lists, backend_python_dictionaries, backend_python_functions, backend_python_string_manipulation, backend_python_capstone_cashier [INFERRED 0.95]
- **Code Explorer Quiz Image Series (Topic 6)** — uploadseed_quiz_image_topics_6_code_exploler_1, uploadseed_quiz_image_topics_6_code_exploler_2, uploadseed_quiz_image_topics_6_code_exploler_3, uploadseed_quiz_image_topics_6_code_exploler_4, uploadseed_quiz_image_topics_6_code_exploler_5, uploadseed_quiz_image_topics_6_code_exploler_6, topic_code_explorer [INFERRED 0.95]

## Communities (39 total, 3 thin omitted)

### Community 0 - "App Config & Reports"
Cohesion: 0.15
Nodes (14): AspectAnalysis, reportPdfService, reportsRouter, ScheduleReportPayload, StudentReport, COLORS, drawRect(), drawText() (+6 more)

### Community 1 - "NPM Dependencies"
Cohesion: 0.05
Nodes (39): bcryptjs, cors, dotenv, express, helmet, jsonwebtoken, minio, morgan (+31 more)

### Community 2 - "Route Setup & Module Router"
Cohesion: 0.05
Nodes (35): authPaths, authRequestSchemas, baseSchemas, bearerAuth, idParam, stringDate, stringUuid, swaggerDoc (+27 more)

### Community 3 - "Certificate Service"
Cohesion: 0.10
Nodes (19): baseRouter, certificateService, include, router, certificateBatchGenerateSchema, certificateCreateSchema, certificateGenerateSchema, certificateUpdateSchema (+11 more)

### Community 4 - "Prisma Seeds"
Cohesion: 0.11
Nodes (22): main(), prisma, codeExplorerUnits, CodeLevel, CodeUnit, getOrUploadImage(), resolveQuizImages(), seedCodeExplorer() (+14 more)

### Community 5 - "Dev Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, prisma, tsx, @types/bcryptjs, @types/cors, @types/express, @types/jsonwebtoken, @types/morgan (+19 more)

### Community 6 - "App Core & Error Handling"
Cohesion: 0.07
Nodes (32): mapPrismaError(), classesRouter, commonInclude, handleError(), classCreateSchema, classUpdateSchema, commonInclude, curriculumsRouter (+24 more)

### Community 7 - "Path References"
Cohesion: 0.10
Nodes (20): dist, node, node_modules, prisma, src/**/*.ts, compilerOptions, baseUrl, esModuleInterop (+12 more)

### Community 8 - "Package Metadata"
Cohesion: 0.08
Nodes (29): createApp(), envSchema, parsedEnv, errorMiddleware(), notFoundMiddleware(), baseRouter, include, isTransientNetworkError() (+21 more)

### Community 9 - "CRUD Module Routes"
Cohesion: 0.06
Nodes (39): createCrudRouter(), CreateCrudRouterOptions, handleError(), parsePagination(), PrismaDelegate, globalForPrisma, savedReportsRouter, announcementsRouter (+31 more)

### Community 10 - "Scratch Curriculum"
Cohesion: 0.19
Nodes (13): Algorithms and Problem Solving, Clone/Object Instancing in Scratch, Conditionals in Scratch, Debugging in Scratch, Digital Citizenship Curriculum Concept, Event-Driven Programming in Scratch, Input/Output and Looks in Scratch, IPO (Input-Process-Output) and Sensing (+5 more)

### Community 11 - "Python Curriculum"
Cohesion: 0.27
Nodes (12): Python Capstone: Cashier Application, Python Conditionals (if-elif-else), Python Dictionaries, Python For Loops and range(), Python Functions (def, parameters, return), Python Fundamentals — print, comments, input, Python Lists, Python Operators and f-Strings (+4 more)

### Community 12 - "OpenAPI Docs"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana alur wizard buat invoice baru dengan pilihan metode pembayaran (manual/VA/QRIS/e-wallet) di admin dashboard?, Source Nodes

### Community 13 - "Badges Module"
Cohesion: 0.07
Nodes (26): API Routes, Auto-Generate Nomor Invoice, Backend Routes, Current Problems, Enrollment, Entity Relationship Diagram, Flow 1: Admin Buat Enrollment, Flow 2: Admin Assign Siswa ke Kelas (+18 more)

### Community 14 - "CRUD Router Factory"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Kenapa AppError muncul di hampir semua module?, Source Nodes

### Community 15 - "Report PDF Service"
Cohesion: 0.26
Nodes (7): badgesRouter, badgeCreateSchema, badgeUpdateSchema, gamificationRouter, studentBadgesRouter, studentBadgeCreateSchema, studentBadgeUpdateSchema

### Community 16 - "Deployment & Env"
Cohesion: 0.20
Nodes (10): Prisma Migration Rules, Production Deployment Rules, PostgreSQL Production Database, SQLite Development Database, prisma db push — Forbidden in Production, prisma migrate dev — Wajib Migration Command, Prisma Migration Flow Document, CRUD API Endpoints (+2 more)

### Community 17 - "Certificates Route"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran academic.route.ts sebagai god node?, Source Nodes

### Community 18 - "Quiz Images & Uploads"
Cohesion: 0.25
Nodes (8): Topic 6: Code Explorer, Quiz Image Seed Data, Code Explorer Quiz Image 1, Code Explorer Quiz Image 2, Code Explorer Quiz Image 3, Code Explorer Quiz Image 4, Code Explorer Quiz Image 5, Code Explorer Quiz Image 6

### Community 19 - "Enrollments Module"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran auth.service.ts sebagai god node?, Source Nodes

### Community 20 - "Student Topic Progress"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran crud-router.ts sebagai god node?, Source Nodes

### Community 21 - "Prisma Client & Saved Reports"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran prisma.ts sebagai god node?, Source Nodes

### Community 22 - "Attendances Module"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran routes/index.ts sebagai god node?, Source Nodes

### Community 23 - "Schedules Module"
Cohesion: 0.50
Nodes (3): 2026-07-27: Prettier 62 playground files, 2026-07-27: Scratchblocks syntax untuk operator blocks, 2026-07-27: Starter variable pattern (counter)

### Community 24 - "invoice-pdf.service.ts"
Cohesion: 0.10
Nodes (25): baseRouter, include, router, invoiceCreateSchema, invoiceUpdateSchema, calculateInvoice(), generateInvoiceNumber(), syncEnrollmentMeetCounts() (+17 more)

### Community 25 - "Q: Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?, Source Nodes

### Community 26 - "scripts"
Cohesion: 0.10
Nodes (19): name, prisma, seed, private, scripts, build, db:push, db:reset (+11 more)

### Community 27 - "Q: Bagaimana alur lengkap pembayaran Midtrans di backend?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana alur lengkap pembayaran Midtrans di backend?, Source Nodes

### Community 28 - "Q: Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?, Source Nodes

### Community 29 - "Q: Bagaimana fitur delete invoice dengan validasi bekerja?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana fitur delete invoice dengan validasi bekerja?, Source Nodes

### Community 33 - "Q: Bagaimana cara menghitung expiry pembayaran (Expired At) di halaman detail invoice?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana cara menghitung expiry pembayaran (Expired At) di halaman detail invoice?, Source Nodes

### Community 34 - "attendances.route.ts"
Cohesion: 0.08
Nodes (36): forbidden(), unauthorized(), authenticate(), requireRole(), forgotPasswordSchema, loginSchema, logoutSchema, parentRegisterSchema (+28 more)

### Community 35 - "Q: Kenapa charge Midtrans 400 fetch failed saat edit invoice / ganti metode pembayaran?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Kenapa charge Midtrans 400 fetch failed saat edit invoice / ganti metode pembayaran?, Source Nodes

### Community 36 - "Q: Field Jatuh Tempo (dueDate) dihapus total dari invoice — apa saja yang diubah?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Field Jatuh Tempo (dueDate) dihapus total dari invoice — apa saja yang diubah?, Source Nodes

### Community 37 - "Q: Bagaimana alur download PDF invoice dan kirim email di billing admin?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana alur download PDF invoice dan kirim email di billing admin?, Source Nodes

## Knowledge Gaps
- **235 isolated node(s):** `name`, `version`, `private`, `type`, `ngrok` (+230 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `invoices.service.ts` (2× useful, score=1.977010598)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qrcode` connect `NPM Dependencies` to `invoice-pdf.service.ts`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `scripts`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _235 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Route Setup & Module Router` be split into smaller, more focused modules?**
  _Cohesion score 0.05429864253393665 - nodes in this community are weakly interconnected._
- **Should `Certificate Service` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Prisma Seeds` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._